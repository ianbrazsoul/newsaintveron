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
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
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


@api_router.post("/auth/login", response_model=LoginResponse)
async def login(payload: LoginRequest, request: Request):
    ip = _client_ip(request)
    email = str(payload.email).lower().strip()
    identifier = f"{ip}:{email}"

    if is_locked_out(identifier):
        raise HTTPException(
            status_code=429,
            detail="Muitas tentativas. Aguarde 15 minutos e tente novamente.",
        )

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        register_failed_login(identifier)
        logger.info("Failed admin login attempt.")
        raise HTTPException(status_code=401, detail="Credenciais inválidas.")

    clear_failed_logins(identifier)
    user_id = str(user["_id"])
    token = create_access_token(user_id, email)
    logger.info("Admin login success.")
    return LoginResponse(
        token=token,
        user=AuthUser(
            id=user_id,
            email=user["email"],
            name=user.get("name", "Admin"),
            role=user.get("role", "admin"),
        ),
    )


@api_router.get("/auth/me", response_model=AuthUser)
async def me(current=Depends(get_current_user)):
    return AuthUser(
        id=current["_id"],
        email=current["email"],
        name=current.get("name", "Admin"),
        role=current.get("role", "admin"),
    )


@api_router.get("/leads/stats")
async def lead_stats(current=Depends(get_current_user)):
    total = await db.leads.count_documents({})
    stats = {"total": total}
    for s in LEAD_STATUSES:
        stats[s] = await db.leads.count_documents({"status": s})
    # legacy leads without a status count as "novo"
    missing = await db.leads.count_documents({"status": {"$exists": False}})
    stats["novo"] += missing
    return stats


@api_router.get("/leads", response_model=List[Lead], response_model_by_alias=False)
async def list_leads(current=Depends(get_current_user), status: Optional[str] = None):
    query = {}
    if status and status in LEAD_STATUSES:
        query = {"status": status} if status != "novo" else {
            "$or": [{"status": "novo"}, {"status": {"$exists": False}}]
        }
    docs = await db.leads.find(query).sort("created_at", -1).to_list(1000)
    return [Lead.from_mongo(d) for d in docs]


@api_router.patch("/leads/{lead_id}", response_model=Lead, response_model_by_alias=False)
async def update_lead(lead_id: str, payload: LeadStatusUpdate, current=Depends(get_current_user)):
    try:
        oid = ObjectId(lead_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido.")

    updates = {}
    if payload.status is not None:
        updates["status"] = payload.status
    if payload.note is not None:
        updates["note"] = payload.note.strip()
    if not updates:
        raise HTTPException(status_code=400, detail="Nada para atualizar.")

    result = await db.leads.find_one_and_update(
        {"_id": oid}, {"$set": updates}, return_document=ReturnDocument.AFTER
    )
    if not result:
        raise HTTPException(status_code=404, detail="Lead não encontrado.")
    return Lead.from_mongo(result)


@api_router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str, current=Depends(get_current_user)):
    try:
        oid = ObjectId(lead_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido.")
    result = await db.leads.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead não encontrado.")
    return {"success": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    # Indexes
    try:
        await db.users.create_index("email", unique=True)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Index creation skipped: %s", type(exc).__name__)
    # Seed single admin from env (idempotent)
    admin_email = os.environ.get("ADMIN_EMAIL", "").lower().strip()
    admin_password = os.environ.get("ADMIN_PASSWORD", "")
    if admin_email and admin_password:
        existing = await db.users.find_one({"email": admin_email})
        if existing is None:
            await db.users.insert_one({
                "email": admin_email,
                "password_hash": hash_password(admin_password),
                "name": "Admin",
                "role": "admin",
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
            logger.info("Admin user seeded.")
        elif not verify_password(admin_password, existing.get("password_hash", "")):
            await db.users.update_one(
                {"email": admin_email},
                {"$set": {"password_hash": hash_password(admin_password)}},
            )
            logger.info("Admin password updated from env.")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
