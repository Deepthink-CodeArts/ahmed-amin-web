from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.config import get_db
from app.models import BlogPost, Profile
from app.schemas import BlogPost as BlogPostSchema, BlogPostCreate, BlogPostUpdate
from app.auth import require_admin_or_moderator

router = APIRouter(prefix="/blog-posts", tags=["Blog Posts"])

@router.get("/", response_model=List[BlogPostSchema])
def get_blog_posts(
    skip: int = 0,
    limit: int = 100,
    published_only: bool = False,
    db: Session = Depends(get_db)
):
    """Get blog posts - Public endpoint"""
    query = db.query(BlogPost)
    
    if published_only:
        query = query.filter(BlogPost.is_published == True)
    
    posts = query.order_by(BlogPost.created_at.desc()).offset(skip).limit(limit).all()
    return posts

@router.post("/", response_model=BlogPostSchema)
def create_blog_post(
    post: BlogPostCreate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Create blog post - Requires admin/moderator access"""
    # Check if slug already exists
    existing_post = db.query(BlogPost).filter(BlogPost.slug == post.slug).first()
    if existing_post:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Blog post with this slug already exists"
        )
    
    db_post = BlogPost(**post.dict())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.get("/{post_id}", response_model=BlogPostSchema)
def get_blog_post(post_id: UUID, db: Session = Depends(get_db)):
    """Get single blog post - Public endpoint"""
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    return post

@router.get("/slug/{slug}", response_model=BlogPostSchema)
def get_blog_post_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get blog post by slug - Public endpoint"""
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    return post

@router.put("/{post_id}", response_model=BlogPostSchema)
def update_blog_post(
    post_id: UUID,
    post_update: BlogPostUpdate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Update blog post - Requires admin/moderator access"""
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    update_data = post_update.dict(exclude_unset=True)
    
    # Check slug uniqueness if slug is being updated
    if "slug" in update_data and update_data["slug"] != post.slug:
        existing_post = db.query(BlogPost).filter(BlogPost.slug == update_data["slug"]).first()
        if existing_post:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Blog post with this slug already exists"
            )
    
    for field, value in update_data.items():
        setattr(post, field, value)
    
    db.commit()
    db.refresh(post)
    return post

@router.delete("/{post_id}")
def delete_blog_post(
    post_id: UUID,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Delete blog post - Requires admin/moderator access"""
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    db.delete(post)
    db.commit()
    return {"message": "Blog post deleted successfully"} 