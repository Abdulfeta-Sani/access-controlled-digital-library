from fastapi import APIRouter, HTTPException
from app.models.user import fake_users_db
from app.core.security import create_access_token

router = APIRouter()

@router.post("/auth/login")
def login(email: str, password: str):
    user = next((u for u in fake_users_db if u["email"] == email and u["password"] == password), None)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": user["email"],
        "role": user["role"]
    })

    return {"access_token": token}