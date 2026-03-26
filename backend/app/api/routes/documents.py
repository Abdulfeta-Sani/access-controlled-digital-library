from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.document import Document
from app.core.deps import get_db
from app.core.security import get_current_user, require_role

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/")
def create_document(
    title: str,
    role_access: str,
    db: Session = Depends(get_db),
    user=Depends(require_role(["admin", "editor"]))
):
    new_doc = Document(
        title=title,
        uploaded_by=user["sub"],
        role_access=role_access
    )

    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return new_doc

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
    user=Depends(require_role(["admin"]))
):
    document = db.query(Document).filter(Document.id == id).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    db.delete(document)
    db.commit()

    return {"message": "Document deleted successfully"}