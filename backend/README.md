# Aro CMS Backend

A lightweight, modern CMS backend built with FastAPI for website content management. Perfect for travel agencies, tour operators, and businesses needing bilingual content management.

## 🚀 Features

- **User Management**: Role-based access control (Super Admin, Moderator)
- **Content Management**: 
  - Homepage banners with mobile-responsive images
  - Tour packages with detailed itineraries
  - Umrah packages with hotel and ritual information
  - Flight deals management
  - Blog posts with SEO-friendly slugs
  - Contact form submissions
- **Website Settings**: Global site configuration
- **Bilingual Support**: Bengali and English content support
- **Modern API**: RESTful API with automatic documentation
- **Security**: JWT-based authentication with role-based permissions
- **Database**: PostgreSQL with SQLAlchemy ORM and Alembic migrations

## 📋 Requirements

- Python 3.8+
- PostgreSQL 12+
- pip or poetry for dependency management

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd backend
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Setup

Copy the example environment file and configure your settings:

```bash
cp env.example .env
```

Edit `.env` file with your configuration:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/aro_cms_db
SECRET_KEY=your-super-secret-key-here-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 4. Database Setup

Create your PostgreSQL database:

```sql
CREATE DATABASE aro_cms_db;
```

Initialize the database with tables and default admin user:

```bash
python init_db.py
```

Or use Alembic for migrations:

```bash
# Initialize Alembic (if needed)
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 5. Run the Application

```bash
# Development server with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or using Python directly
python -m app.main
```

The API will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📚 API Documentation

### Authentication

**POST** `/api/v1/auth/login`
```json
{
  "email": "admin@arocms.com",
  "password": "admin123"
}
```

### Default Admin Credentials

- **Email**: `admin@arocms.com`
- **Password**: `admin123`
- ⚠️ **Important**: Change the default password after first login!

### API Endpoints

#### 👥 Users Management
- `GET /api/v1/users` - List all users (Super Admin only)
- `POST /api/v1/users` - Create new user (Super Admin only)
- `GET /api/v1/users/{id}` - Get user details (Super Admin only)
- `PUT /api/v1/users/{id}` - Update user (Super Admin only)
- `DELETE /api/v1/users/{id}` - Delete user (Super Admin only)
- `GET /api/v1/users/me` - Get current user profile

#### ⚙️ Website Settings
- `GET /api/v1/settings` - Get website settings (Public)
- `PUT /api/v1/settings` - Update website settings (Admin/Moderator)

#### 🎨 Homepage Banners
- `GET /api/v1/banners` - List banners (Public)
- `POST /api/v1/banners` - Create banner (Admin/Moderator)
- `GET /api/v1/banners/{id}` - Get banner (Public)
- `PUT /api/v1/banners/{id}` - Update banner (Admin/Moderator)
- `DELETE /api/v1/banners/{id}` - Delete banner (Admin/Moderator)

#### 🌍 Tour Packages
- `GET /api/v1/tour-packages` - List tour packages (Public)
- `POST /api/v1/tour-packages` - Create tour package (Admin/Moderator)
- `GET /api/v1/tour-packages/{id}` - Get tour package (Public)
- `PUT /api/v1/tour-packages/{id}` - Update tour package (Admin/Moderator)
- `DELETE /api/v1/tour-packages/{id}` - Delete tour package (Admin/Moderator)

#### 🕌 Umrah Packages
- `GET /api/v1/umrah-packages` - List umrah packages (Public)
- `POST /api/v1/umrah-packages` - Create umrah package (Admin/Moderator)
- `GET /api/v1/umrah-packages/{id}` - Get umrah package (Public)
- `PUT /api/v1/umrah-packages/{id}` - Update umrah package (Admin/Moderator)
- `DELETE /api/v1/umrah-packages/{id}` - Delete umrah package (Admin/Moderator)

#### ✈️ Flight Deals
- `GET /api/v1/flights` - List flight deals (Public)
- `POST /api/v1/flights` - Create flight deal (Admin/Moderator)
- `GET /api/v1/flights/{id}` - Get flight deal (Public)
- `PUT /api/v1/flights/{id}` - Update flight deal (Admin/Moderator)
- `DELETE /api/v1/flights/{id}` - Delete flight deal (Admin/Moderator)

#### 📰 Blog Posts
- `GET /api/v1/blog-posts` - List blog posts (Public)
- `POST /api/v1/blog-posts` - Create blog post (Admin/Moderator)
- `GET /api/v1/blog-posts/{id}` - Get blog post (Public)
- `GET /api/v1/blog-posts/slug/{slug}` - Get blog post by slug (Public)
- `PUT /api/v1/blog-posts/{id}` - Update blog post (Admin/Moderator)
- `DELETE /api/v1/blog-posts/{id}` - Delete blog post (Admin/Moderator)

#### 📬 Contact Submissions
- `POST /api/v1/contact-submissions` - Submit contact form (Public)
- `GET /api/v1/contact-submissions` - List submissions (Admin/Moderator)
- `GET /api/v1/contact-submissions/{id}` - Get submission (Admin/Moderator)
- `PUT /api/v1/contact-submissions/{id}` - Update submission (Admin/Moderator)
- `PUT /api/v1/contact-submissions/{id}/mark-read` - Mark as read (Admin/Moderator)
- `DELETE /api/v1/contact-submissions/{id}` - Delete submission (Admin/Moderator)

### Query Parameters

Most GET endpoints support filtering parameters:
- `skip`: Number of records to skip (pagination)
- `limit`: Maximum number of records to return
- `available_only`: Filter by availability (true/false)
- `featured_only`: Filter by featured status (true/false)
- `published_only`: Filter by published status (true/false)
- `unread_only`: Filter by read status (true/false)
- `active_only`: Filter by active status (true/false)

## 🗃️ Database Schema

### Core Tables

1. **profiles** - User management
2. **website_settings** - Global site settings
3. **homepage_banners** - Hero banners
4. **tour_packages** - Tour package listings
5. **umrah_packages** - Umrah package listings
6. **flight_deals** - Flight deals
7. **blog_posts** - Blog content
8. **contact_submissions** - Contact form data

### User Roles

- **super_admin**: Full system access, user management
- **moderator**: Content management access

## 🔒 Security

- JWT token-based authentication
- Role-based access control
- Password hashing with bcrypt
- CORS middleware for cross-origin requests
- Environment-based configuration

## 🚀 Deployment

### Using Docker (Recommended)

Create a `Dockerfile`:

```dockerfile
FROM python:3.9-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables for Production

```env
DATABASE_URL=postgresql://user:password@db:5432/aro_cms_db
SECRET_KEY=your-very-secure-secret-key-for-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Production Considerations

1. **Change Default Password**: Update the default admin password
2. **Secure Secret Key**: Use a strong, random secret key
3. **CORS Configuration**: Restrict CORS origins in `app/main.py`
4. **HTTPS**: Use HTTPS in production
5. **Database Backup**: Implement regular database backups
6. **Monitoring**: Add logging and monitoring

## 🧪 Testing

The project structure supports testing. Add your tests in a `tests/` directory:

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## 📝 Development

### Adding New Features

1. **Models**: Add new SQLAlchemy models in `app/models.py`
2. **Schemas**: Add Pydantic schemas in `app/schemas.py`
3. **Routes**: Create new route files in `app/routes/`
4. **Include Routes**: Add to `app/main.py`

### Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "Add new feature"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using FastAPI, SQLAlchemy, and PostgreSQL** 