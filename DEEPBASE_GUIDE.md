# DeepBase Development Guide

## What is DeepBase?

DeepBase is a rapid website development platform that provides a complete backend and CMS foundation. Simply upload your view files and we'll build the backend and CMS needed to support them with minimal LLM token usage.

## Current Structure

### Backend (FastAPI)
- **Authentication**: JWT-based auth with role management
- **Database**: PostgreSQL with Alembic migrations
- **Admin Management**: Complete staff management system
- **API Routes**: Generic content management endpoints
- **File Uploads**: Image and file handling
- **Email Service**: Contact form handling

### Frontend (React)
- **CMS Panel**: Full-featured admin interface
- **UI Components**: shadcn/ui component library
- **Authentication**: Protected routes and role-based access
- **Placeholder Page**: Clean landing page for new projects

### Preserved CMS Modules
- **Dashboard**: System overview and quick actions
- **Site Management**: Hero content, contact info, service options
- **Content Management**: Blog posts and content
- **Contact Forms**: Message management
- **Staff Management**: User roles and permissions

## How to Use DeepBase

### 1. Start with DeepBase

#### Local Development (Recommended)
```bash
# Clone and setup
git clone <your-deepbase-repo>
cd deepbase_reactFast

# Choose your development method:
# Both services together
./dev-both.sh

# Or start separately:
./dev-backend.sh    # Terminal 1
./dev-frontend.sh   # Terminal 2
```

#### VPS Deployment (Docker)
```bash
# For production deployment
docker-compose -f docker-compose.prod.yml up -d
```

### 2. Access Admin Panel
- **Local**: Navigate to `http://localhost:5173/cms`
- **Docker**: Navigate to `http://localhost:3000/cms`
- Login with admin credentials
- Configure your site settings

### 3. Upload Your Views
- Replace the placeholder page with your design
- Add your custom components
- Configure routing as needed

### 4. Backend Integration
- All necessary API endpoints are ready
- Database models are flexible and extensible
- Authentication system is complete

## Development Workflow

1. **Design Phase**: Create your frontend views and components
2. **Integration Phase**: Connect views to existing API endpoints
3. **Customization Phase**: Add any specific business logic
4. **Deployment Phase**: Use Docker for production deployment

## Key Benefits

- **Rapid Development**: Complete backend and CMS in minutes
- **Low Token Usage**: Minimal LLM calls needed for integration
- **Production Ready**: Docker configuration and security included
- **Scalable**: Built with modern, scalable technologies
- **Flexible**: Easy to customize and extend

## Next Steps

When you're ready to build a new website:

1. Upload your view files to the frontend
2. Tell the AI what specific backend features you need
3. The AI will quickly integrate everything using the existing DeepBase foundation
4. Deploy with Docker

This approach reduces development time from days to hours while maintaining high code quality and security standards.
