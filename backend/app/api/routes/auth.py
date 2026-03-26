from fastapi import APIRouter, HTTPException
from app.models.user import fake_users_db
from app.core.security import create_access_token, verify_password
from app.schemas.auth import LoginRequest, TokenResponse

router = APIRouter()

@router.post("/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    user = next((u for u in fake_users_db if u["email"] == payload.email), None)

    if not user or not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": user["email"],
        "role": user["role"]
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user["role"]
    }