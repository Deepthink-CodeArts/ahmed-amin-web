#!/usr/bin/env python3
"""
Database initialization script for DeepBase CMS Backend
Creates all tables and adds a default super admin user
"""

import asyncio
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import DATABASE_URL, Base, PROJECT_CONFIG
from app.models import Profile, UserRole
from app.auth import get_password_hash

def init_database():
    """Initialize database with tables and default super admin user"""
    
    # Create engine and session
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    print("Creating database tables...")
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
    
    # Create session
    db = SessionLocal()
    
    try:
        # Check if super admin already exists
        existing_admin = db.query(Profile).filter(
            Profile.role == UserRole.super_admin
        ).first()
        
        if existing_admin:
            print(f"✅ Super admin already exists: {existing_admin.email}")
            return
        
        # Create default super admin user
        admin_email = PROJECT_CONFIG['admin_email']
        admin_password = PROJECT_CONFIG['admin_password']
        
        admin_user = Profile(
            full_name="Super Admin",
            email=admin_email,
            password_hash=get_password_hash(admin_password),
            role=UserRole.super_admin,
            is_active=True
        )
        
        db.add(admin_user)
        db.commit()
        
        print("✅ Default super admin user created successfully!")
        print(f"   Email: {admin_email}")
        print(f"   Password: {admin_password}")
        print("   ⚠️  IMPORTANT: Change the default password after first login!")
        
    except Exception as e:
        print(f"❌ Error creating super admin user: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print(f"🚀 Initializing {PROJECT_CONFIG['project_display_name']} Database...")
    init_database()
    print("✅ Database initialization completed!") 