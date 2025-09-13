from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
try:
    # Starlette >= 0.13
    from starlette.middleware.proxy_headers import ProxyHeadersMiddleware  # type: ignore
except Exception:  # pragma: no cover - fallback for older stacks
    # Uvicorn provides a compatible middleware
    from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware  # type: ignore
from fastapi.staticfiles import StaticFiles
from decouple import config
from pathlib import Path
from app.config import database
from app.routes import (
    auth,
    users,
    settings,
    banners,
    tour_packages,
    umrah_packages,
    flights,
    blog_posts,
    contact_submissions,
    visa_services,
    recommendations,
    site_management,
    uploads
)

# Create FastAPI app
app = FastAPI(
    title="Aro CMS Backend",
    description="A lightweight CMS backend for website control",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration - environment based
CORS_ORIGINS = config("CORS_ORIGINS", default="*")
origins = CORS_ORIGINS.split(",") if CORS_ORIGINS != "*" else ["*"]

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trust X-Forwarded-* headers from reverse proxy (nginx)
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts=["*"])

# Mount static files for uploads (VPS compatibility)
UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True, parents=True)

# Ensure proper permissions for VPS deployment
try:
    import os
    os.chmod(UPLOAD_DIR, 0o755)
    print(f"Uploads directory permissions set: {UPLOAD_DIR}")
except Exception as e:
    print(f"Warning: Could not set directory permissions: {e}")

# Mount static files - this makes uploads accessible at /static/uploads/{filename}
app.mount("/static/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Database connection events
@app.on_event("startup")
async def startup():
    await database.connect()
    print(f"Backend started. Uploads directory: {UPLOAD_DIR}")

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(settings.router, prefix="/api/v1")
app.include_router(banners.router, prefix="/api/v1")
app.include_router(tour_packages.router, prefix="/api/v1")
app.include_router(umrah_packages.router, prefix="/api/v1")
app.include_router(flights.router, prefix="/api/v1")
app.include_router(blog_posts.router, prefix="/api/v1")
app.include_router(contact_submissions.router, prefix="/api/v1")
app.include_router(visa_services.router, prefix="/api/v1")
app.include_router(recommendations.router, prefix="/api/v1")
app.include_router(site_management.router, prefix="/api/v1/site-management", tags=["Site Management"])
app.include_router(uploads.router, prefix="/api/v1")

# Root endpoint
@app.get("/")
def read_root():
    return {
        "message": "Welcome to Aro CMS Backend API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "OK",
        "uploads_dir": str(UPLOAD_DIR)
    }

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "Aro CMS Backend is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 