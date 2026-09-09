from fastapi import FastAPI, APIRouter, Request, HTTPException, BackgroundTasks, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os
import re
import time
import logging
import socket
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

# MongoDB connection. Atlas provides an SRV connection string for discovery.
# If the existing production variable is a standard mongodb:// URI pointing at
# this Atlas cluster, transparently switch only the connection mechanism to the
# equivalent mongodb+srv:// form. Credentials and the configured database stay
# in the environment variable and are never logged or exposed.
mongo_url = os.getenv('MONGO_URL')
db_name = os.getenv('DB_NAME')


def _mongo_connection_uri(uri: Optional[str]) -> tuple[Optional[str], bool]:
    if not uri:
        return None, False
    try:
        from urllib.parse import urlsplit
        parts = urlsplit(uri)
        if parts.scheme != "mongodb":
            return uri, False

        # Only apply the fallback to this Atlas cluster. Other MongoDB
        # deployments must keep their original connection URI untouched.
        if "pyefmcn.mongodb.net" not in parts.netloc:
            return uri, False

        userinfo = ""
        if "@" in parts.netloc:
            userinfo = parts.netloc.rsplit("@", 1)[0] + "@"

        # Preserve ordinary connection options, while allowing Atlas SRV/TXT
        # discovery to provide the authoritative replica set and auth source.
        query_parts = [
            item for item in parts.query.split("&")
            if item
            and not item.lower().startswith("replicaset=")
            and not item.lower().startswith("authsource=")
        ]
        srv_uri = f"mongodb+srv://{userinfo}cluster0.pyefmcn.mongodb.net{parts.path or '/'}"
        if query_parts:
            srv_uri += "?" + "&".join(query_parts)
        return srv_uri, True
    except Exception:
        return uri, False


mongo_connection_uri, using_atlas_srv_fallback = _mongo_connection_uri(mongo_url)
client = AsyncIOMotorClient(mongo_connection_uri) if mongo_connection_uri else None
db = client[db_name] if client and db_name else None

IS_PRODUCTION = os.getenv("VERCEL_ENV") == "production"

# Keep API documentation available during local/preview development, but do not
# expose the interactive Swagger/ReDoc surfaces in production.
app = FastAPI(
    title="NEW SAINT VÉRON API",
    docs_url=None if IS_PRODUCTION else "/docs",
    redoc_url=None if IS_PRODUCTION else "/redoc",
    openapi_url=None if IS_PRODUCTION else "/openapi.json",
)
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


def _require_db():
    if db is None:
        logger.error("MongoDB is not configured: MONGO_URL and/or DB_NAME are missing.")
        raise HTTPException(status_code=503, detail="Banco de dados não configurado.")
    return db


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
    database_reachable = False
    database_error = None
    database_error_code = None
    database_error_code_name = None
    dns_resolved = False
    dns_error = None
    dns_error_detail = None
    general_dns_resolved = False
    general_dns_error = None
    general_dns_error_detail = None
    cluster_dns_resolved = False
    cluster_dns_error = None
    cluster_dns_error_detail = None
    host_dns_checks = {}
    tcp_reachable = False
    tcp_error = None
    resolved_hosts = []

    # Explicit family checks determine whether the runtime problem is specific
    # to the default getaddrinfo path or affects IPv4/IPv6 independently.
    atlas_ipv4_resolved = False
    atlas_ipv4_error = None
    atlas_ipv4_error_detail = None
    atlas_ipv4_hosts = []
    atlas_ipv6_resolved = False
    atlas_ipv6_error = None
    atlas_ipv6_error_detail = None
    atlas_ipv6_hosts = []

    # Test the DNS library used by PyMongo for mongodb+srv discovery. This is
    # diagnostic only; it does not change the Mongo client configuration.
    mongo_uri_scheme = None
    srv_resolved = False
    srv_error = None
    srv_error_detail = None
    srv_records = []
    txt_resolved = False
    txt_error = None
    txt_error_detail = None
    txt_records = []
    dnspython_available = False
    srv_host_dns_checks = {}
    srv_host_tcp_checks = {}

    try:
        from urllib.parse import urlsplit
        mongo_uri_scheme = urlsplit(mongo_url).scheme if mongo_url else None
    except Exception:
        mongo_uri_scheme = None

    # First determine whether DNS itself works inside the Vercel runtime.
    try:
        resolved = await asyncio.to_thread(socket.getaddrinfo, "example.com", 443, type=socket.SOCK_STREAM)
        general_dns_resolved = bool(resolved)
    except Exception as exc:  # noqa: BLE001
        general_dns_error = type(exc).__name__
        general_dns_error_detail = str(exc)

    mongo_host = "cluster0.pyefmcn.mongodb.net"
    try:
        resolved = await asyncio.to_thread(socket.getaddrinfo, mongo_host, 27017, type=socket.SOCK_STREAM)
        resolved_hosts = sorted({item[4][0] for item in resolved})
        dns_resolved = bool(resolved_hosts)
        cluster_dns_resolved = dns_resolved
    except Exception as exc:  # noqa: BLE001
        dns_error = type(exc).__name__
        dns_error_detail = str(exc)
        cluster_dns_error = type(exc).__name__
        cluster_dns_error_detail = str(exc)

    # Force IPv4 and IPv6 separately. This is diagnostic only and does not
    # alter the Mongo client configuration.
    try:
        resolved = await asyncio.to_thread(
            socket.getaddrinfo,
            mongo_host,
            27017,
            socket.AF_INET,
            socket.SOCK_STREAM,
        )
        atlas_ipv4_hosts = sorted({item[4][0] for item in resolved})
        atlas_ipv4_resolved = bool(atlas_ipv4_hosts)
    except Exception as exc:  # noqa: BLE001
        atlas_ipv4_error = type(exc).__name__
        atlas_ipv4_error_detail = str(exc)

    try:
        resolved = await asyncio.to_thread(
            socket.getaddrinfo,
            mongo_host,
            27017,
            socket.AF_INET6,
            socket.SOCK_STREAM,
        )
        atlas_ipv6_hosts = sorted({item[4][0] for item in resolved})
        atlas_ipv6_resolved = bool(atlas_ipv6_hosts)
    except Exception as exc:  # noqa: BLE001
        atlas_ipv6_error = type(exc).__name__
        atlas_ipv6_error_detail = str(exc)

    # Check direct SRV/TXT records through dnspython, which is the resolver
    # path used by PyMongo for mongodb+srv URIs.
    try:
        import dns.resolver
        dnspython_available = True

        def _resolve_dns_records():
            resolver = dns.resolver.Resolver(configure=True)
            srv = resolver.resolve(f"_mongodb._tcp.{mongo_host}", "SRV", lifetime=4)
            txt = resolver.resolve(mongo_host, "TXT", lifetime=4)
            srv_values = sorted(str(answer).rstrip(".") for answer in srv)
            txt_values = sorted(" ".join(str(part) for part in answer.strings) for answer in txt)
            return srv_values, txt_values

        srv_records, txt_records = await asyncio.to_thread(_resolve_dns_records)
        srv_resolved = bool(srv_records)
        txt_resolved = bool(txt_records)

        # Resolve the exact hostnames returned by Atlas SRV. This avoids the
        # previous diagnostic typo and tells us whether dnspython can resolve
        # the actual replica-set members used by the SRV connection.
        for record in srv_records:
            try:
                parts = record.split()
                host = parts[-1].rstrip(".")
                resolver = dns.resolver.Resolver(configure=True)
                a_records = resolver.resolve(host, "A", lifetime=4)
                ips = sorted(str(answer) for answer in a_records)
                srv_host_dns_checks[host] = {"resolved": bool(ips), "ips": ips}

                tcp_results = {}
                for ip in ips:
                    try:
                        connection = await asyncio.to_thread(socket.create_connection, (ip, 27017), 4)
                        connection.close()
                        tcp_results[ip] = True
                    except Exception as tcp_exc:  # noqa: BLE001
                        tcp_results[ip] = {
                            "reachable": False,
                            "error": type(tcp_exc).__name__,
                        }
                srv_host_tcp_checks[host] = tcp_results
            except Exception as exc:  # noqa: BLE001
                host = record.split()[-1].rstrip(".")
                srv_host_dns_checks[host] = {
                    "resolved": False,
                    "error": type(exc).__name__,
                    "error_detail": str(exc),
                }
    except Exception as exc:  # noqa: BLE001
        error_name = type(exc).__name__
        error_detail = str(exc)
        srv_error = error_name
        srv_error_detail = error_detail
        txt_error = error_name
        txt_error_detail = error_detail

    # Check the direct Atlas node hostnames independently using the exact
    # hostnames returned by SRV when available. This distinguishes a cluster
    # alias problem from a broader Atlas DNS resolution problem.
    atlas_hosts = [host for host in srv_host_dns_checks.keys()]
    for host in atlas_hosts:
        try:
            resolved = await asyncio.to_thread(socket.getaddrinfo, host, 27017, type=socket.SOCK_STREAM)
            ips = sorted({item[4][0] for item in resolved})
            host_dns_checks[host] = {"resolved": bool(ips), "ips": ips}
        except Exception as exc:  # noqa: BLE001
            host_dns_checks[host] = {
                "resolved": False,
                "error": type(exc).__name__,
                "error_detail": str(exc),
            }

    if dns_resolved:
        for host in resolved_hosts[:3]:
            try:
                connection = await asyncio.wait_for(
                    asyncio.to_thread(socket.create_connection, (host, 27017,)),
                    timeout=4,
                )
                connection.close()
                tcp_reachable = True
                break
            except Exception as exc:  # noqa: BLE001
                tcp_error = type(exc).__name__

    if db is not None and client is not None:
        try:
            await asyncio.wait_for(client.admin.command("ping"), timeout=8)
            database_reachable = True
        except Exception as exc:  # noqa: BLE001
            database_error = type(exc).__name__
            database_error_code = getattr(exc, "code", None)
            details = getattr(exc, "details", None)
            if isinstance(details, dict):
                database_error_code_name = details.get("codeName")
            logger.warning(
                "MongoDB health check failed: type=%s code=%s code_name=%s",
                database_error,
                database_error_code,
                database_error_code_name,
            )

    return {
        "status": "healthy",
        "database_configured": db is not None,
        "mongo_uri_scheme": mongo_uri_scheme,
        "using_atlas_srv_fallback": using_atlas_srv_fallback,
        "dns_resolved": dns_resolved,
        "dns_error": dns_error,
        "dns_error_detail": dns_error_detail,
        "general_dns_resolved": general_dns_resolved,
        "general_dns_error": general_dns_error,
        "general_dns_error_detail": general_dns_error_detail,
        "cluster_dns_resolved": cluster_dns_resolved,
        "cluster_dns_error": cluster_dns_error,
        "cluster_dns_error_detail": cluster_dns_error_detail,
        "atlas_ipv4_resolved": atlas_ipv4_resolved,
        "atlas_ipv4_error": atlas_ipv4_error,
        "atlas_ipv4_error_detail": atlas_ipv4_error_detail,
        "atlas_ipv4_hosts": atlas_ipv4_hosts,
        "atlas_ipv6_resolved": atlas_ipv6_resolved,
        "atlas_ipv6_error": atlas_ipv6_error,
        "atlas_ipv6_error_detail": atlas_ipv6_error_detail,
        "atlas_ipv6_hosts": atlas_ipv6_hosts,
        "dnspython_available": dnspython_available,
        "srv_resolved": srv_resolved,
        "srv_error": srv_error,
        "srv_error_detail": srv_error_detail,
        "srv_records": srv_records,
        "txt_resolved": txt_resolved,
        "txt_error": txt_error,
        "txt_error_detail": txt_error_detail,
        "txt_records": txt_records,
        "srv_host_dns_checks": srv_host_dns_checks,
        "srv_host_tcp_checks": srv_host_tcp_checks,
        "host_dns_checks": host_dns_checks,
        "resolved_hosts": resolved_hosts,
        "tcp_reachable": tcp_reachable,
        "tcp_error": tcp_error,
        "database_reachable": database_reachable,
        "database_error": database_error,
        "database_error_code": database_error_code,
        "database_error_code_name": database_error_code_name,
        "email_enabled": is_email_enabled(),
        "time": datetime.now(timezone.utc).isoformat(),
    }


@api_router.post("/leads", response_model=LeadResponse)
async def create_lead(payload: LeadCreate, request: Request, background_tasks: BackgroundTasks):
    database = _require_db()
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
    email = str(payload.email).lower().strip()
    identifier = f"{ip}:{email}"

    if is_locked_out(identifier):
        raise HTTPException(status_code=429, detail="Muitas tentativas. Aguarde 15 minutos e tente novamente.")

    user = await database.users.find_one({"email": email})
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
            email=email,
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
    database = _require_db()
    total = await database.leads.count_documents({})
    stats = {"total": total}
    for s in LEAD_STATUSES:
        stats[s] = await database.leads.count_documents({"status": s})
    # legacy leads without a status count as "novo"
    missing = await database.leads.count_documents({"status": {"$exists": False}})
    stats["novo"] += missing
    return stats


@api_router.get("/leads", response_model=List[Lead], response_model_by_alias=False)
async def list_leads(current=Depends(get_current_user), status: Optional[str] = None):
    database = _require_db()
    query = {}
    if status and status in LEAD_STATUSES:
        query = {"status": status} if status != "novo" else {
            "$or": [{"status": "novo"}, {"status": {"$exists": False}}]
        }
    docs = await database.leads.find(query).sort("created_at", -1).to_list(1000)
    return [Lead.from_mongo(d) for d in docs]


@api_router.patch("/leads/{lead_id}", response_model=Lead, response_model_by_alias=False)
async def update_lead(lead_id: str, payload: LeadStatusUpdate, current=Depends(get_current_user)):
    database = _require_db()
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

    result = await database.leads.find_one_and_update(
        {"_id": oid}, {"$set": updates}, return_document=ReturnDocument.AFTER
    )
    if not result:
        raise HTTPException(status_code=404, detail="Lead não encontrado.")
    return Lead.from_mongo(result)


@api_router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str, current=Depends(get_current_user)):
    database = _require_db()
    try:
        oid = ObjectId(lead_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido.")
    result = await database.leads.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead não encontrado.")
    return {"success": True}


app.include_router(api_router)

# Explicit CORS origins for production. CORS_ORIGINS can override this with a
# comma-separated allowlist when a custom domain is introduced.
def _cors_origins() -> list[str]:
    configured = os.getenv("CORS_ORIGINS", "").strip()
    if configured:
        return [origin.strip().rstrip("/") for origin in configured.split(",") if origin.strip()]
    return [
        "https://newsaintveron.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001",
    ]


app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=_cors_origins(),
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
    max_age=600,
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    if IS_PRODUCTION:
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


@app.on_event("startup")
async def on_startup():
    if db is None:
        logger.warning("MongoDB is not configured; skipping database startup tasks.")
        return
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
    if client is not None:
        client.close()