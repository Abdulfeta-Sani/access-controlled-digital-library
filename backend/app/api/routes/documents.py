from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from pathlib import Path
import shutil
from sqlalchemy.orm import Session
from app.models.document import Document
from app.core.deps import get_db
from app.core.security import require_role, get_current_user
from app.schemas.documents import DocumentCreate, DocumentOut, DocumentUpdate

router = APIRouter(prefix="/documents", tags=["Documents"])

UPLOADS_DIR = Path(__file__).resolve().parents[3] / "uploads"

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


@router.post("", response_model=DocumentOut)
def create_document(
    title: str = Form(...),
    role_access: list[str] = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(require_role(["admin", "editor"]))
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    new_doc = Document(
        title=title,
        uploaded_by=user["sub"],
        role_access=",".join(role_access)
    )

    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    original_name = Path(file.filename).name
    stored_name = f"{new_doc.id}_{original_name}"
    destination = UPLOADS_DIR / stored_name

    with destination.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return serialize_document(new_doc)

@router.get("", response_model=list[DocumentOut])
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

    # Remove any stored files for this document (stored as {id}_{original_name})
    try:
        pattern = f"{id}_*"
        files = list(UPLOADS_DIR.glob(pattern))
        for f in files:
            try:
                f.unlink()
            except Exception:
                # ignore file deletion errors but continue
                pass
    except Exception:
        # If uploads dir missing or other error, ignore and continue with DB delete
        pass

    db.delete(document)
    db.commit()

    return {"message": "Document deleted successfully"}


@router.patch("/{id}", response_model=DocumentOut)
def update_document(
    id: int,
    payload: DocumentUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_role(["editor"]))
):
    doc = db.query(Document).filter(Document.id == id).first()

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if payload.title is not None:
        doc.title = payload.title

    if payload.role_access is not None:
        doc.role_access = ",".join(payload.role_access)

    db.add(doc)
    db.commit()
    db.refresh(doc)

    return serialize_document(doc)


@router.get("/{id}/download")
def download_document(
    id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    # Ensure document exists
    doc = db.query(Document).filter(Document.id == id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Look for stored file in uploads directory (files are stored as {id}_{original_name})
    pattern = f"{id}_*"
    files = list(UPLOADS_DIR.glob(pattern))
    if not files:
        raise HTTPException(status_code=404, detail="File not found on server")

    stored = files[0]
    # Original filename is after the first underscore
    try:
        original_name = stored.name.split("_", 1)[1]
    except IndexError:
        original_name = stored.name

    return FileResponse(path=stored, filename=original_name, media_type="application/octet-stream")