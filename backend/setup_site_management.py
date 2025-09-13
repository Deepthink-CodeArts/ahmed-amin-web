#!/usr/bin/env python3
"""
Site Management Setup Script
Initializes default data for hero scenes, hero content, contact info, and service options.
"""

import asyncio
from datetime import datetime
from sqlalchemy.orm import Session
from app.config import SessionLocal, engine
from app.models import Base, HeroScene, HeroContent, ContactInfo, ServiceOption

def create_tables():
    """Create new tables for site management."""
    print("🚀 Creating site management tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")

def setup_default_hero_scenes(db: Session):
    """Set up default hero scenes."""
    print("🎨 Setting up default hero scenes...")
    
    default_scenes = [
        {
            "name": "Paris",
            "name_bn": "প্যারিস",
            "image_url": "https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "gradient_class": "from-orange-400 via-pink-500 to-purple-600",
            "order": 0
        },
        {
            "name": "Dubai",
            "name_bn": "দুবাই",
            "image_url": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "gradient_class": "from-amber-400 via-orange-500 to-red-600",
            "order": 1
        },
        {
            "name": "Santorini",
            "name_bn": "স্যান্তরিনি",
            "image_url": "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "gradient_class": "from-blue-400 via-cyan-500 to-teal-600",
            "order": 2
        },
        {
            "name": "Makkah",
            "name_bn": "মক্কা",
            "image_url": "https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "gradient_class": "from-green-400 via-emerald-500 to-teal-600",
            "order": 3
        },
        {
            "name": "Bali",
            "name_bn": "বালি",
            "image_url": "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "gradient_class": "from-emerald-400 via-green-500 to-lime-600",
            "order": 4
        }
    ]
    
    for scene_data in default_scenes:
        existing_scene = db.query(HeroScene).filter(HeroScene.name == scene_data["name"]).first()
        if not existing_scene:
            scene = HeroScene(**scene_data)
            db.add(scene)
    
    db.commit()
    print(f"✅ {len(default_scenes)} hero scenes set up!")

def setup_default_hero_content(db: Session):
    """Set up default hero content."""
    print("📝 Setting up default hero content...")
    
    existing_content = db.query(HeroContent).filter(HeroContent.is_active == True).first()
    if not existing_content:
        content = HeroContent(
            headline_en="Where Dreams Take Flight",
            headline_bn="স্বপ্নের ডানায় চলো উড়াল দিই",
            subtitle_en="Aro isn't just a travel agency. It's your gateway to unforgettable experiences.",
            subtitle_bn="Aro শুধু একটা ট্রাভেল এজেন্সি নয়, এটি আপনার স্বপ্নের গেটওয়ে।",
            cta_text_en="Begin Your Journey",
            cta_text_bn="যাত্রা শুরু করুন",
            cta_link="#contact",
            is_active=True
        )
        db.add(content)
        db.commit()
        print("✅ Default hero content created!")
    else:
        print("✅ Hero content already exists!")

def setup_default_contact_info(db: Session):
    """Set up default contact information."""
    print("📞 Setting up default contact information...")
    
    existing_info = db.query(ContactInfo).filter(ContactInfo.is_active == True).first()
    if not existing_info:
        contact_info = ContactInfo(
            company_name="ARO Travels",
            company_name_bn="এআরও ট্রাভেলস",
            tagline_en="Your trusted travel partner for unforgettable journeys",
            tagline_bn="অবিস্মরণীয় যাত্রার জন্য আপনার বিশ্বস্ত ভ্রমণ সঙ্গী",
            address_en="123 Travel Street, Dhaka 1000, Bangladesh",
            address_bn="১২৩ ট্রাভেল স্ট্রিট, ঢাকা ১০০০, বাংলাদেশ",
            phone="+880 1234-567890",
            phone_display_bn="+৮৮০ ১২৩৪-৫৬৭৮৯০",
            email="info@arotravels.com",
            working_hours_en="Mon - Sat: 9:00 AM - 8:00 PM",
            working_hours_bn="সোম - শনি: সকাল ৯:০০ - রাত ৮:০০",
            facebook_url="https://facebook.com/arotravels",
            twitter_url="https://twitter.com/arotravels",
            instagram_url="https://instagram.com/arotravels",
            youtube_url="https://youtube.com/arotravels",
            latitude=23.8103,
            longitude=90.4125,
            is_active=True
        )
        db.add(contact_info)
        db.commit()
        print("✅ Default contact information created!")
    else:
        print("✅ Contact information already exists!")

def setup_default_service_options(db: Session):
    """Set up default service options."""
    print("🛎️ Setting up default service options...")
    
    default_services = [
        {
            "name_en": "Visa Services",
            "name_bn": "ভিসা সেবা",
            "description_en": "Tourist and business visa processing",
            "description_bn": "পর্যটন এবং ব্যবসায়িক ভিসা প্রক্রিয়াকরণ",
            "icon": "Passport",
            "order": 0
        },
        {
            "name_en": "Flight Booking",
            "name_bn": "ফ্লাইট বুকিং",
            "description_en": "Domestic and international flight reservations",
            "description_bn": "দেশীয় এবং আন্তর্জাতিক ফ্লাইট সংরক্ষণ",
            "icon": "Plane",
            "order": 1
        },
        {
            "name_en": "Tour Packages",
            "name_bn": "ট্যুর প্যাকেজ",
            "description_en": "Customized tour packages worldwide",
            "description_bn": "বিশ্বব্যাপী কাস্টমাইজড ট্যুর প্যাকেজ",
            "icon": "MapPin",
            "order": 2
        },
        {
            "name_en": "Umrah Services",
            "name_bn": "উমরাহ সেবা",
            "description_en": "Complete Umrah pilgrimage packages",
            "description_bn": "সম্পূর্ণ উমরাহ তীর্থযাত্রা প্যাকেজ",
            "icon": "Star",
            "order": 3
        },
        {
            "name_en": "Hotel Booking",
            "name_bn": "হোটেল বুকিং",
            "description_en": "Worldwide hotel reservations",
            "description_bn": "বিশ্বব্যাপী হোটেল সংরক্ষণ",
            "icon": "Building",
            "order": 4
        },
        {
            "name_en": "Travel Insurance",
            "name_bn": "ভ্রমণ বীমা",
            "description_en": "Comprehensive travel insurance coverage",
            "description_bn": "ব্যাপক ভ্রমণ বীমা কভারেজ",
            "icon": "Shield",
            "order": 5
        }
    ]
    
    for service_data in default_services:
        existing_service = db.query(ServiceOption).filter(ServiceOption.name_en == service_data["name_en"]).first()
        if not existing_service:
            service = ServiceOption(**service_data)
            db.add(service)
    
    db.commit()
    print(f"✅ {len(default_services)} service options set up!")

def main():
    """Main setup function."""
    print("🚀 Initializing Site Management System...")
    print("=" * 50)
    
    # Create tables
    create_tables()
    
    # Get database session
    db = SessionLocal()
    
    try:
        # Set up default data
        setup_default_hero_scenes(db)
        setup_default_hero_content(db)
        setup_default_contact_info(db)
        setup_default_service_options(db)
        
        print("=" * 50)
        print("✅ Site Management System initialized successfully!")
        print("🎉 You can now manage your site content through the CMS!")
        print("\n📋 What's been set up:")
        print("   • 5 Hero Scenes (Paris, Dubai, Santorini, Makkah, Bali)")
        print("   • Default Hero Content (English & Bengali)")
        print("   • Default Contact Information")
        print("   • 6 Service Options")
        print("\n🌐 Access your API documentation at: http://localhost:8000/docs")
        print("📱 Site Management endpoints: /api/v1/site-management/")
        
    except Exception as e:
        print(f"❌ Error during setup: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main() 