from fastapi import FastAPI
from app.api.routes import auth
from fastapi import Request
from app.middleware.rbac import rbac_required
from fastapi import Depends
from app.core.security import get_current_user
from app.core.database import Base, engine

app = FastAPI()

app.include_router(auth.router)
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Digital Library API is running"}

@app.get("/admin-only")
@rbac_required(["admin"])
async def admin_route(request: Request):
    return {"message": "Welcome Admin!"}

@app.get("/protected")
def protected_route(user=Depends(get_current_user)):
    return {
        "message": "You are authenticated",
        "user": user
    }