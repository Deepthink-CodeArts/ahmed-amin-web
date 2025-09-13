from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc, asc
from typing import List, Optional
from uuid import UUID

from app.config import get_db
from app.auth import require_admin_or_moderator
from app.models import HeroScene, HeroContent, ContactInfo, ServiceOption, Profile
from app.schemas import (
    HeroScene as HeroSceneSchema,
    HeroSceneCreate,
    HeroSceneUpdate,
    HeroContent as HeroContentSchema,
    HeroContentCreate,
    HeroContentUpdate,
    ContactInfo as ContactInfoSchema,
    ContactInfoCreate,
    ContactInfoUpdate,
    ServiceOption as ServiceOptionSchema,
    ServiceOptionCreate,
    ServiceOptionUpdate,
    SiteManagementOverview
)

router = APIRouter()

# ================================
# SITE MANAGEMENT OVERVIEW
# ================================

@router.get("/overview", response_model=SiteManagementOverview)
async def get_site_management_overview(
    db: Session = Depends(get_db)
):
    """Get overview statistics for site management dashboard."""
    
    # Hero scenes stats
    total_hero_scenes = db.query(HeroScene).count()
    active_hero_scenes = db.query(HeroScene).filter(HeroScene.is_active == True).count()
    
    # Current active hero content
    current_hero_content = db.query(HeroContent).filter(HeroContent.is_active == True).first()
    
    # Current active contact info
    current_contact_info = db.query(ContactInfo).filter(ContactInfo.is_active == True).first()
    
    # Service options stats
    total_service_options = db.query(ServiceOption).count()
    active_service_options = db.query(ServiceOption).filter(ServiceOption.is_active == True).count()
    
    return SiteManagementOverview(
        total_hero_scenes=total_hero_scenes,
        active_hero_scenes=active_hero_scenes,
        current_hero_content=current_hero_content,
        current_contact_info=current_contact_info,
        total_service_options=total_service_options,
        active_service_options=active_service_options
    )

# ================================
# HERO SCENES MANAGEMENT
# ================================

@router.get("/hero-scenes", response_model=List[HeroSceneSchema])
async def get_hero_scenes(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    active_only: bool = Query(False),
    order_by: str = Query("order", regex="^(order|name|created_at)$"),
    order_direction: str = Query("asc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db)
):
    """Get all hero scenes with filtering and sorting options."""
    
    query = db.query(HeroScene)
    
    if active_only:
        query = query.filter(HeroScene.is_active == True)
    
    # Apply ordering
    order_column = getattr(HeroScene, order_by)
    if order_direction == "desc":
        query = query.order_by(desc(order_column))
    else:
        query = query.order_by(asc(order_column))
    
    return query.offset(skip).limit(limit).all()

@router.get("/hero-scenes/{scene_id}", response_model=HeroSceneSchema)
async def get_hero_scene(
    scene_id: UUID,
    db: Session = Depends(get_db)
):
    """Get a specific hero scene by ID."""
    
    scene = db.query(HeroScene).filter(HeroScene.id == scene_id).first()
    if not scene:
        raise HTTPException(status_code=404, detail="Hero scene not found")
    
    return scene

@router.post("/hero-scenes", response_model=HeroSceneSchema)
async def create_hero_scene(
    scene_data: HeroSceneCreate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Create a new hero scene."""
    
    new_scene = HeroScene(**scene_data.dict())
    db.add(new_scene)
    db.commit()
    db.refresh(new_scene)
    
    return new_scene

@router.put("/hero-scenes/{scene_id}", response_model=HeroSceneSchema)
async def update_hero_scene(
    scene_id: UUID,
    scene_data: HeroSceneUpdate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Update an existing hero scene."""
    
    scene = db.query(HeroScene).filter(HeroScene.id == scene_id).first()
    if not scene:
        raise HTTPException(status_code=404, detail="Hero scene not found")
    
    update_data = scene_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(scene, field, value)
    
    db.commit()
    db.refresh(scene)
    
    return scene

@router.delete("/hero-scenes/{scene_id}")
async def delete_hero_scene(
    scene_id: UUID,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Delete a hero scene."""
    
    scene = db.query(HeroScene).filter(HeroScene.id == scene_id).first()
    if not scene:
        raise HTTPException(status_code=404, detail="Hero scene not found")
    
    db.delete(scene)
    db.commit()
    
    return {"message": "Hero scene deleted successfully"}

@router.post("/hero-scenes/{scene_id}/reorder")
async def reorder_hero_scene(
    scene_id: UUID,
    new_order: int,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Reorder hero scenes."""
    
    scene = db.query(HeroScene).filter(HeroScene.id == scene_id).first()
    if not scene:
        raise HTTPException(status_code=404, detail="Hero scene not found")
    
    old_order = scene.order
    scene.order = new_order
    
    # Adjust other scenes' orders
    if new_order > old_order:
        # Moving down: decrease order of scenes between old and new position
        db.query(HeroScene).filter(
            and_(HeroScene.order > old_order, HeroScene.order <= new_order, HeroScene.id != scene_id)
        ).update({HeroScene.order: HeroScene.order - 1})
    else:
        # Moving up: increase order of scenes between new and old position
        db.query(HeroScene).filter(
            and_(HeroScene.order >= new_order, HeroScene.order < old_order, HeroScene.id != scene_id)
        ).update({HeroScene.order: HeroScene.order + 1})
    
    db.commit()
    db.refresh(scene)
    
    return {"message": "Hero scene reordered successfully", "scene": scene}

# ================================
# HERO CONTENT MANAGEMENT
# ================================

@router.get("/hero-content", response_model=List[HeroContentSchema])
async def get_hero_content_list(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    active_only: bool = Query(False),
    db: Session = Depends(get_db)
):
    """Get all hero content entries."""
    
    query = db.query(HeroContent)
    
    if active_only:
        query = query.filter(HeroContent.is_active == True)
    
    return query.order_by(desc(HeroContent.created_at)).offset(skip).limit(limit).all()

@router.get("/hero-content/active", response_model=HeroContentSchema)
async def get_active_hero_content(db: Session = Depends(get_db)):
    """Get the currently active hero content."""
    
    content = db.query(HeroContent).filter(HeroContent.is_active == True).first()
    if not content:
        raise HTTPException(status_code=404, detail="No active hero content found")
    
    return content

@router.get("/hero-content/{content_id}", response_model=HeroContentSchema)
async def get_hero_content(
    content_id: UUID,
    db: Session = Depends(get_db)
):
    """Get specific hero content by ID."""
    
    content = db.query(HeroContent).filter(HeroContent.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Hero content not found")
    
    return content

@router.post("/hero-content", response_model=HeroContentSchema)
async def create_hero_content(
    content_data: HeroContentCreate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Create new hero content."""
    
    # If creating active content, deactivate others
    if content_data.is_active:
        db.query(HeroContent).update({HeroContent.is_active: False})
    
    new_content = HeroContent(**content_data.dict())
    db.add(new_content)
    db.commit()
    db.refresh(new_content)
    
    return new_content

@router.put("/hero-content/{content_id}", response_model=HeroContentSchema)
async def update_hero_content(
    content_id: UUID,
    content_data: HeroContentUpdate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Update hero content."""
    
    content = db.query(HeroContent).filter(HeroContent.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Hero content not found")
    
    update_data = content_data.dict(exclude_unset=True)
    
    # If activating this content, deactivate others
    if update_data.get("is_active"):
        db.query(HeroContent).filter(HeroContent.id != content_id).update({HeroContent.is_active: False})
    
    for field, value in update_data.items():
        setattr(content, field, value)
    
    db.commit()
    db.refresh(content)
    
    return content

@router.delete("/hero-content/{content_id}")
async def delete_hero_content(
    content_id: UUID,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Delete hero content."""
    
    content = db.query(HeroContent).filter(HeroContent.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Hero content not found")
    
    db.delete(content)
    db.commit()
    
    return {"message": "Hero content deleted successfully"}

# ================================
# CONTACT INFO MANAGEMENT
# ================================

@router.get("/contact-info", response_model=List[ContactInfoSchema])
async def get_contact_info_list(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    active_only: bool = Query(False),
    db: Session = Depends(get_db)
):
    """Get all contact info entries."""
    
    query = db.query(ContactInfo)
    
    if active_only:
        query = query.filter(ContactInfo.is_active == True)
    
    return query.order_by(desc(ContactInfo.created_at)).offset(skip).limit(limit).all()

@router.get("/contact-info/active", response_model=ContactInfoSchema)
async def get_active_contact_info(db: Session = Depends(get_db)):
    """Get the currently active contact information."""
    
    contact_info = db.query(ContactInfo).filter(ContactInfo.is_active == True).first()
    if not contact_info:
        raise HTTPException(status_code=404, detail="No active contact info found")
    
    return contact_info

@router.get("/contact-info/{info_id}", response_model=ContactInfoSchema)
async def get_contact_info(
    info_id: UUID,
    db: Session = Depends(get_db)
):
    """Get specific contact info by ID."""
    
    contact_info = db.query(ContactInfo).filter(ContactInfo.id == info_id).first()
    if not contact_info:
        raise HTTPException(status_code=404, detail="Contact info not found")
    
    return contact_info

@router.post("/contact-info", response_model=ContactInfoSchema)
async def create_contact_info(
    info_data: ContactInfoCreate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Create new contact information."""
    
    # If creating active contact info, deactivate others
    if info_data.is_active:
        db.query(ContactInfo).update({ContactInfo.is_active: False})
    
    new_info = ContactInfo(**info_data.dict())
    db.add(new_info)
    db.commit()
    db.refresh(new_info)
    
    return new_info

@router.put("/contact-info/{info_id}", response_model=ContactInfoSchema)
async def update_contact_info(
    info_id: UUID,
    info_data: ContactInfoUpdate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Update contact information."""
    
    contact_info = db.query(ContactInfo).filter(ContactInfo.id == info_id).first()
    if not contact_info:
        raise HTTPException(status_code=404, detail="Contact info not found")
    
    update_data = info_data.dict(exclude_unset=True)
    
    # If activating this info, deactivate others
    if update_data.get("is_active"):
        db.query(ContactInfo).filter(ContactInfo.id != info_id).update({ContactInfo.is_active: False})
    
    for field, value in update_data.items():
        setattr(contact_info, field, value)
    
    db.commit()
    db.refresh(contact_info)
    
    return contact_info

@router.delete("/contact-info/{info_id}")
async def delete_contact_info(
    info_id: UUID,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Delete contact information."""
    
    contact_info = db.query(ContactInfo).filter(ContactInfo.id == info_id).first()
    if not contact_info:
        raise HTTPException(status_code=404, detail="Contact info not found")
    
    db.delete(contact_info)
    db.commit()
    
    return {"message": "Contact info deleted successfully"}

# ================================
# SERVICE OPTIONS MANAGEMENT
# ================================

@router.get("/service-options", response_model=List[ServiceOptionSchema])
async def get_service_options(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    active_only: bool = Query(False),
    order_by: str = Query("order", regex="^(order|name_en|created_at)$"),
    order_direction: str = Query("asc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db)
):
    """Get all service options with filtering and sorting."""
    
    query = db.query(ServiceOption)
    
    if active_only:
        query = query.filter(ServiceOption.is_active == True)
    
    # Apply ordering
    order_column = getattr(ServiceOption, order_by)
    if order_direction == "desc":
        query = query.order_by(desc(order_column))
    else:
        query = query.order_by(asc(order_column))
    
    return query.offset(skip).limit(limit).all()

@router.get("/service-options/{option_id}", response_model=ServiceOptionSchema)
async def get_service_option(
    option_id: UUID,
    db: Session = Depends(get_db)
):
    """Get specific service option by ID."""
    
    option = db.query(ServiceOption).filter(ServiceOption.id == option_id).first()
    if not option:
        raise HTTPException(status_code=404, detail="Service option not found")
    
    return option

@router.post("/service-options", response_model=ServiceOptionSchema)
async def create_service_option(
    option_data: ServiceOptionCreate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Create new service option."""
    
    new_option = ServiceOption(**option_data.dict())
    db.add(new_option)
    db.commit()
    db.refresh(new_option)
    
    return new_option

@router.put("/service-options/{option_id}", response_model=ServiceOptionSchema)
async def update_service_option(
    option_id: UUID,
    option_data: ServiceOptionUpdate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Update service option."""
    
    option = db.query(ServiceOption).filter(ServiceOption.id == option_id).first()
    if not option:
        raise HTTPException(status_code=404, detail="Service option not found")
    
    update_data = option_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(option, field, value)
    
    db.commit()
    db.refresh(option)
    
    return option

@router.delete("/service-options/{option_id}")
async def delete_service_option(
    option_id: UUID,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Delete service option."""
    
    option = db.query(ServiceOption).filter(ServiceOption.id == option_id).first()
    if not option:
        raise HTTPException(status_code=404, detail="Service option not found")
    
    db.delete(option)
    db.commit()
    
    return {"message": "Service option deleted successfully"}

@router.post("/service-options/{option_id}/reorder")
async def reorder_service_option(
    option_id: UUID,
    new_order: int,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Reorder service options."""
    
    option = db.query(ServiceOption).filter(ServiceOption.id == option_id).first()
    if not option:
        raise HTTPException(status_code=404, detail="Service option not found")
    
    old_order = option.order
    option.order = new_order
    
    # Adjust other options' orders
    if new_order > old_order:
        # Moving down: decrease order of options between old and new position
        db.query(ServiceOption).filter(
            and_(ServiceOption.order > old_order, ServiceOption.order <= new_order, ServiceOption.id != option_id)
        ).update({ServiceOption.order: ServiceOption.order - 1})
    else:
        # Moving up: increase order of options between new and old position
        db.query(ServiceOption).filter(
            and_(ServiceOption.order >= new_order, ServiceOption.order < old_order, ServiceOption.id != option_id)
        ).update({ServiceOption.order: ServiceOption.order + 1})
    
    db.commit()
    db.refresh(option)
    
    return {"message": "Service option reordered successfully", "option": option} 