from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.config import get_db
from app.models import UmrahPackage, Profile
from app.schemas import UmrahPackage as UmrahPackageSchema, UmrahPackageCreate, UmrahPackageUpdate
from app.auth import require_admin_or_moderator

router = APIRouter(prefix="/umrah-packages", tags=["Umrah Packages"])

@router.get("/", response_model=List[UmrahPackageSchema])
def get_umrah_packages(
    skip: int = 0,
    limit: int = 100,
    available_only: bool = False,
    featured_only: bool = False,
    db: Session = Depends(get_db)
):
    """Get umrah packages - Public endpoint"""
    query = db.query(UmrahPackage)
    
    if available_only:
        query = query.filter(UmrahPackage.is_available == True)
    
    if featured_only:
        query = query.filter(UmrahPackage.is_featured == True)
    
    packages = query.offset(skip).limit(limit).all()
    return packages

@router.post("/", response_model=UmrahPackageSchema)
def create_umrah_package(
    package: UmrahPackageCreate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Create umrah package - Requires admin/moderator access"""
    db_package = UmrahPackage(**package.dict())
    db.add(db_package)
    db.commit()
    db.refresh(db_package)
    return db_package

@router.get("/{package_id}", response_model=UmrahPackageSchema)
def get_umrah_package(package_id: UUID, db: Session = Depends(get_db)):
    """Get single umrah package - Public endpoint"""
    package = db.query(UmrahPackage).filter(UmrahPackage.id == package_id).first()
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Umrah package not found"
        )
    return package

@router.put("/{package_id}", response_model=UmrahPackageSchema)
def update_umrah_package(
    package_id: UUID,
    package_update: UmrahPackageUpdate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Update umrah package - Requires admin/moderator access"""
    package = db.query(UmrahPackage).filter(UmrahPackage.id == package_id).first()
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Umrah package not found"
        )
    
    update_data = package_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(package, field, value)
    
    db.commit()
    db.refresh(package)
    return package

@router.delete("/{package_id}")
def delete_umrah_package(
    package_id: UUID,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Delete umrah package - Requires admin/moderator access"""
    package = db.query(UmrahPackage).filter(UmrahPackage.id == package_id).first()
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Umrah package not found"
        )
    
    db.delete(package)
    db.commit()
    return {"message": "Umrah package deleted successfully"}

@router.get("/{package_id}/similar", response_model=List[UmrahPackageSchema])
def get_similar_umrah_packages(
    package_id: UUID, 
    limit: int = 4,
    db: Session = Depends(get_db)
):
    """Get similar umrah packages based on tags - Public endpoint"""
    # Get the current package
    current_package = db.query(UmrahPackage).filter(UmrahPackage.id == package_id).first()
    if not current_package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Umrah package not found"
        )
    
    if not current_package.tags:
        # If no tags, return random available packages
        similar_packages = db.query(UmrahPackage).filter(
            UmrahPackage.id != package_id,
            UmrahPackage.is_available == True
        ).limit(limit).all()
        return similar_packages
    
    # Find packages with matching tags
    similar_packages = db.query(UmrahPackage).filter(
        UmrahPackage.id != package_id,
        UmrahPackage.is_available == True
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
def get_all_umrah_tags(db: Session = Depends(get_db)):
    """Get all unique umrah package tags - Public endpoint"""
    packages = db.query(UmrahPackage).filter(UmrahPackage.tags.isnot(None)).all()
    all_tags = set()
    for package in packages:
        if package.tags:
            all_tags.update(package.tags)
    return {"tags": list(all_tags)} 