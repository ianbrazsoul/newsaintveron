"""JWT auth helpers for the NEW SAINT VÉRON admin panel.

Bearer-token based (Authorization header) to keep CORS simple. Single seeded
admin — no public registration. Secrets live in env vars only.
"""
import os
import time
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from collections import defaultdict

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = 720  # 12h — admin panel session

# In-memory brute force protection for the login endpoint
_LOGIN_MAX = 5
_LOGIN_WINDOW = 900  # 15 min lockout window
_login_attempts: dict = defaultdict(list)


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def _secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, _secret(), algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    payload = jwt.decode(token, _secret(), algorithms=[JWT_ALGORITHM])
    if payload.get("type") != "access":
        raise jwt.InvalidTokenError("Invalid token type")
    return payload


def register_failed_login(identifier: str):
    _login_attempts[identifier].append(time.time())


def clear_failed_logins(identifier: str):
    _login_attempts.pop(identifier, None)


def is_locked_out(identifier: str) -> bool:
    now = time.time()
    window_start = now - _LOGIN_WINDOW
    hits = [t for t in _login_attempts[identifier] if t > window_start]
    _login_attempts[identifier] = hits
    return len(hits) >= _LOGIN_MAX
