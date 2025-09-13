from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.config import get_db
from app.models import FlightDeal, Profile
from app.schemas import FlightDeal as FlightDealSchema, FlightDealCreate, FlightDealUpdate
from app.auth import require_admin_or_moderator

router = APIRouter(prefix="/flights", tags=["Flight Deals"])

@router.get("/", response_model=List[FlightDealSchema])
def get_flight_deals(
    skip: int = 0,
    limit: int = 100,
    available_only: bool = False,
    featured_only: bool = False,
    db: Session = Depends(get_db)
):
    """Get flight deals - Public endpoint"""
    query = db.query(FlightDeal)
    
    if available_only:
        query = query.filter(FlightDeal.is_available == True)
    
    if featured_only:
        query = query.filter(FlightDeal.is_featured == True)
    
    deals = query.offset(skip).limit(limit).all()
    return deals

@router.post("/", response_model=FlightDealSchema)
def create_flight_deal(
    deal: FlightDealCreate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Create flight deal - Requires admin/moderator access"""
    db_deal = FlightDeal(**deal.dict())
    db.add(db_deal)
    db.commit()
    db.refresh(db_deal)
    return db_deal

@router.get("/{deal_id}", response_model=FlightDealSchema)
def get_flight_deal(deal_id: UUID, db: Session = Depends(get_db)):
    """Get single flight deal - Public endpoint"""
    deal = db.query(FlightDeal).filter(FlightDeal.id == deal_id).first()
    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flight deal not found"
        )
    return deal

@router.put("/{deal_id}", response_model=FlightDealSchema)
def update_flight_deal(
    deal_id: UUID,
    deal_update: FlightDealUpdate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Update flight deal - Requires admin/moderator access"""
    deal = db.query(FlightDeal).filter(FlightDeal.id == deal_id).first()
    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flight deal not found"
        )
    
    update_data = deal_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(deal, field, value)
    
    db.commit()
    db.refresh(deal)
    return deal

@router.delete("/{deal_id}")
def delete_flight_deal(
    deal_id: UUID,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Delete flight deal - Requires admin/moderator access"""
    deal = db.query(FlightDeal).filter(FlightDeal.id == deal_id).first()
    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flight deal not found"
        )
    
    db.delete(deal)
    db.commit()
    return {"message": "Flight deal deleted successfully"} 