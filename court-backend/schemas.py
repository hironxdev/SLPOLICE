from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from datetime import datetime, date
from typing import Optional, List

class Location(BaseModel):
    latitude: Optional[float]
    longitude: Optional[float]
    accuracy: Optional[float]
    maps_url: Optional[str]

class RequestCreate(BaseModel):
    name: str
    national_id: Optional[str]
    court_order_number: str
    court_date: date
    explanation_type: str
    explanation_text: str
    location: Optional[Location]
    requested_new_date: Optional[date]
    phone_primary: str
    phone_secondary: Optional[str]
    consent: bool

class RequestResponse(BaseModel):
    id: UUID
    name: str
    court_order_number: str
    court_date: datetime
    explanation_type: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class UserLogin(BaseModel):
    username: str
    password: str
