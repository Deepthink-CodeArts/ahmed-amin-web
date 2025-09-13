// User and Authentication Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'super_admin' | 'moderator';
  is_active: boolean;
  is_default_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Tour Package Types
export interface TourPackage {
  id: string;
  name: string;
  name_bn?: string;
  destinations: string;
  destinations_bn?: string;
  price: number;
  duration: number;
  itinerary?: any;
  itinerary_bn?: any;
  inclusions?: string[];
  inclusions_bn?: string[];
  exclusions?: string[];
  exclusions_bn?: string[];
  images?: string[];
  cover_photo?: string;
  package_details?: string;
  package_details_bn?: string;
  tags?: string[];
  is_available: boolean;
  is_featured: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// Umrah Package Types
export interface UmrahPackage {
  id: string;
  name: string;
  name_bn?: string;
  description?: string;
  description_bn?: string;
  duration?: number;
  hotel_info?: string;
  hotel_info_bn?: string;
  travel_dates?: string;
  price: number;
  package_type: 'group' | 'solo';
  rituals_included?: string[];
  rituals_included_bn?: string[];
  inclusions?: string[];
  inclusions_bn?: string[];
  exclusions?: string[];
  exclusions_bn?: string[];
  images?: string[];
  cover_photo?: string;
  package_details?: string;
  package_details_bn?: string;
  tags?: string[];
  is_available: boolean;
  is_featured: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// Visa Service Types
export interface VisaService {
  id: string;
  country_name: string;
  country_name_bn?: string;
  country_flag?: string;
  cover_photo?: string;
  duration?: string;
  duration_bn?: string;
  charge?: number;
  processing_time?: string;
  processing_time_bn?: string;
  inclusions?: string[];
  inclusions_bn?: string[];
  visa_details?: string;
  visa_details_bn?: string;
  tags?: string[];
  requirements?: any;
  requirements_bn?: any;
  is_available: boolean;
  is_featured: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// Flight Deal Types
export interface FlightDeal {
  id: string;
  airline_name: string;
  source: string;
  destination: string;
  price: number;
  departure_date: string;
  return_date?: string;
  seat_class: string;
  image_url?: string;
  is_featured: boolean;
  is_available: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// Blog Post Types
export interface BlogPost {
  id: string;
  title: string;
  title_bn?: string;
  slug: string;
  content: string;
  content_bn?: string;
  excerpt?: string;
  excerpt_bn?: string;
  cover_image?: string;
  tags?: string[];
  is_published: boolean;
  author_id: string;
  created_at: string;
  updated_at: string;
}

// Contact Submission Types
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  is_read: boolean;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

// Website Settings Types
export interface WebsiteSettings {
  id: string;
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  social_media?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  seo_settings?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string[];
  };
  updated_at: string;
}

// Homepage Banner Types
export interface HomepageBanner {
  id: string;
  title: string;
  title_bn?: string;
  subtitle?: string;
  subtitle_bn?: string;
  image_url: string;
  cta_text?: string;
  cta_text_bn?: string;
  cta_link?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiListResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface ApiError {
  detail: string;
  status_code: number;
} 