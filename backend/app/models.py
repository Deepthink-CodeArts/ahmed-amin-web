import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Integer, DECIMAL, Date, Text, ARRAY, JSON
from sqlalchemy.dialects.postgresql import UUID, ENUM
from sqlalchemy.sql import func
from app.config import Base
from datetime import datetime
from enum import Enum as PyEnum

# Enums
class UserRole(PyEnum):
    super_admin = "super_admin"
    moderator = "moderator"

class PackageType(PyEnum):
    group = "group"
    solo = "solo"

# Models
class Profile(Base):
    __tablename__ = "profiles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(Text, nullable=False)
    email = Column(Text, unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    role = Column(ENUM(UserRole), nullable=False, default=UserRole.moderator)
    is_active = Column(Boolean, default=True)
    is_default_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class WebsiteSettings(Base):
    __tablename__ = "website_settings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    site_title = Column(Text)
    site_title_bn = Column(Text)
    logo_url = Column(Text)
    favicon_url = Column(Text)
    phone = Column(Text)
    email = Column(Text)
    address = Column(Text)
    footer_links = Column(JSON)
    social_links = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class HomepageBanner(Base):
    __tablename__ = "homepage_banners"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    image_url = Column(Text)
    image_url_mobile = Column(Text)
    title = Column(Text)
    title_bn = Column(Text)
    subtitle = Column(Text)
    subtitle_bn = Column(Text)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class TourPackage(Base):
    __tablename__ = "tour_packages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
    name_bn = Column(Text)
    destinations = Column(Text)
    destinations_bn = Column(Text)
    price = Column(DECIMAL(10, 2))
    duration = Column(Text)  # Changed to Text for "4 nights 5 days" format
    itinerary = Column(JSON)
    itinerary_bn = Column(JSON)
    inclusions = Column(ARRAY(Text))
    inclusions_bn = Column(ARRAY(Text))
    exclusions = Column(ARRAY(Text))
    exclusions_bn = Column(ARRAY(Text))
    images = Column(ARRAY(Text))
    cover_photo = Column(Text)  # Main cover photo for the package
    package_details = Column(Text)  # Rich text content for details page
    package_details_bn = Column(Text)  # Bengali version
    tags = Column(ARRAY(Text))  # Tags for categorization and search
    is_available = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class UmrahPackage(Base):
    __tablename__ = "umrah_packages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
    name_bn = Column(Text)
    description = Column(Text)
    description_bn = Column(Text)
    duration = Column(Text)  # Changed to Text for "4 nights 5 days" format
    hotel_info = Column(Text)
    hotel_info_bn = Column(Text)
    travel_dates = Column(Text)  # Will store date range as string
    price = Column(DECIMAL(10, 2))
    package_type = Column(ENUM(PackageType), default=PackageType.group)
    rituals_included = Column(ARRAY(Text))
    rituals_included_bn = Column(ARRAY(Text))
    inclusions = Column(ARRAY(Text))
    inclusions_bn = Column(ARRAY(Text))
    exclusions = Column(ARRAY(Text))
    exclusions_bn = Column(ARRAY(Text))
    images = Column(ARRAY(Text))
    cover_photo = Column(Text)  # Main cover photo for the package
    package_details = Column(Text)  # Rich text content for details page
    package_details_bn = Column(Text)  # Bengali version
    tags = Column(ARRAY(Text))  # Tags for categorization and search
    is_available = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class FlightDeal(Base):
    __tablename__ = "flight_deals"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    airline_name = Column(Text, nullable=False)
    source = Column(Text, nullable=False)
    destination = Column(Text, nullable=False)
    price = Column(DECIMAL(10, 2))
    departure_date = Column(Date)
    return_date = Column(Date)
    seat_class = Column(Text)
    image_url = Column(Text)
    is_featured = Column(Boolean, default=False)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class BlogPost(Base):
    __tablename__ = "blog_posts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(Text, nullable=False)
    title_bn = Column(Text)
    slug = Column(Text, unique=True, nullable=False)
    content = Column(Text)
    content_bn = Column(Text)
    excerpt = Column(Text)
    excerpt_bn = Column(Text)
    cover_image = Column(Text)
    tags = Column(ARRAY(Text))
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class ContactSubmission(Base):
    __tablename__ = "contact_submissions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
    email = Column(Text, nullable=False)
    phone = Column(Text)
    subject = Column(Text)
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class VisaService(Base):
    __tablename__ = "visa_services"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    country_name = Column(Text, nullable=False)
    country_name_bn = Column(Text)
    country_flag = Column(Text)  # URL to country flag image
    cover_photo = Column(Text)  # Main cover photo for visa details
    duration = Column(Text)  # e.g., "30 days", "6 months", "1 year"
    duration_bn = Column(Text)
    charge = Column(DECIMAL(10, 2))  # Visa processing charge
    processing_time = Column(Text)  # e.g., "7-10 business days"
    processing_time_bn = Column(Text)
    inclusions = Column(ARRAY(Text))  # What's included in the service
    inclusions_bn = Column(ARRAY(Text))
    visa_details = Column(Text)  # Rich text content for visa details page
    visa_details_bn = Column(Text)  # Bengali version
    tags = Column(ARRAY(Text))  # Tags like "tourist", "business", "transit"
    requirements = Column(JSON)  # Document requirements as structured data
    requirements_bn = Column(JSON)  # Bengali version
    is_available = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

# Site Management Models
class HeroScene(Base):
    __tablename__ = "hero_scenes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
    name_bn = Column(Text)
    image_url = Column(Text, nullable=False)
    gradient_class = Column(Text, nullable=False)  # CSS gradient class like 'from-orange-400 via-pink-500 to-purple-600'
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class HeroContent(Base):
    __tablename__ = "hero_content"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    headline_en = Column(Text, nullable=False)
    headline_bn = Column(Text, nullable=False)
    subtitle_en = Column(Text, nullable=False)
    subtitle_bn = Column(Text, nullable=False)
    cta_text_en = Column(Text, nullable=False)
    cta_text_bn = Column(Text, nullable=False)
    cta_link = Column(Text, default="#contact")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class ContactInfo(Base):
    __tablename__ = "contact_info"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_name = Column(Text, nullable=False, default="ARO Travels")
    company_name_bn = Column(Text, nullable=False, default="এআরও ট্রাভেলস")
    tagline_en = Column(Text, nullable=False, default="Your trusted travel partner for unforgettable journeys")
    tagline_bn = Column(Text, nullable=False, default="অবিস্মরণীয় যাত্রার জন্য আপনার বিশ্বস্ত ভ্রমণ সঙ্গী")
    
    # Address Information
    address_en = Column(Text, nullable=False)
    address_bn = Column(Text, nullable=False)
    
    # Contact Details
    phone = Column(Text, nullable=False)
    phone_display_bn = Column(Text)  # For Bengali number display
    email = Column(Text, nullable=False)
    
    # Working Hours
    working_hours_en = Column(Text, nullable=False, default="Mon - Sat: 9:00 AM - 8:00 PM")
    working_hours_bn = Column(Text, nullable=False, default="সোম - শনি: সকাল ৯:০০ - রাত ৮:০০")
    
    # Social Media Links
    social_links = Column(JSON)
    
    # Location Coordinates (for future map integration)
    latitude = Column(DECIMAL(10, 8))
    longitude = Column(DECIMAL(11, 8))
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class ServiceOption(Base):
    __tablename__ = "service_options"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name_en = Column(Text, nullable=False)
    name_bn = Column(Text, nullable=False)
    description_en = Column(Text)
    description_bn = Column(Text)
    icon = Column(Text)  # Lucide icon name
    is_active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now()) 