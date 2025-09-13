// Auto-detect API base URL for mobile compatibility
const getAPIBaseURL = () => {
  // If environment variable is set, use it
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // For development, try to detect the current host
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000/api/v1';
  }
  
  // For production domains, use the same protocol/host without port 8000
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  
  // Common development scenarios (local network IPs need port 8000)
  if (hostname.includes('192.168.') || hostname.includes('10.0.') || hostname.includes('172.')) {
    return `${protocol}//${hostname}:8000/api/v1`;
  }
  
  // Production domains use standard ports (443 for HTTPS, 80 for HTTP)
  return `${protocol}//${hostname}/api/v1`;
};

const API_BASE_URL = getAPIBaseURL();

console.log('API Base URL configured as:', API_BASE_URL);

// Helper function to get the base URL for file uploads
export const getFileBaseURL = () => {
  // If environment variable is set, use it
  if (import.meta.env.VITE_FILE_BASE_URL) {
    return import.meta.env.VITE_FILE_BASE_URL;
  }
  
  // For development, use localhost:8000
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  
  // For production domains, use the same protocol/host
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  
  // Common development scenarios (local network IPs need port 8000)
  if (hostname.includes('192.168.') || hostname.includes('10.0.') || hostname.includes('172.')) {
    return `${protocol}//${hostname}:8000`;
  }
  
  // Production domains use standard ports
  return `${protocol}//${hostname}`;
};

// Connectivity test function
export const testAPIConnectivity = async (): Promise<{ success: boolean; error?: string; details?: any }> => {
  const testEndpoint = '/health'; // Assuming there's a health endpoint
  try {
    console.log('Testing API connectivity to:', `${API_BASE_URL}${testEndpoint}`);
    const response = await fetch(`${API_BASE_URL}${testEndpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout for mobile networks
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    console.log('Connectivity test response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
    
    return { 
      success: response.ok,
      details: {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      }
    };
  } catch (error) {
    console.error('Connectivity test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: {
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : 'No stack'
      }
    };
  }
};

// Auth token management
let authToken: string | null = localStorage.getItem('auth_token');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

export const getAuthToken = () => authToken;

// Helper function to decode JWT token and extract user email
const getUserIdFromToken = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('JWT payload.sub (email):', payload.sub);
    
    // Return the email from the 'sub' field
    return payload.sub || null;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

// Generic API client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('API Request:', {
      url,
      method: options.method || 'GET',
      endpoint,
      baseURL: this.baseURL
    });
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (authToken) {
      // Use type assertion to add Authorization header
      (headers as Record<string, string>)['Authorization'] = `Bearer ${authToken}`;
      console.log('Using auth token for request');
      console.log('Token length:', authToken.length);
      console.log('Token starts with:', authToken.substring(0, 20) + '...');
      console.log('Token ends with:', '...' + authToken.substring(authToken.length - 20));
    } else {
      console.log('No auth token available');
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    console.log('Request config:', {
      ...config,
      headers: { ...headers, Authorization: authToken ? '[HIDDEN]' : 'none' }
    });

    try {
      console.log('Making fetch request to:', url);
      const response = await fetch(url, config);
      
      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        console.error('Response not OK, attempting to parse error...');
        const errorData = await response.json().catch(() => ({}));
        console.error('Error data:', errorData);
        
        // Better error message handling
        let errorMessage = `HTTP error! status: ${response.status}`;
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            // Handle validation errors (array format)
            errorMessage = errorData.detail.map((err: any) => err.msg || err.message || err).join(', ');
          } else if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
          } else {
            errorMessage = JSON.stringify(errorData.detail);
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
        
        // Add status code to error message for better error handling in auth
        if (response.status === 401) {
          errorMessage = `401 Unauthorized: ${errorMessage}`;
        } else if (response.status === 403) {
          errorMessage = `403 Forbidden: ${errorMessage}`;
        }
        
        console.error('Processed error message:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log('Parsing response as JSON...');
      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack'
      });
      
      // Check if this is a network connectivity issue
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Network connectivity issue detected');
        console.error('Current API URL:', url);
        console.error('User agent:', navigator.userAgent);
        console.error('Connection type:', (navigator as any).connection?.effectiveType || 'unknown');
        
        // For mobile users, provide a more helpful error
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
          throw new Error(`Network connection failed. Please check your internet connection and try again. (API: ${this.baseURL})`);
        }
      }
      
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const searchParams = params ? new URLSearchParams(params).toString() : '';
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // File upload method
  async uploadFile<T>(endpoint: string, file: File): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const formData = new FormData();
    formData.append('file', file);
    
    const headers: HeadersInit = {};
    if (authToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let errorMessage = `HTTP error! status: ${response.status}`;
      if (errorData.detail) {
        errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Multiple files upload method
  async uploadFiles<T>(endpoint: string, files: File[]): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const headers: HeadersInit = {};
    if (authToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let errorMessage = `HTTP error! status: ${response.status}`;
      if (errorData.detail) {
        errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<{ access_token: string; token_type: string }>('/auth/login', {
      email,
      password,
    }),
  
  getCurrentUser: async () => {
    const token = getAuthToken();
    console.log('getCurrentUser - Current auth token:', token ? 'exists' : 'null');
    
    if (!token) {
      throw new Error('No auth token available for getCurrentUser');
    }
    
    // Get the email from JWT token
    const userEmail = getUserIdFromToken(token); // This returns the email from 'sub' field
    console.log('User email from token:', userEmail);
    
    try {
      // Try to get all users and find the current user by email
      console.log('Making request to /users/ to find current user');
      const users = await apiClient.get<any[]>('/users/');
      console.log('Users response:', users);
      
      const currentUser = users.find(user => user.email === userEmail);
      
      if (!currentUser) {
        throw new Error(`User not found with email: ${userEmail}`);
      }
      
      console.log('Found current user:', currentUser);
      return currentUser;
    } catch (error) {
      console.warn('Failed to fetch from /users/ endpoint, using fallback approach:', error);
      
      // Fallback: Create a mock user object from the JWT token
      // This allows the app to work even if the users endpoint has CORS issues
      const mockUser = {
        id: 'mock-id', // We'll use a mock ID since we can't get the real one
        email: userEmail,
        full_name: 'Admin User', // Default name
        role: 'super_admin', // Assume admin role since they can login to CMS
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Using fallback user object:', mockUser);
      return mockUser;
    }
  },
};

// Tour Packages API
export const tourPackagesApi = {
  list: (params?: { skip?: number; limit?: number; available_only?: boolean; featured_only?: boolean }) =>
    apiClient.get<any[]>('/tour-packages', params),
  
  create: (data: any) =>
    apiClient.post<any>('/tour-packages', data),
  
  get: (id: string) =>
    apiClient.get<any>(`/tour-packages/${id}`),
  
  update: (id: string, data: any) =>
    apiClient.put<any>(`/tour-packages/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<any>(`/tour-packages/${id}`),

  getSimilar: (id: string, limit?: number) =>
    apiClient.get<any[]>(`/tour-packages/${id}/similar`, { limit }),
};

// Umrah Packages API
export const umrahPackagesApi = {
  list: (params?: { skip?: number; limit?: number; available_only?: boolean; featured_only?: boolean }) =>
    apiClient.get<any[]>('/umrah-packages', params),
  
  create: (data: any) =>
    apiClient.post<any>('/umrah-packages', data),
  
  get: (id: string) =>
    apiClient.get<any>(`/umrah-packages/${id}`),
  
  update: (id: string, data: any) =>
    apiClient.put<any>(`/umrah-packages/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<any>(`/umrah-packages/${id}`),

  getSimilar: (id: string, limit?: number) =>
    apiClient.get<any[]>(`/umrah-packages/${id}/similar`, { limit }),
};

// Flight Deals API
export const flightDealsApi = {
  list: (params?: { skip?: number; limit?: number; available_only?: boolean; featured_only?: boolean }) =>
    apiClient.get<any[]>('/flights', params),
  
  create: (data: any) =>
    apiClient.post<any>('/flights', data),
  
  get: (id: string) =>
    apiClient.get<any>(`/flights/${id}`),
  
  update: (id: string, data: any) =>
    apiClient.put<any>(`/flights/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<any>(`/flights/${id}`),
};

// Blog Posts API
export const blogPostsApi = {
  list: (params?: { skip?: number; limit?: number; published_only?: boolean }) =>
    apiClient.get<any[]>('/blog-posts', params),
  
  create: (data: any) =>
    apiClient.post<any>('/blog-posts', data),
  
  get: (id: string) =>
    apiClient.get<any>(`/blog-posts/${id}`),
  
  getBySlug: (slug: string) =>
    apiClient.get<any>(`/blog-posts/slug/${slug}`),
  
  update: (id: string, data: any) =>
    apiClient.put<any>(`/blog-posts/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<any>(`/blog-posts/${id}`),
};

// Contact Submissions API
export const contactSubmissionsApi = {
  submit: (data: any) =>
    apiClient.post<any>('/contact-submissions', data),
  
  list: (params?: { skip?: number; limit?: number; unread_only?: boolean }) =>
    apiClient.get<any[]>('/contact-submissions', params),
  
  get: (id: string) =>
    apiClient.get<any>(`/contact-submissions/${id}`),
  
  markAsRead: (id: string) =>
    apiClient.put<any>(`/contact-submissions/${id}/mark-read`, {}),
  
  update: (id: string, data: any) =>
    apiClient.put<any>(`/contact-submissions/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<any>(`/contact-submissions/${id}`),
};

// Users API
export const usersApi = {
  list: (params?: { skip?: number; limit?: number; active_only?: boolean }) =>
    apiClient.get<any[]>('/users', params),
  
  create: (data: any) =>
    apiClient.post<any>('/users', data),
  
  get: (id: string) =>
    apiClient.get<any>(`/users/${id}`),
  
  update: (id: string, data: any) =>
    apiClient.put<any>(`/users/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<any>(`/users/${id}`),
  
  me: () =>
    apiClient.get<any>('/users/me'),
  
  changePassword: (newPassword: string) =>
    apiClient.put<any>('/users/change-password', { new_password: newPassword }),
};

// Website Settings API
export const settingsApi = {
  get: () =>
    apiClient.get<any>('/settings'),
  
  update: (data: any) =>
    apiClient.put<any>('/settings', data),
};

// Homepage Banners API
export const bannersApi = {
  list: () =>
    apiClient.get<any[]>('/banners'),
  
  create: (data: any) =>
    apiClient.post<any>('/banners', data),
  
  get: (id: string) =>
    apiClient.get<any>(`/banners/${id}`),
  
  update: (id: string, data: any) =>
    apiClient.put<any>(`/banners/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<any>(`/banners/${id}`),
};

// ================================
// SITE MANAGEMENT API
// ================================

// Site Management Overview API
export const siteManagementApi = {
  getOverview: () =>
    apiClient.get<any>('/site-management/overview'),
};

// Hero Scenes API
export const heroScenesApi = {
  list: (params?: { 
    skip?: number; 
    limit?: number; 
    active_only?: boolean; 
    order_by?: 'order' | 'name' | 'created_at';
    order_direction?: 'asc' | 'desc';
  }) =>
    apiClient.get<any[]>('/site-management/hero-scenes', params),
  
  create: (data: {
    name: string;
    name_bn?: string;
    image_url: string;
    gradient_class: string;
    order?: number;
    is_active?: boolean;
  }) =>
    apiClient.post<any>('/site-management/hero-scenes', data),
  
  get: (id: string) =>
    apiClient.get<any>(`/site-management/hero-scenes/${id}`),
  
  update: (id: string, data: {
    name?: string;
    name_bn?: string;
    image_url?: string;
    gradient_class?: string;
    order?: number;
    is_active?: boolean;
  }) =>
    apiClient.put<any>(`/site-management/hero-scenes/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<any>(`/site-management/hero-scenes/${id}`),
  
  reorder: (id: string, newOrder: number) =>
    apiClient.post<any>(`/site-management/hero-scenes/${id}/reorder`, { new_order: newOrder }),
};

// Hero Content API
export const heroContentApi = {
  list: (params?: { skip?: number; limit?: number; active_only?: boolean }) =>
    apiClient.get<any[]>('/site-management/hero-content', params),
  
  getActive: () =>
    apiClient.get<any>('/site-management/hero-content/active'),
  
  create: (data: {
    headline_en: string;
    headline_bn: string;
    subtitle_en: string;
    subtitle_bn: string;
    cta_text_en: string;
    cta_text_bn: string;
    cta_link?: string;
    is_active?: boolean;
  }) =>
    apiClient.post<any>('/site-management/hero-content', data),
  
  get: (id: string) =>
    apiClient.get<any>(`/site-management/hero-content/${id}`),
  
  update: (id: string, data: {
    headline_en?: string;
    headline_bn?: string;
    subtitle_en?: string;
    subtitle_bn?: string;
    cta_text_en?: string;
    cta_text_bn?: string;
    cta_link?: string;
    is_active?: boolean;
  }) =>
    apiClient.put<any>(`/site-management/hero-content/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<any>(`/site-management/hero-content/${id}`),
};

// Contact Info API
export const contactInfoApi = {
  list: (params?: { skip?: number; limit?: number; active_only?: boolean }) =>
    apiClient.get<any[]>('/site-management/contact-info', params),
  
  getActive: () =>
    apiClient.get<any>('/site-management/contact-info/active'),
  
  create: (data: {
    company_name?: string;
    company_name_bn?: string;
    tagline_en?: string;
    tagline_bn?: string;
    address_en: string;
    address_bn: string;
    phone: string;
    phone_display_bn?: string;
    email: string;
    working_hours_en?: string;
    working_hours_bn?: string;
    facebook_url?: string;
    twitter_url?: string;
    instagram_url?: string;
    youtube_url?: string;
    latitude?: number;
    longitude?: number;
    is_active?: boolean;
  }) =>
    apiClient.post<any>('/site-management/contact-info', data),
  
  get: (id: string) =>
    apiClient.get<any>(`/site-management/contact-info/${id}`),
  
  update: (id: string, data: {
    company_name?: string;
    company_name_bn?: string;
    tagline_en?: string;
    tagline_bn?: string;
    address_en?: string;
    address_bn?: string;
    phone?: string;
    phone_display_bn?: string;
    email?: string;
    working_hours_en?: string;
    working_hours_bn?: string;
    facebook_url?: string;
    twitter_url?: string;
    instagram_url?: string;
    youtube_url?: string;
    latitude?: number;
    longitude?: number;
    is_active?: boolean;
  }) =>
    apiClient.put<any>(`/site-management/contact-info/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<any>(`/site-management/contact-info/${id}`),
};

// Service Options API
export const serviceOptionsApi = {
  list: (params?: { 
    skip?: number; 
    limit?: number; 
    active_only?: boolean; 
    order_by?: 'order' | 'name_en' | 'created_at';
    order_direction?: 'asc' | 'desc';
  }) =>
    apiClient.get<any[]>('/site-management/service-options', params),
  
  create: (data: {
    name_en: string;
    name_bn: string;
    description_en?: string;
    description_bn?: string;
    icon?: string;
    is_active?: boolean;
    order?: number;
  }) =>
    apiClient.post<any>('/site-management/service-options', data),
  
  get: (id: string) =>
    apiClient.get<any>(`/site-management/service-options/${id}`),
  
  update: (id: string, data: {
    name_en?: string;
    name_bn?: string;
    description_en?: string;
    description_bn?: string;
    icon?: string;
    is_active?: boolean;
    order?: number;
  }) =>
    apiClient.put<any>(`/site-management/service-options/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<any>(`/site-management/service-options/${id}`),
  
  reorder: (id: string, newOrder: number) =>
    apiClient.post<any>(`/site-management/service-options/${id}/reorder`, { new_order: newOrder }),
};

// Visa Services API
export const visaServicesApi = {
  list: (params?: { skip?: number; limit?: number; available_only?: boolean; featured_only?: boolean; country?: string; tags?: string[] }) =>
    apiClient.get<any[]>('/visa-services', params),
  
  create: (data: any) =>
    apiClient.post<any>('/visa-services', data),
  
  get: (id: string) =>
    apiClient.get<any>(`/visa-services/${id}`),
  
  getByCountry: (countryName: string) =>
    apiClient.get<any>(`/visa-services/country/${countryName}`),
  
  update: (id: string, data: any) =>
    apiClient.put<any>(`/visa-services/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<any>(`/visa-services/${id}`),
  
  getSimilar: (id: string, limit?: number) =>
    apiClient.get<any[]>(`/visa-services/${id}/similar`, { limit }),
  
  getAllTags: () =>
    apiClient.get<{ tags: string[] }>('/visa-services/tags/all'),
  
  getAllCountries: () =>
    apiClient.get<{ countries: Array<{ name: string; name_bn?: string; flag?: string }> }>('/visa-services/countries/all'),
};

// Uploads API
export const uploadsApi = {
  uploadImage: (file: File) =>
    apiClient.uploadFile<{
      filename: string;
      original_filename: string;
      url: string;
      size: number;
      format: string;
      original_size: number;
      compression_ratio: number;
    }>('/uploads/image', file),
  
  uploadImages: (files: File[]) =>
    apiClient.uploadFiles<{
      uploaded_files: Array<{
        filename: string;
        original_filename: string;
        url: string;
        size: number;
        format: string;
        original_size: number;
        compression_ratio: number;
      }>;
      total_files: number;
      message: string;
    }>('/uploads/images', files),
  
  deleteFile: (filename: string) =>
    apiClient.delete<{ message: string }>(`/uploads/${filename}`),
  
  // Get upload statistics
  getStats: () =>
    apiClient.get<{
      total_files: number;
      total_size_bytes: number;
      total_size_mb: number;
      file_types: Record<string, number>;
      uploads_directory: string;
    }>('/uploads/stats'),
  
  // Helper function to get full file URL
  getFileURL: (filename: string) => {
    const baseURL = getFileBaseURL();
    return `${baseURL}/static/uploads/${filename}`;
  },
  
  // Helper function to validate if a URL is from our uploads
  isUploadURL: (url: string) => {
    return url.includes('/static/uploads/') || url.includes('/uploads/');
  },
  
  // Helper function to normalize upload URLs (for backward compatibility)
  normalizeUploadURL: (url: string) => {
    if (!url) return url;
    
    // If it's already a full URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's a relative path, make it absolute
    if (url.startsWith('/')) {
      const baseURL = getFileBaseURL();
      return `${baseURL}${url}`;
    }
    
    // If it's just a filename, construct the full URL
    const baseURL = getFileBaseURL();
    return `${baseURL}/static/uploads/${url}`;
  },
  
  // Helper function to format file size
  formatFileSize: (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};

