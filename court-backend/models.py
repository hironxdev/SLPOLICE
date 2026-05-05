from sqlalchemy import Column, String, Float, DateTime, Boolean, ForeignKey, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from database import Base

class Request(Base):
    __tablename__ = "requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    national_id_hashed = Column(String)
    court_order_number = Column(String, nullable=False)
    court_date = Column(DateTime, nullable=False)
    explanation_type = Column(String, nullable=False)
    explanation_text = Column(Text, nullable=False)
    latitude = Column(Float)
    longitude = Column(Float)
    accuracy = Column(Float)
    maps_url = Column(String)
    requested_new_date = Column(DateTime)
    phone_primary = Column(String, nullable=False)
    phone_secondary = Column(String)
    consent = Column(Boolean, nullable=False)
    ip_address = Column(String)
    user_agent = Column(String)
    status = Column(String, default="Pending") # Pending, Reviewed, Flagged
    created_at = Column(DateTime, default=datetime.utcnow)

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False) # Admin, Reviewer
    is_active = Column(Boolean, default=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    action_type = Column(String, nullable=False) # VIEW, UPDATE, FLAG
    request_id = Column(UUID(as_uuid=True), ForeignKey("requests.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String)
