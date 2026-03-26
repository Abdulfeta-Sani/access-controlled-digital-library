from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.document import Document
from app.core.deps import get_db
from app.core.security import get_current_user

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/")
def create_document(
    title: str,
    role_access: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if user["role"] not in ["admin", "editor"]:
        raise HTTPException(status_code=403, detail="Not allowed")

    doc = Document(
        title=title,
        uploaded_by=user["sub"],
        role_access=role_access
    )

    db.add(doc)
    db.commit()
    db.refresh(doc)

    return doc

@router.get("/")
def get_documents(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    docs = db.query(Document).all()
    return docs

@router.get("/{id}")
def get_document(
    id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    doc = db.query(Document).filter(Document.id == id).first()

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    return doc

@router.delete("/{id}")
def delete_document(
    id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")

    doc = db.query(Document).filter(Document.id == id).first()

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    db.delete(doc)
    db.commit()

    return {"message": "Document deleted"}