from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.config import get_db
from app.models import TourPackage, Profile
from app.schemas import TourPackage as TourPackageSchema, TourPackageCreate, TourPackageUpdate
from app.auth import require_admin_or_moderator

router = APIRouter(prefix="/tour-packages", tags=["Tour Packages"])

@router.get("/", response_model=List[TourPackageSchema])
def get_tour_packages(
    skip: int = 0,
    limit: int = 100,
    available_only: bool = False,
    featured_only: bool = False,
    db: Session = Depends(get_db)
):
    """Get tour packages - Public endpoint"""
    query = db.query(TourPackage)
    
    if available_only:
        query = query.filter(TourPackage.is_available == True)
    
    if featured_only:
        query = query.filter(TourPackage.is_featured == True)
    
    packages = query.offset(skip).limit(limit).all()
    return packages

@router.post("/", response_model=TourPackageSchema)
def create_tour_package(
    package: TourPackageCreate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Create tour package - Requires admin/moderator access"""
    db_package = TourPackage(**package.dict())
    db.add(db_package)
    db.commit()
    db.refresh(db_package)
    return db_package

@router.get("/{package_id}", response_model=TourPackageSchema)
def get_tour_package(package_id: UUID, db: Session = Depends(get_db)):
    """Get single tour package - Public endpoint"""
    package = db.query(TourPackage).filter(TourPackage.id == package_id).first()
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour package not found"
        )
    return package

@router.put("/{package_id}", response_model=TourPackageSchema)
def update_tour_package(
    package_id: UUID,
    package_update: TourPackageUpdate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Update tour package - Requires admin/moderator access"""
    package = db.query(TourPackage).filter(TourPackage.id == package_id).first()
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour package not found"
        )
    
    update_data = package_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(package, field, value)
    
    db.commit()
    db.refresh(package)
    return package

@router.delete("/{package_id}")
def delete_tour_package(
    package_id: UUID,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Delete tour package - Requires admin/moderator access"""
    package = db.query(TourPackage).filter(TourPackage.id == package_id).first()
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour package not found"
        )
    
    db.delete(package)
    db.commit()
    return {"message": "Tour package deleted successfully"}

@router.get("/{package_id}/similar", response_model=List[TourPackageSchema])
def get_similar_tour_packages(
    package_id: UUID, 
    limit: int = 4,
    db: Session = Depends(get_db)
):
    """Get similar tour packages based on tags - Public endpoint"""
    # Get the current package
    current_package = db.query(TourPackage).filter(TourPackage.id == package_id).first()
    if not current_package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour package not found"
        )
    
    if not current_package.tags:
        # If no tags, return random available packages
        similar_packages = db.query(TourPackage).filter(
            TourPackage.id != package_id,
            TourPackage.is_available == True
        ).limit(limit).all()
        return similar_packages
    
    # Find packages with matching tags
    similar_packages = db.query(TourPackage).filter(
        TourPackage.id != package_id,
        TourPackage.is_available == True
    ).all()
    
    # Calculate similarity score based on matching tags
    scored_packages = []
    for package in similar_packages:
        if package.tags:
            # Count matching tags
            matching_tags = set(current_package.tags) & set(package.tags)
            score = len(matching_tags)
            if score > 0:
                scored_packages.append((package, score))
    
    # Sort by score (descending) and return top results
    scored_packages.sort(key=lambda x: x[1], reverse=True)
    return [package for package, score in scored_packages[:limit]]

@router.get("/tags/all")
def get_all_tour_tags(db: Session = Depends(get_db)):
    """Get all unique tour package tags - Public endpoint"""
    packages = db.query(TourPackage).filter(TourPackage.tags.isnot(None)).all()
    all_tags = set()
    for package in packages:
        if package.tags:
            all_tags.update(package.tags)
    return {"tags": list(all_tags)} 