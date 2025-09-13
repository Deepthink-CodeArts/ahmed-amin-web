from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.config import get_db
from app.models import WebsiteSettings, Profile
from app.schemas import WebsiteSettings as WebsiteSettingsSchema, WebsiteSettingsCreate, WebsiteSettingsUpdate
from app.auth import require_admin_or_moderator

router = APIRouter(prefix="/settings", tags=["Website Settings"])

@router.get("/", response_model=WebsiteSettingsSchema)
def get_settings(db: Session = Depends(get_db)):
    """Get website settings - Public endpoint"""
    settings = db.query(WebsiteSettings).first()
    if not settings:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Website settings not found"
        )
    return settings

@router.put("/", response_model=WebsiteSettingsSchema)
def update_settings(
    settings_update: WebsiteSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Update website settings - Requires admin/moderator access"""
    settings = db.query(WebsiteSettings).first()
    
    if not settings:
        # Create new settings if none exist
        settings_data = settings_update.dict(exclude_unset=True)
        settings = WebsiteSettings(**settings_data)
        db.add(settings)
    else:
        # Update existing settings
        update_data = settings_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(settings, field, value)
    
    db.commit()
    db.refresh(settings)
    
    return settings 