from fastapi import FastAPI
from dotenv import load_dotenv
from app.api.routes import auth
from fastapi import Depends
from app.core.security import get_current_user
from app.core.database import Base, engine
from app.api.routes import documents
from app.api.routes import users


load_dotenv()

app = FastAPI()

app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(users.router)

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Digital Library API is running"}

@app.get("/protected")
def protected_route(user=Depends(get_current_user)):
    return {
        "message": "You are authenticated",
        "user": user
    }