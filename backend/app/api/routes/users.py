from fastapi import APIRouter, Depends
from app.models.user import fake_users_db
from app.core.security import require_role

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/")
def get_users(user=Depends(require_role(["admin"]))):
    return fake_users_db