from fastapi_mail import FastMail, MessageSchema
from app.config import conf
from typing import List

async def send_quick_booking_email(
    name: str,
    phone: str,
    service_name: str,
    message: str
):
    """Send quick booking notification email"""
    
    try:
        # Create email content
        subject = f"🚀 Quick Booking Request - {service_name}"
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">🚀 Quick Booking Request</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">ARO Tours & Travels</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #667eea; margin-top: 0;">New Quick Booking Request</h2>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h3 style="color: #333; margin-top: 0;">Customer Details:</h3>
                        <p><strong>Name:</strong> {name}</p>
                        <p><strong>Phone:</strong> <a href="tel:{phone}" style="color: #667eea; text-decoration: none;">{phone}</a></p>
                        <p><strong>Service:</strong> {service_name}</p>
                    </div>
                    
                    <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                        <h3 style="color: #333; margin-top: 0;">Message:</h3>
                        <p style="margin: 0;">{message}</p>
                    </div>
                    
                    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                        <p style="margin: 0; color: #856404;">
                            <strong>⚡ Action Required:</strong> Please call the customer within 10 minutes as promised!
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="tel:{phone}" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                            📞 Call Now
                        </a>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                    <p>This email was sent from ARO Tours & Travels website</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Create message
        message_obj = MessageSchema(
            subject=subject,
            recipients=["arotours.business@gmail.com"],
            body=html_content,
            subtype="html"
        )
        
        # Send email
        fm = FastMail(conf)
        await fm.send_message(message_obj)
        
        return True
        
    except Exception as e:
        print(f"Email sending failed: {str(e)}")
        return False
