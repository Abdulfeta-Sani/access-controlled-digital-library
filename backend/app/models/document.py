from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.core.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    uploaded_by = Column(String, nullable=False)
    role_access = Column(String, nullable=False)  # comma-separated roles
    uploaded_at = Column(DateTime, default=datetime.utcnow)