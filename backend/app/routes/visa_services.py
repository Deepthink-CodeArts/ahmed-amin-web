from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.config import get_db
from app.models import VisaService, Profile
from app.schemas import VisaService as VisaServiceSchema, VisaServiceCreate, VisaServiceUpdate
from app.auth import require_admin_or_moderator

router = APIRouter(prefix="/visa-services", tags=["Visa Services"])

@router.get("/", response_model=List[VisaServiceSchema])
def get_visa_services(
    skip: int = 0,
    limit: int = 100,
    available_only: bool = False,
    featured_only: bool = False,
    country: str = None,
    tags: List[str] = None,
    db: Session = Depends(get_db)
):
    """Get visa services - Public endpoint"""
    query = db.query(VisaService)
    
    if available_only:
        query = query.filter(VisaService.is_available == True)
    
    if featured_only:
        query = query.filter(VisaService.is_featured == True)
    
    if country:
        query = query.filter(
            VisaService.country_name.ilike(f"%{country}%") |
            VisaService.country_name_bn.ilike(f"%{country}%")
        )
    
    if tags:
        for tag in tags:
            query = query.filter(VisaService.tags.any(tag))
    
    services = query.offset(skip).limit(limit).all()
    return services

@router.post("/", response_model=VisaServiceSchema)
def create_visa_service(
    service: VisaServiceCreate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Create visa service - Requires admin/moderator access"""
    db_service = VisaService(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@router.get("/{service_id}", response_model=VisaServiceSchema)
def get_visa_service(service_id: UUID, db: Session = Depends(get_db)):
    """Get single visa service - Public endpoint"""
    service = db.query(VisaService).filter(VisaService.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Visa service not found"
        )
    return service

@router.get("/country/{country_name}", response_model=VisaServiceSchema)
def get_visa_service_by_country(country_name: str, db: Session = Depends(get_db)):
    """Get visa service by country name - Public endpoint"""
    service = db.query(VisaService).filter(
        VisaService.country_name.ilike(f"%{country_name}%")
    ).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Visa service for {country_name} not found"
        )
    return service

@router.put("/{service_id}", response_model=VisaServiceSchema)
def update_visa_service(
    service_id: UUID,
    service_update: VisaServiceUpdate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Update visa service - Requires admin/moderator access"""
    service = db.query(VisaService).filter(VisaService.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Visa service not found"
        )
    
    update_data = service_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(service, field, value)
    
    db.commit()
    db.refresh(service)
    return service

@router.delete("/{service_id}")
def delete_visa_service(
    service_id: UUID,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Delete visa service - Requires admin/moderator access"""
    service = db.query(VisaService).filter(VisaService.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Visa service not found"
        )
    
    db.delete(service)
    db.commit()
    return {"message": "Visa service deleted successfully"}

@router.get("/tags/all")
def get_all_visa_tags(db: Session = Depends(get_db)):
    """Get all unique visa tags - Public endpoint"""
    services = db.query(VisaService).filter(VisaService.tags.isnot(None)).all()
    all_tags = set()
    for service in services:
        if service.tags:
            all_tags.update(service.tags)
    return {"tags": list(all_tags)}

@router.get("/countries/all")
def get_all_countries(db: Session = Depends(get_db)):
    """Get all countries with visa services - Public endpoint"""
    services = db.query(VisaService).filter(VisaService.is_available == True).all()
    countries = [{"name": service.country_name, "name_bn": service.country_name_bn, "flag": service.country_flag} 
                for service in services]
    return {"countries": countries}

@router.get("/{service_id}/similar", response_model=List[VisaServiceSchema])
def get_similar_visa_services(
    service_id: UUID, 
    limit: int = 4,
    db: Session = Depends(get_db)
):
    """Get similar visa services based on tags - Public endpoint"""
    # Get the current service
    current_service = db.query(VisaService).filter(VisaService.id == service_id).first()
    if not current_service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Visa service not found"
        )
    
    if not current_service.tags:
        # If no tags, return random available services
        similar_services = db.query(VisaService).filter(
            VisaService.id != service_id,
            VisaService.is_available == True
        ).limit(limit).all()
        return similar_services
    
    # Find services with matching tags
    similar_services = db.query(VisaService).filter(
        VisaService.id != service_id,
        VisaService.is_available == True
    ).all()
    
    # Calculate similarity score based on matching tags
    scored_services = []
    for service in similar_services:
        if service.tags:
            # Count matching tags
            matching_tags = set(current_service.tags) & set(service.tags)
            score = len(matching_tags)
            if score > 0:
                scored_services.append((service, score))
    
    # Sort by score (descending) and return top results
    scored_services.sort(key=lambda x: x[1], reverse=True)
    return [service for service, score in scored_services[:limit]]
