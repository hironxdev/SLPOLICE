from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models, schemas, auth
from uuid import UUID

router = APIRouter(prefix="/admin", tags=["admin"])

# Dependency to verify token and return user
async def get_current_user(token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except auth.JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

async def get_admin_user(current_user: models.User = Depends(get_current_user)):
    if current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get("/requests", response_model=List[schemas.RequestResponse])
async def list_requests(
    db: Session = Depends(get_db),
    status: Optional[str] = None,
    current_user: models.User = Depends(get_current_user)
):
    query = db.query(models.Request)
    if status:
        query = query.filter(models.Request.status == status)
    
    # Log the view action
    new_log = models.AuditLog(
        admin_id=current_user.id,
        action_type="VIEW",
        request_id=None
    )
    db.add(new_log)
    db.commit()
    
    return query.order_by(models.Request.created_at.desc()).all()

@router.patch("/requests/{request_id}/status")
async def update_status(
    request_id: UUID,
    new_status: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    request_obj = db.query(models.Request).filter(models.Request.id == request_id).first()
    if not request_obj:
        raise HTTPException(status_code=404, detail="Request not found")
    
    request_obj.status = new_status
    
    # Log the update action
    new_log = models.AuditLog(
        admin_id=current_user.id,
        action_type="UPDATE",
        request_id=request_id
    )
    db.add(new_log)
    db.commit()
    return {"message": "Status updated"}
