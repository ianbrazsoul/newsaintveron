from fastapi import FastAPI, APIRouter, Request, HTTPException, BackgroundTasks, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
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
from typing import List, Optional, Annotated, Literal
from bson import ObjectId
from pymongo import ReturnDocument
import jwt
import uuid
from datetime import datetime, timezone
from collections import defaultdict

from emails import send_lead_notification, is_email_enabled
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    register_failed_login,
    clear_failed_logins,
    is_locked_out,
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection. Environment variables are required for database-backed
# routes, but the module must still boot so /api/health can diagnose config.
mongo_url = os.getenv('MONGO_URL')
db_name = os.getenv('DB_NAME')
client = AsyncIOMotorClient(mongo_url) if mongo_url else None
db = client[db_name] if client and db_name else None

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


def _require_db():
    if db is None:
        logger.error("MongoDB is not configured: MONGO_URL/DB_NAME are missing.")
        raise HTTPException(status_code=503, detail="Banco de dados não configurado.")
    return db


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
    status: str = "novo"
    note: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class LeadResponse(BaseModel):
    success: bool
    message: str


LEAD_STATUSES = ("novo", "em_contato", "qualificado", "descartado")


class LeadStatusUpdate(BaseModel):
    status: Optional[Literal["novo", "em_contato", "qualificado", "descartado"]] = None
    note: Optional[str] = Field(default=None, max_length=2000)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=200)


class AuthUser(BaseModel):
    id: str
    email: str
    name: str
    role: str


class LoginResponse(BaseModel):
    token: str
    user: AuthUser


# ---------------------------------------------------------------------------
# Auth dependency (Bearer token)
# ---------------------------------------------------------------------------
bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> dict:
    if credentials is None or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Não autenticado.")
    token = credentials.credentials
    try:
        payload = decode_access_token(token)
        database = _require_db()
        user = await database.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="Usuário não encontrado.")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sessão expirada.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido.")


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
        "database_configured": db is not None,
        "email_enabled": is_email_enabled(),
        "time": datetime.now(timezone.utc).isoformat(),
    }


@api_router.post("/leads", response_model=LeadResponse)
async def create_lead(payload: LeadCreate, request: Request, background_tasks: BackgroundTasks):
    database = _require_db()
    ip = _client_ip(request)

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
    result = await database.leads.insert_one(doc)
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


@api_router.post("/auth/login", response_model=LoginResponse)
async def login(payload: LoginRequest, request: Request):
    database = _require_db()
    ip = _client_ip(request)
