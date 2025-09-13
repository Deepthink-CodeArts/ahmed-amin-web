from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from uuid import UUID
from app.config import get_db
from app.models import VisaService, TourPackage, UmrahPackage
from app.schemas import (
    VisaService as VisaServiceSchema, 
    TourPackage as TourPackageSchema, 
    UmrahPackage as UmrahPackageSchema
)

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("/{item_type}/{item_id}/mixed")
def get_mixed_recommendations(
    item_type: str,  # "visa", "tour", or "umrah"
    item_id: UUID,
    limit_per_type: int = 2,
    db: Session = Depends(get_db)
):
    """Get mixed recommendations across all categories based on tags - Public endpoint"""
    
    # Validate item_type
    if item_type not in ["visa", "tour", "umrah"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="item_type must be 'visa', 'tour', or 'umrah'"
        )
    
    # Get the current item and its tags
    current_item = None
    current_tags = []
    
    if item_type == "visa":
        current_item = db.query(VisaService).filter(VisaService.id == item_id).first()
        if not current_item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Visa service not found")
        current_tags = current_item.tags or []
    elif item_type == "tour":
        current_item = db.query(TourPackage).filter(TourPackage.id == item_id).first()
        if not current_item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tour package not found")
        current_tags = current_item.tags or []
    elif item_type == "umrah":
        current_item = db.query(UmrahPackage).filter(UmrahPackage.id == item_id).first()
        if not current_item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Umrah package not found")
        current_tags = current_item.tags or []
    
    recommendations = {
        "current_item": {
            "type": item_type,
            "id": str(item_id),
            "tags": current_tags
        },
        "recommendations": {
            "visas": [],
            "tours": [],
            "umrah": []
        }
    }
    
    # If no tags, return random items from each category
    if not current_tags:
        # Get random visas
        if item_type != "visa":
            random_visas = db.query(VisaService).filter(
                VisaService.is_available == True
            ).limit(limit_per_type).all()
            recommendations["recommendations"]["visas"] = [
                VisaServiceSchema.from_orm(v) for v in random_visas
            ]
        
        # Get random tours
        if item_type != "tour":
            random_tours = db.query(TourPackage).filter(
                TourPackage.is_available == True
            ).limit(limit_per_type).all()
            recommendations["recommendations"]["tours"] = [
                TourPackageSchema.from_orm(t) for t in random_tours
            ]
        
        # Get random umrah
        if item_type != "umrah":
            random_umrah = db.query(UmrahPackage).filter(
                UmrahPackage.is_available == True
            ).limit(limit_per_type).all()
            recommendations["recommendations"]["umrah"] = [
                UmrahPackageSchema.from_orm(u) for u in random_umrah
            ]
        
        return recommendations
    
    # Get recommendations based on tag similarity
    
    # Visa recommendations
    if item_type != "visa":
        visa_services = db.query(VisaService).filter(
            VisaService.is_available == True
        ).all()
        
        scored_visas = []
        for visa in visa_services:
            if visa.tags:
                matching_tags = set(current_tags) & set(visa.tags)
                score = len(matching_tags)
                if score > 0:
                    scored_visas.append((visa, score))
        
        scored_visas.sort(key=lambda x: x[1], reverse=True)
        top_visas = [visa for visa, score in scored_visas[:limit_per_type]]
        recommendations["recommendations"]["visas"] = [
            VisaServiceSchema.from_orm(v) for v in top_visas
        ]
    
    # Tour recommendations
    if item_type != "tour":
        tour_packages = db.query(TourPackage).filter(
            TourPackage.is_available == True
        ).all()
        
        scored_tours = []
        for tour in tour_packages:
            if tour.tags:
                matching_tags = set(current_tags) & set(tour.tags)
                score = len(matching_tags)
                if score > 0:
                    scored_tours.append((tour, score))
        
        scored_tours.sort(key=lambda x: x[1], reverse=True)
        top_tours = [tour for tour, score in scored_tours[:limit_per_type]]
        recommendations["recommendations"]["tours"] = [
            TourPackageSchema.from_orm(t) for t in top_tours
        ]
    
    # Umrah recommendations
    if item_type != "umrah":
        umrah_packages = db.query(UmrahPackage).filter(
            UmrahPackage.is_available == True
        ).all()
        
        scored_umrah = []
        for umrah in umrah_packages:
            if umrah.tags:
                matching_tags = set(current_tags) & set(umrah.tags)
                score = len(matching_tags)
                if score > 0:
                    scored_umrah.append((umrah, score))
        
        scored_umrah.sort(key=lambda x: x[1], reverse=True)
        top_umrah = [umrah for umrah, score in scored_umrah[:limit_per_type]]
        recommendations["recommendations"]["umrah"] = [
            UmrahPackageSchema.from_orm(u) for u in top_umrah
        ]
    
    return recommendations

@router.get("/popular")
def get_popular_items(
    limit_per_type: int = 4,
    db: Session = Depends(get_db)
):
    """Get popular/featured items from all categories - Public endpoint"""
    
    popular_visas = db.query(VisaService).filter(
        VisaService.is_available == True,
        VisaService.is_featured == True
    ).limit(limit_per_type).all()
    
    popular_tours = db.query(TourPackage).filter(
        TourPackage.is_available == True,
        TourPackage.is_featured == True
    ).limit(limit_per_type).all()
    
    popular_umrah = db.query(UmrahPackage).filter(
        UmrahPackage.is_available == True,
        UmrahPackage.is_featured == True
    ).limit(limit_per_type).all()
    
    return {
        "popular": {
            "visas": [VisaServiceSchema.from_orm(v) for v in popular_visas],
            "tours": [TourPackageSchema.from_orm(t) for t in popular_tours],
            "umrah": [UmrahPackageSchema.from_orm(u) for u in popular_umrah]
        }
    }

@router.get("/by-tags")
def get_recommendations_by_tags(
    tags: List[str],
    exclude_type: Optional[str] = None,
    exclude_id: Optional[UUID] = None,
    limit_per_type: int = 3,
    db: Session = Depends(get_db)
):
    """Get recommendations by specific tags - Public endpoint"""
    
    recommendations = {
        "tags": tags,
        "results": {
            "visas": [],
            "tours": [],
            "umrah": []
        }
    }
    
    # Visa recommendations
    if exclude_type != "visa":
        visa_query = db.query(VisaService).filter(VisaService.is_available == True)
        if exclude_id and exclude_type == "visa":
            visa_query = visa_query.filter(VisaService.id != exclude_id)
        
        visa_services = visa_query.all()
        scored_visas = []
        
        for visa in visa_services:
            if visa.tags:
                matching_tags = set(tags) & set(visa.tags)
                score = len(matching_tags)
                if score > 0:
                    scored_visas.append((visa, score))
        
        scored_visas.sort(key=lambda x: x[1], reverse=True)
        top_visas = [visa for visa, score in scored_visas[:limit_per_type]]
        recommendations["results"]["visas"] = [
            VisaServiceSchema.from_orm(v) for v in top_visas
        ]
    
    # Tour recommendations
    if exclude_type != "tour":
        tour_query = db.query(TourPackage).filter(TourPackage.is_available == True)
        if exclude_id and exclude_type == "tour":
            tour_query = tour_query.filter(TourPackage.id != exclude_id)
        
        tour_packages = tour_query.all()
        scored_tours = []
        
        for tour in tour_packages:
            if tour.tags:
                matching_tags = set(tags) & set(tour.tags)
                score = len(matching_tags)
                if score > 0:
                    scored_tours.append((tour, score))
        
        scored_tours.sort(key=lambda x: x[1], reverse=True)
        top_tours = [tour for tour, score in scored_tours[:limit_per_type]]
        recommendations["results"]["tours"] = [
            TourPackageSchema.from_orm(t) for t in top_tours
        ]
    
    # Umrah recommendations
    if exclude_type != "umrah":
        umrah_query = db.query(UmrahPackage).filter(UmrahPackage.is_available == True)
        if exclude_id and exclude_type == "umrah":
            umrah_query = umrah_query.filter(UmrahPackage.id != exclude_id)
        
        umrah_packages = umrah_query.all()
        scored_umrah = []
        
        for umrah in umrah_packages:
            if umrah.tags:
                matching_tags = set(tags) & set(umrah.tags)
                score = len(matching_tags)
                if score > 0:
                    scored_umrah.append((umrah, score))
        
        scored_umrah.sort(key=lambda x: x[1], reverse=True)
        top_umrah = [umrah for umrah, score in scored_umrah[:limit_per_type]]
        recommendations["results"]["umrah"] = [
            UmrahPackageSchema.from_orm(u) for u in top_umrah
        ]
    
    return recommendations
