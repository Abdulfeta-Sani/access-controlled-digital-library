from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class DocumentCreate(BaseModel):
    title: str
    role_access: List[str]


class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    role_access: Optional[List[str]] = None


class DocumentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    uploaded_by: str
    role_access: List[str]
    uploaded_at: datetime
