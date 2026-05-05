from fastapi import APIRouter, Depends, HTTPException, Request as FastRequest
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, auth
import hashlib

router = APIRouter(prefix="/requests", tags=["requests"])

@router.post("/", response_model=schemas.RequestResponse)
async def create_submission(
    payload: schemas.RequestCreate,
    request: FastRequest,
    db: Session = Depends(get_db)
):
    if not payload.consent:
        raise HTTPException(status_code=400, detail="Consent required")

    # Hash NIC for privacy
    nic_hashed = None
    if payload.national_id:
        nic_hashed = hashlib.sha256(payload.national_id.encode()).hexdigest()

    db_request = models.Request(
        name=payload.name,
        national_id_hashed=nic_hashed,
        court_order_number=payload.court_order_number,
        court_date=payload.court_date,
        explanation_type=payload.explanation_type,
        explanation_text=payload.explanation_text,
        latitude=payload.location.latitude if payload.location else None,
        longitude=payload.location.longitude if payload.location else None,
        accuracy=payload.location.accuracy if payload.location else None,
        maps_url=payload.location.maps_url if payload.location else None,
        requested_new_date=payload.requested_new_date,
        phone_primary=payload.phone_primary,
        phone_secondary=payload.phone_secondary,
        consent=payload.consent,
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent"),
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request
