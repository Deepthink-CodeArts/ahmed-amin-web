from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from uuid import UUID
from app.models import UserRole, PackageType
from decimal import Decimal

# Base schemas
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class PasswordChange(BaseModel):
    new_password: str

# Profile schemas
class ProfileBase(BaseModel):
    full_name: str
    email: EmailStr
    role: UserRole = UserRole.moderator
    is_active: bool = True
    is_default_admin: bool = False

class ProfileCreate(ProfileBase):
    password: str

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None

class Profile(ProfileBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Website Settings schemas
class WebsiteSettingsBase(BaseModel):
    site_title: Optional[str] = None
    site_title_bn: Optional[str] = None
    logo_url: Optional[str] = None
    favicon_url: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    footer_links: Optional[Dict[str, Any]] = None
    social_links: Optional[Dict[str, Any]] = None

class WebsiteSettingsCreate(WebsiteSettingsBase):
    pass

class WebsiteSettingsUpdate(WebsiteSettingsBase):
    pass

class WebsiteSettings(WebsiteSettingsBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Homepage Banner schemas
class HomepageBannerBase(BaseModel):
    image_url: Optional[str] = None
    image_url_mobile: Optional[str] = None
    title: Optional[str] = None
    title_bn: Optional[str] = None
    subtitle: Optional[str] = None
    subtitle_bn: Optional[str] = None
    order: int = 0
    is_active: bool = True

class HomepageBannerCreate(HomepageBannerBase):
    pass

class HomepageBannerUpdate(BaseModel):
    image_url: Optional[str] = None
    image_url_mobile: Optional[str] = None
    title: Optional[str] = None
    title_bn: Optional[str] = None
    subtitle: Optional[str] = None
    subtitle_bn: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

class HomepageBanner(HomepageBannerBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Tour Package schemas
class TourPackageBase(BaseModel):
    name: str
    name_bn: Optional[str] = None
    destinations: Optional[str] = None
    destinations_bn: Optional[str] = None
    price: Optional[Decimal] = None
    duration: Optional[str] = None
    itinerary: Optional[Dict[str, Any]] = None
    itinerary_bn: Optional[Dict[str, Any]] = None
    inclusions: Optional[List[str]] = None
    inclusions_bn: Optional[List[str]] = None
    exclusions: Optional[List[str]] = None
    exclusions_bn: Optional[List[str]] = None
    images: Optional[List[str]] = None
    cover_photo: Optional[str] = None
    package_details: Optional[str] = None
    package_details_bn: Optional[str] = None
    tags: Optional[List[str]] = None
    is_available: bool = True
    is_featured: bool = False

class TourPackageCreate(TourPackageBase):
    pass

class TourPackageUpdate(BaseModel):
    name: Optional[str] = None
    name_bn: Optional[str] = None
    destinations: Optional[str] = None
    destinations_bn: Optional[str] = None
    price: Optional[Decimal] = None
    duration: Optional[str] = None
    itinerary: Optional[Dict[str, Any]] = None
    itinerary_bn: Optional[Dict[str, Any]] = None
    inclusions: Optional[List[str]] = None
    inclusions_bn: Optional[List[str]] = None
    exclusions: Optional[List[str]] = None
    exclusions_bn: Optional[List[str]] = None
    images: Optional[List[str]] = None
    cover_photo: Optional[str] = None
    package_details: Optional[str] = None
    package_details_bn: Optional[str] = None
    tags: Optional[List[str]] = None
    is_available: Optional[bool] = None
    is_featured: Optional[bool] = None

class TourPackage(TourPackageBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Umrah Package schemas
class UmrahPackageBase(BaseModel):
    name: str
    name_bn: Optional[str] = None
    description: Optional[str] = None
    description_bn: Optional[str] = None
    duration: Optional[str] = None
    hotel_info: Optional[str] = None
    hotel_info_bn: Optional[str] = None
    travel_dates: Optional[str] = None
    price: Optional[Decimal] = None
    package_type: PackageType = PackageType.group
    rituals_included: Optional[List[str]] = None
    rituals_included_bn: Optional[List[str]] = None
    inclusions: Optional[List[str]] = None
    inclusions_bn: Optional[List[str]] = None
    exclusions: Optional[List[str]] = None
    exclusions_bn: Optional[List[str]] = None
    images: Optional[List[str]] = None
    cover_photo: Optional[str] = None
    package_details: Optional[str] = None
    package_details_bn: Optional[str] = None
    tags: Optional[List[str]] = None
    is_available: bool = True
    is_featured: bool = False

class UmrahPackageCreate(UmrahPackageBase):
    pass

class UmrahPackageUpdate(BaseModel):
    name: Optional[str] = None
    name_bn: Optional[str] = None
    description: Optional[str] = None
    description_bn: Optional[str] = None
    duration: Optional[str] = None
    hotel_info: Optional[str] = None
    hotel_info_bn: Optional[str] = None
    travel_dates: Optional[str] = None
    price: Optional[Decimal] = None
    package_type: Optional[PackageType] = None
    rituals_included: Optional[List[str]] = None
    rituals_included_bn: Optional[List[str]] = None
    inclusions: Optional[List[str]] = None
    inclusions_bn: Optional[List[str]] = None
    exclusions: Optional[List[str]] = None
    exclusions_bn: Optional[List[str]] = None
    images: Optional[List[str]] = None
    cover_photo: Optional[str] = None
    package_details: Optional[str] = None
    package_details_bn: Optional[str] = None
    tags: Optional[List[str]] = None
    is_available: Optional[bool] = None
    is_featured: Optional[bool] = None

class UmrahPackage(UmrahPackageBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Flight Deal schemas
class FlightDealBase(BaseModel):
    airline_name: str
    source: str
    destination: str
    price: Optional[Decimal] = None
    departure_date: Optional[date] = None
    return_date: Optional[date] = None
    seat_class: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: bool = False
    is_available: bool = True

class FlightDealCreate(FlightDealBase):
    pass

class FlightDealUpdate(BaseModel):
    airline_name: Optional[str] = None
    source: Optional[str] = None
    destination: Optional[str] = None
    price: Optional[Decimal] = None
    departure_date: Optional[date] = None
    return_date: Optional[date] = None
    seat_class: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: Optional[bool] = None
    is_available: Optional[bool] = None

class FlightDeal(FlightDealBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Blog Post schemas
class BlogPostBase(BaseModel):
    title: str
    title_bn: Optional[str] = None
    slug: str
    content: Optional[str] = None
    content_bn: Optional[str] = None
    excerpt: Optional[str] = None
    excerpt_bn: Optional[str] = None
    cover_image: Optional[str] = None
    tags: Optional[List[str]] = None
    is_published: bool = False

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    title_bn: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    content_bn: Optional[str] = None
    excerpt: Optional[str] = None
    excerpt_bn: Optional[str] = None
    cover_image: Optional[str] = None
    tags: Optional[List[str]] = None
    is_published: Optional[bool] = None

class BlogPost(BlogPostBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Contact Submission schemas
class ContactSubmissionBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: Optional[str] = None

class ContactSubmissionCreate(ContactSubmissionBase):
    pass

class ContactSubmissionUpdate(BaseModel):
    is_read: Optional[bool] = None

class ContactSubmission(ContactSubmissionBase):
    id: UUID
    is_read: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Visa Service schemas
class VisaServiceBase(BaseModel):
    country_name: str
    country_name_bn: Optional[str] = None
    country_flag: Optional[str] = None
    cover_photo: Optional[str] = None
    duration: Optional[str] = None
    duration_bn: Optional[str] = None
    charge: Optional[Decimal] = None
    processing_time: Optional[str] = None
    processing_time_bn: Optional[str] = None
    inclusions: Optional[List[str]] = None
    inclusions_bn: Optional[List[str]] = None
    visa_details: Optional[str] = None
    visa_details_bn: Optional[str] = None
    tags: Optional[List[str]] = None
    requirements: Optional[Dict[str, Any]] = None
    requirements_bn: Optional[Dict[str, Any]] = None
    is_available: bool = True
    is_featured: bool = False

class VisaServiceCreate(VisaServiceBase):
    pass

class VisaServiceUpdate(BaseModel):
    country_name: Optional[str] = None
    country_name_bn: Optional[str] = None
    country_flag: Optional[str] = None
    cover_photo: Optional[str] = None
    duration: Optional[str] = None
    duration_bn: Optional[str] = None
    charge: Optional[Decimal] = None
    processing_time: Optional[str] = None
    processing_time_bn: Optional[str] = None
    inclusions: Optional[List[str]] = None
    inclusions_bn: Optional[List[str]] = None
    visa_details: Optional[str] = None
    visa_details_bn: Optional[str] = None
    tags: Optional[List[str]] = None
    requirements: Optional[Dict[str, Any]] = None
    requirements_bn: Optional[Dict[str, Any]] = None
    is_available: Optional[bool] = None
    is_featured: Optional[bool] = None

class VisaService(VisaServiceBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Site Management schemas

# Hero Scene schemas
class HeroSceneBase(BaseModel):
    name: str
    name_bn: Optional[str] = None
    image_url: str
    gradient_class: str
    order: int = 0
    is_active: bool = True

class HeroSceneCreate(HeroSceneBase):
    pass

class HeroSceneUpdate(BaseModel):
    name: Optional[str] = None
    name_bn: Optional[str] = None
    image_url: Optional[str] = None
    gradient_class: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

class HeroScene(HeroSceneBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Hero Content schemas
class HeroContentBase(BaseModel):
    headline_en: str
    headline_bn: str
    subtitle_en: str
    subtitle_bn: str
    cta_text_en: str
    cta_text_bn: str
    cta_link: str = "#contact"
    is_active: bool = True

class HeroContentCreate(HeroContentBase):
    pass

class HeroContentUpdate(BaseModel):
    headline_en: Optional[str] = None
    headline_bn: Optional[str] = None
    subtitle_en: Optional[str] = None
    subtitle_bn: Optional[str] = None
    cta_text_en: Optional[str] = None
    cta_text_bn: Optional[str] = None
    cta_link: Optional[str] = None
    is_active: Optional[bool] = None

class HeroContent(HeroContentBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Contact Info schemas
class ContactInfoBase(BaseModel):
    company_name: str = "ARO Travels"
    company_name_bn: str = "এআরও ট্রাভেলস"
    tagline_en: str = "Your trusted travel partner for unforgettable journeys"
    tagline_bn: str = "অবিস্মরণীয় যাত্রার জন্য আপনার বিশ্বস্ত ভ্রমণ সঙ্গী"
    address_en: str
    address_bn: str
    phone: str
    phone_display_bn: Optional[str] = None
    email: str
    working_hours_en: str = "Mon - Sat: 9:00 AM - 8:00 PM"
    working_hours_bn: str = "সোম - শনি: সকাল ৯:০০ - রাত ৮:০০"
    social_links: Optional[Dict[str, Any]] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    is_active: bool = True

class ContactInfoCreate(ContactInfoBase):
    pass

class ContactInfoUpdate(BaseModel):
    company_name: Optional[str] = None
    company_name_bn: Optional[str] = None
    tagline_en: Optional[str] = None
    tagline_bn: Optional[str] = None
    address_en: Optional[str] = None
    address_bn: Optional[str] = None
    phone: Optional[str] = None
    phone_display_bn: Optional[str] = None
    email: Optional[str] = None
    working_hours_en: Optional[str] = None
    working_hours_bn: Optional[str] = None
    social_links: Optional[Dict[str, Any]] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    is_active: Optional[bool] = None

class ContactInfo(ContactInfoBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Service Option schemas
class ServiceOptionBase(BaseModel):
    name_en: str
    name_bn: str
    description_en: Optional[str] = None
    description_bn: Optional[str] = None
    icon: Optional[str] = None
    is_active: bool = True
    order: int = 0

class ServiceOptionCreate(ServiceOptionBase):
    pass

class ServiceOptionUpdate(BaseModel):
    name_en: Optional[str] = None
    name_bn: Optional[str] = None
    description_en: Optional[str] = None
    description_bn: Optional[str] = None
    icon: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None

class ServiceOption(ServiceOptionBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Bulk site management operations
class SiteManagementOverview(BaseModel):
    total_hero_scenes: int
    active_hero_scenes: int
    current_hero_content: Optional[HeroContent]
    current_contact_info: Optional[ContactInfo]
    total_service_options: int
    active_service_options: int
    
    class Config:
        from_attributes = True 