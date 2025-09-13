from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.config import get_db
from app.models import Profile
from app.schemas import Profile as ProfileSchema, ProfileCreate, ProfileUpdate, PasswordChange
from app.auth import get_password_hash, require_super_admin, get_current_active_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=List[ProfileSchema])
def get_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_super_admin)
):
    users = db.query(Profile).offset(skip).limit(limit).all()
    return users

@router.get("/me", response_model=ProfileSchema)
def get_current_user_profile(current_user: Profile = Depends(get_current_active_user)):
    return current_user

@router.put("/change-password")
def change_password(
    password_data: PasswordChange,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_active_user)
):
    """Allow users to change their own password"""
    if not password_data.new_password or len(password_data.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long"
        )
    
    # Hash the new password
    hashed_password = get_password_hash(password_data.new_password)
    
    # Update the user's password
    current_user.password_hash = hashed_password
    db.commit()
    
    return {"message": "Password changed successfully"}

@router.post("/", response_model=ProfileSchema)
def create_user(
    user: ProfileCreate, 
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_super_admin)
):
    # Check if user with email already exists
    db_user = db.query(Profile).filter(Profile.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash the password
    hashed_password = get_password_hash(user.password)
    
    # Create new user
    db_user = Profile(
        full_name=user.full_name,
        email=user.email,
        password_hash=hashed_password,
        role=user.role,
        is_active=user.is_active
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.get("/{user_id}", response_model=ProfileSchema)
def get_user(
    user_id: UUID, 
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_super_admin)
):
    user = db.query(Profile).filter(Profile.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.put("/{user_id}", response_model=ProfileSchema)
def update_user(
    user_id: UUID,
    user_update: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_super_admin)
):
    user = db.query(Profile).filter(Profile.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Protect default admin from deactivation
    if user.is_default_admin:
        update_data = user_update.dict(exclude_unset=True)
        
        # Prevent deactivation of default admin
        if "is_active" in update_data and not update_data["is_active"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot deactivate the default admin account"
            )
        
        # Prevent role change of default admin
        if "role" in update_data and update_data["role"] != user.role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot change role of the default admin account"
            )
        
        # Prevent removing default admin flag
        if "is_default_admin" in update_data and not update_data["is_default_admin"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot remove default admin protection"
            )
    
    # Update user data
    update_data = user_update.dict(exclude_unset=True)
    
    # Hash password if provided
    if "password" in update_data:
        update_data["password_hash"] = get_password_hash(update_data.pop("password"))
    
    # Check email uniqueness if email is being updated
    if "email" in update_data and update_data["email"] != user.email:
        existing_user = db.query(Profile).filter(Profile.email == update_data["email"]).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    
    return user

@router.delete("/{user_id}")
def delete_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_super_admin)
):
    user = db.query(Profile).filter(Profile.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent deleting self
    if user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    # Prevent deleting default admin
    if user.is_default_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete the default admin account"
        )
    
    # Ensure at least one active super admin remains
    active_super_admins = db.query(Profile).filter(
        Profile.role == user.role,
        Profile.is_active == True,
        Profile.id != user_id
    ).count()
    
    if user.role.value == "super_admin" and active_super_admins == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete the last super admin account"
        )
    
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"} 