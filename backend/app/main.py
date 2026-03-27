from fastapi import FastAPI
from dotenv import load_dotenv
from app.api.routes import auth
from fastapi import Depends
from app.core.security import get_current_user
from app.core.database import Base, engine
from app.api.routes import documents
from app.api.routes import users
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

# Add CORS middleware
origins = [
    "http://localhost:5173",  # Frontend URL
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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