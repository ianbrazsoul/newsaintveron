from fastapi import FastAPI, APIRouter, Request, HTTPException, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import time
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
from pydantic.functional_validators import BeforeValidator
from typing import List, Optional, Annotated
from bson import ObjectId
import uuid
from datetime import datetime, timezone
from collections import defaultdict

from emails import send_lead_notification, is_email_enabled

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="NEW SAINT VÉRON API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("saint_veron")

# ---------------------------------------------------------------------------
# Mongo serialization helpers
# ---------------------------------------------------------------------------
PyObjectId = Annotated[str, BeforeValidator(str)]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    @classmethod
    def from_mongo(cls, doc: dict):
        if not doc:
            return None
        return cls(**doc)

    def to_mongo(self) -> dict:
        data = self.model_dump(by_alias=True, exclude_none=True)
        data.pop("_id", None)
        return data


# ---------------------------------------------------------------------------
# Rate limiter (in-memory, per client IP)
# ---------------------------------------------------------------------------
RATE_LIMIT_MAX = 5
RATE_LIMIT_WINDOW = 600  # seconds
_rate_store: dict = defaultdict(list)


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _rate_limited(ip: str) -> bool:
    now = time.time()
    window_start = now - RATE_LIMIT_WINDOW
    hits = [t for t in _rate_store[ip] if t > window_start]
    _rate_store[ip] = hits
    if len(hits) >= RATE_LIMIT_MAX:
        return True
    _rate_store[ip].append(now)
    return False


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class LeadCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    company: Optional[str] = Field(default=None, max_length=160)
    phone: Optional[str] = Field(default=None, max_length=40)
    message: str = Field(min_length=10, max_length=4000)
    consent: bool = True
    interest: Optional[str] = Field(default=None, max_length=80)
    # Honeypot: real users leave this empty
    website: Optional[str] = Field(default=None, max_length=200)

    @field_validator("name", "message")
    @classmethod
    def not_blank(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Campo obrigatório")
        return v.strip()


class Lead(BaseDocument):
    name: str
    email: str
    company: Optional[str] = None
    phone: Optional[str] = None
    message: str
    consent: bool = True
    interest: Optional[str] = None
    source: str = "website_contact_form"
    ip: Optional[str] = None
    email_sent: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class LeadResponse(BaseModel):
    success: bool
    message: str


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@api_router.get("/")
async def root():
    return {"message": "NEW SAINT VÉRON API", "status": "online"}


@api_router.get("/health")
async def health():
    return {
        "status": "healthy",
        "email_enabled": is_email_enabled(),
        "time": datetime.now(timezone.utc).isoformat(),
    }


@api_router.post("/leads", response_model=LeadResponse)
async def create_lead(payload: LeadCreate, request: Request, background_tasks: BackgroundTasks):
    ip = _client_ip(request)

    # Honeypot: silently accept but drop bot submissions
    if payload.website and payload.website.strip():
        logger.info("Honeypot triggered; submission dropped.")
        return LeadResponse(success=True, message="Recebido.")

    if _rate_limited(ip):
        logger.info("Rate limit exceeded for a client.")
        raise HTTPException(
            status_code=429,
            detail="Muitas tentativas. Aguarde alguns minutos e tente novamente.",
        )

    lead = Lead(
        name=payload.name,
        email=str(payload.email).lower().strip(),
        company=(payload.company or None),
        phone=(payload.phone or None),
        message=payload.message,
        consent=payload.consent,
        interest=(payload.interest or None),
        ip=ip,
    )

    doc = lead.to_mongo()
    result = await db.leads.insert_one(doc)
    lead_id = str(result.inserted_id)
    logger.info("New lead stored id=%s", lead_id)

    lead_email_payload = {
        "name": lead.name,
        "email": lead.email,
        "company": lead.company,
        "phone": lead.phone,
        "message": lead.message,
        "interest": lead.interest,
    }
    background_tasks.add_task(send_lead_notification, lead_email_payload)

    return LeadResponse(
        success=True,
        message="Recebemos sua mensagem. Nossa equipe retornará em breve.",
    )


@api_router.get("/leads", response_model=List[Lead])
async def list_leads(request: Request):
    admin_token = os.environ.get("ADMIN_API_TOKEN", "").strip()
    provided = request.headers.get("x-admin-token", "").strip()
    if not admin_token or provided != admin_token:
        raise HTTPException(status_code=403, detail="Acesso negado.")
    docs = await db.leads.find().sort("created_at", -1).to_list(500)
    return [Lead.from_mongo(d) for d in docs]


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
