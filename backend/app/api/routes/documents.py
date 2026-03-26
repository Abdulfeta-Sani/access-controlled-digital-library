from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.document import Document
from app.core.deps import get_db
from app.core.security import require_role
from app.schemas.documents import DocumentCreate, DocumentOut

router = APIRouter(prefix="/documents", tags=["Documents"])

def serialize_document(document: Document) -> dict:
    return {
        "id": document.id,
        "title": document.title,
        "uploaded_by": document.uploaded_by,
        "role_access": [
            role.strip() for role in document.role_access.split(",") if role.strip()
        ],
        "uploaded_at": document.uploaded_at,
    }


@router.post("/", response_model=DocumentOut)
def create_document(
    payload: DocumentCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role(["admin", "editor"]))
):
    new_doc = Document(
        title=payload.title,
        uploaded_by=user["sub"],
        role_access=",".join(payload.role_access)
    )

    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return serialize_document(new_doc)

@router.get("/", response_model=list[DocumentOut])
def get_documents(db: Session = Depends(get_db)):
    docs = db.query(Document).all()
    return [serialize_document(doc) for doc in docs]

@router.get("/{id}", response_model=DocumentOut)
def get_document(
    id: int,
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == id).first()

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    return serialize_document(doc)

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