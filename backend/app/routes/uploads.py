import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Request
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
from pathlib import Path
import aiofiles
from PIL import Image
import io
from decouple import config

from app.config import get_db
from app.auth import require_admin_or_moderator
from app.models import Profile

router = APIRouter(prefix="/uploads", tags=["File Uploads"])

# Create uploads directory with absolute path for VPS compatibility
UPLOAD_DIR = Path(__file__).parent.parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True, parents=True)

# Set proper permissions for VPS deployment
try:
    os.chmod(UPLOAD_DIR, 0o755)
except Exception as e:
    print(f"Warning: Could not set directory permissions: {e}")

# Allowed image types
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB (increased for high-res images)
MAX_DIMENSION = 4096  # Maximum width/height for images

# WebP conversion settings
WEBP_QUALITY = 85  # Quality for WebP conversion (0-100)
WEBP_LOSSLESS = False  # Use lossless compression for better quality
WEBP_METHOD = 6  # Compression method (0-6, higher = better compression but slower)

# Get base URL from environment or detect automatically
def get_base_url():
    # Check environment variable first
    base_url = config("BASE_URL", default="")
    if base_url:
        return base_url.rstrip('/')
    
    # For localhost development
    return "http://localhost:8000"

def validate_image_file(file: UploadFile) -> None:
    """Validate uploaded image file"""
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided"
        )
    
    # Check file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file_ext} not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Check file size
    if file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
        )

def generate_unique_filename(original_filename: str) -> str:
    """Generate unique filename with .webp extension"""
    unique_id = str(uuid.uuid4())
    return f"{unique_id}.webp"

def convert_to_webp(image_content: bytes, original_filename: str) -> bytes:
    """Convert image to WebP format with optimization"""
    try:
        # Open image with Pillow
        image = Image.open(io.BytesIO(image_content))
        
        # Convert RGBA to RGB if necessary (WebP doesn't support RGBA well)
        if image.mode in ('RGBA', 'LA', 'P'):
            # Create white background for transparent images
            background = Image.new('RGB', image.size, (255, 255, 255))
            if image.mode == 'P':
                image = image.convert('RGBA')
            background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
            image = background
        elif image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize if image is too large
        if max(image.size) > MAX_DIMENSION:
            # Calculate new dimensions maintaining aspect ratio
            ratio = MAX_DIMENSION / max(image.size)
            new_size = tuple(int(dim * ratio) for dim in image.size)
            image = image.resize(new_size, Image.Resampling.LANCZOS)
            print(f"Resized image from {image.size} to {new_size}")
        
        # Convert to WebP
        webp_buffer = io.BytesIO()
        
        # Use optimized WebP settings
        webp_options = {
            'quality': WEBP_QUALITY,
            'lossless': WEBP_LOSSLESS,
            'method': WEBP_METHOD,
            'optimize': True
        }
        
        image.save(webp_buffer, format='WEBP', **webp_options)
        webp_content = webp_buffer.getvalue()
        
        # Log conversion details
        original_size = len(image_content)
        webp_size = len(webp_content)
        compression_ratio = (1 - webp_size / original_size) * 100
        
        print(f"Image converted to WebP: {original_filename}")
        print(f"Original size: {original_size / 1024:.1f}KB")
        print(f"WebP size: {webp_size / 1024:.1f}KB")
        print(f"Compression: {compression_ratio:.1f}%")
        
        return webp_content
        
    except Exception as e:
        print(f"Error converting image to WebP: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to convert image to WebP: {str(e)}"
        )

def optimize_image_metadata(image_content: bytes) -> bytes:
    """Optimize image metadata and strip unnecessary information"""
    try:
        image = Image.open(io.BytesIO(image_content))
        
        # Create a new image with minimal metadata
        optimized_buffer = io.BytesIO()
        image.save(optimized_buffer, format='WEBP', optimize=True)
        
        return optimized_buffer.getvalue()
    except Exception as e:
        print(f"Warning: Could not optimize image metadata: {e}")
        return image_content

@router.post("/image")
async def upload_image(
    request: Request,
    file: UploadFile = File(...),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Upload a single image file and convert to WebP - Requires admin/moderator access"""
    
    # Validate the uploaded file
    validate_image_file(file)
    
    # Generate unique filename (always .webp extension)
    filename = generate_unique_filename(file.filename)
    file_path = UPLOAD_DIR / filename
    
    try:
        # Read the uploaded file
        content = await file.read()
        
        # Validate it's a real image file
        try:
            test_image = Image.open(io.BytesIO(content))
            test_image.verify()
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image file"
            )
        
        # Convert to WebP
        webp_content = convert_to_webp(content, file.filename)
        
        # Optimize metadata
        optimized_content = optimize_image_metadata(webp_content)
        
        # Save the WebP file
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(optimized_content)
        
        # Return the URL to access the file - derive from incoming request to respect proxy domain
        base_url = str(request.base_url).rstrip('/')
        file_url = f"{base_url}/static/uploads/{filename}"
        
        return {
            "filename": filename,
            "original_filename": file.filename,
            "url": file_url,
            "size": len(optimized_content),
            "format": "webp",
            "original_size": len(content),
            "compression_ratio": round((1 - len(optimized_content) / len(content)) * 100, 1)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {str(e)}"
        )

@router.post("/images")
async def upload_multiple_images(
    request: Request,
    files: List[UploadFile] = File(...),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Upload multiple image files and convert to WebP - Requires admin/moderator access"""
    
    if len(files) > 10:  # Limit to 10 files at once
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Too many files. Maximum 10 files allowed"
        )
    
    uploaded_files = []
    base_url = str(request.base_url).rstrip('/')
    
    for file in files:
        try:
            # Validate the uploaded file
            validate_image_file(file)
            
            # Generate unique filename (always .webp extension)
            filename = generate_unique_filename(file.filename)
            file_path = UPLOAD_DIR / filename
            
            # Read the uploaded file
            content = await file.read()
            
            # Validate it's a real image file
            try:
                test_image = Image.open(io.BytesIO(content))
                test_image.verify()
            except Exception:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid image file: {file.filename}"
                )
            
            # Convert to WebP
            webp_content = convert_to_webp(content, file.filename)
            
            # Optimize metadata
            optimized_content = optimize_image_metadata(webp_content)
            
            # Save the WebP file
            async with aiofiles.open(file_path, 'wb') as f:
                await f.write(optimized_content)
            
            # Add to results - use consistent URL format
            file_url = f"{base_url}/static/uploads/{filename}"
            uploaded_files.append({
                "filename": filename,
                "original_filename": file.filename,
                "url": file_url,
                "size": len(optimized_content),
                "format": "webp",
                "original_size": len(content),
                "compression_ratio": round((1 - len(optimized_content) / len(content)) * 100, 1)
            })
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload file {file.filename}: {str(e)}"
            )
    
    return {
        "uploaded_files": uploaded_files,
        "total_files": len(uploaded_files),
        "message": f"All {len(uploaded_files)} images converted to WebP format"
    }

@router.get("/serve/{filename}")
async def serve_file(filename: str):
    """Serve uploaded files - Public endpoint (legacy support)"""
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    return FileResponse(file_path)

@router.delete("/{filename}")
async def delete_file(
    filename: str,
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Delete uploaded file - Requires admin/moderator access"""
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    try:
        file_path.unlink()
        return {"message": f"File {filename} deleted successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete file: {str(e)}"
        )

@router.get("/stats")
async def get_upload_stats(current_user: Profile = Depends(require_admin_or_moderator)):
    """Get upload statistics - Requires admin/moderator access"""
    try:
        total_files = 0
        total_size = 0
        file_types = {}
        
        for file_path in UPLOAD_DIR.glob("*.webp"):
            if file_path.is_file():
                total_files += 1
                total_size += file_path.stat().st_size
                
                # Count file types (though all should be .webp now)
                ext = file_path.suffix.lower()
                file_types[ext] = file_types.get(ext, 0) + 1
        
        return {
            "total_files": total_files,
            "total_size_bytes": total_size,
            "total_size_mb": round(total_size / (1024 * 1024), 2),
            "file_types": file_types,
            "uploads_directory": str(UPLOAD_DIR)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get upload stats: {str(e)}"
        ) 