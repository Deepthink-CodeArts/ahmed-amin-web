from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.config import get_db
from app.models import HomepageBanner, Profile
from app.schemas import HomepageBanner as HomepageBannerSchema, HomepageBannerCreate, HomepageBannerUpdate
from app.auth import require_admin_or_moderator

router = APIRouter(prefix="/banners", tags=["Homepage Banners"])

@router.get("/", response_model=List[HomepageBannerSchema])
def get_banners(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = False,
    db: Session = Depends(get_db)
):
    """Get homepage banners - Public endpoint"""
    query = db.query(HomepageBanner)
    
    if active_only:
        query = query.filter(HomepageBanner.is_active == True)
    
    banners = query.order_by(HomepageBanner.order).offset(skip).limit(limit).all()
    return banners

@router.post("/", response_model=HomepageBannerSchema)
def create_banner(
    banner: HomepageBannerCreate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Create homepage banner - Requires admin/moderator access"""
    db_banner = HomepageBanner(**banner.dict())
    db.add(db_banner)
    db.commit()
    db.refresh(db_banner)
    return db_banner

@router.get("/{banner_id}", response_model=HomepageBannerSchema)
def get_banner(banner_id: UUID, db: Session = Depends(get_db)):
    """Get single homepage banner - Public endpoint"""
    banner = db.query(HomepageBanner).filter(HomepageBanner.id == banner_id).first()
    if not banner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Banner not found"
        )
    return banner

@router.put("/{banner_id}", response_model=HomepageBannerSchema)
def update_banner(
    banner_id: UUID,
    banner_update: HomepageBannerUpdate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Update homepage banner - Requires admin/moderator access"""
    banner = db.query(HomepageBanner).filter(HomepageBanner.id == banner_id).first()
    if not banner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Banner not found"
        )
    
    update_data = banner_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(banner, field, value)
    
    db.commit()
    db.refresh(banner)
    return banner

@router.delete("/{banner_id}")
def delete_banner(
    banner_id: UUID,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Delete homepage banner - Requires admin/moderator access"""
    banner = db.query(HomepageBanner).filter(HomepageBanner.id == banner_id).first()
    if not banner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Banner not found"
        )
    
    db.delete(banner)
    db.commit()
    return {"message": "Banner deleted successfully"} 