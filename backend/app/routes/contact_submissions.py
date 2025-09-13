from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.config import get_db
from app.models import ContactSubmission, Profile
from app.schemas import ContactSubmission as ContactSubmissionSchema, ContactSubmissionCreate, ContactSubmissionUpdate
from app.auth import require_admin_or_moderator
from app.email_service import send_quick_booking_email
from app.config import conf

router = APIRouter(prefix="/contact-submissions", tags=["Contact Submissions"])



@router.post("/", response_model=ContactSubmissionSchema)
async def create_contact_submission(
    submission: ContactSubmissionCreate,
    db: Session = Depends(get_db)
):
    """Create contact submission - Public endpoint"""
    db_submission = ContactSubmission(**submission.dict())
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    
    # Send email notification for quick bookings
    # TEMPORARILY DISABLED - Email service causing slow submissions
    # if "Quick Booking" in submission.name or "quick-booking" in submission.email:
    #     await send_quick_booking_email(
    #         name=submission.name,
    #         phone=submission.phone,
    #         service_name=submission.subject.replace("Quick Booking - ", ""),
    #         message=submission.message
    #     )
    
    return db_submission

@router.get("/", response_model=List[ContactSubmissionSchema])
def get_contact_submissions(
    skip: int = 0,
    limit: int = 100,
    unread_only: bool = False,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Get contact submissions - Requires admin/moderator access"""
    query = db.query(ContactSubmission)
    
    if unread_only:
        query = query.filter(ContactSubmission.is_read == False)
    
    submissions = query.order_by(ContactSubmission.created_at.desc()).offset(skip).limit(limit).all()
    return submissions

@router.get("/{submission_id}", response_model=ContactSubmissionSchema)
def get_contact_submission(
    submission_id: UUID,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Get single contact submission - Requires admin/moderator access"""
    submission = db.query(ContactSubmission).filter(ContactSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact submission not found"
        )
    return submission

@router.put("/{submission_id}", response_model=ContactSubmissionSchema)
def update_contact_submission(
    submission_id: UUID,
    submission_update: ContactSubmissionUpdate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Update contact submission (mainly to mark as read) - Requires admin/moderator access"""
    submission = db.query(ContactSubmission).filter(ContactSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact submission not found"
        )
    
    update_data = submission_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(submission, field, value)
    
    db.commit()
    db.refresh(submission)
    return submission

@router.delete("/{submission_id}")
def delete_contact_submission(
    submission_id: UUID,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Delete contact submission - Requires admin/moderator access"""
    submission = db.query(ContactSubmission).filter(ContactSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact submission not found"
        )
    
    db.delete(submission)
    db.commit()
    return {"message": "Contact submission deleted successfully"}

@router.put("/{submission_id}/mark-read", response_model=ContactSubmissionSchema)
def mark_submission_as_read(
    submission_id: UUID,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin_or_moderator)
):
    """Mark contact submission as read - Requires admin/moderator access"""
    submission = db.query(ContactSubmission).filter(ContactSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact submission not found"
        )
    
    submission.is_read = True
    db.commit()
    db.refresh(submission)
    return submission 