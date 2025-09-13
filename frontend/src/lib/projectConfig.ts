// Project configuration loader
export interface ProjectConfig {
  project_name: string;
  project_display_name: string;
  project_description: string;
  project_domain: string;
  admin_email: string;
  company_name: string;
  company_name_bn: string;
  tagline: string;
  tagline_bn: string;
  default_theme: {
    primary_color: string;
    secondary_color: string;
  };
  features: {
    hero_scenes: boolean;
    hero_content: boolean;
    contact_info: boolean;
    service_options: boolean;
    blog_posts: boolean;
    staff_management: boolean;
  };
}

// Default configuration fallback
const defaultConfig: ProjectConfig = {
  project_name: "DeepBase",
  project_display_name: "DeepBase CMS",
  project_description: "Rapid website development platform",
  project_domain: "localhost",
  admin_email: "admin@localhost",
  company_name: "DeepBase",
  company_name_bn: "ডিপবেস",
  tagline: "Rapid Website Development Platform",
  tagline_bn: "দ্রুত ওয়েবসাইট উন্নয়ন প্ল্যাটফর্ম",
  default_theme: {
    primary_color: "#8b5cf6",
    secondary_color: "#06b6d4"
  },
  features: {
    hero_scenes: false,
    hero_content: true,
    contact_info: true,
    service_options: false,
    blog_posts: true,
    staff_management: true
  }
};

// Load project configuration
export function loadProjectConfig(): ProjectConfig {
  try {
    // In production, this would be loaded from the backend
    // For now, we'll use the default config
    return defaultConfig;
  } catch (error) {
    console.warn('Failed to load project config, using defaults:', error);
    return defaultConfig;
  }
}

export const projectConfig = loadProjectConfig();
