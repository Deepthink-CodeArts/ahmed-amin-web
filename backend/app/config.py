import json
import os
from decouple import config
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from databases import Database
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

# Load project configuration
def load_project_config():
    """Load project configuration from project.config.json"""
    config_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'project.config.json')
    try:
        with open(config_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        # Fallback configuration if project.config.json doesn't exist
        return {
            "project_name": "DeepBase",
            "project_display_name": "DeepBase CMS",
            "admin_email": "admin@localhost",
            "admin_password": "admin123",
            "database_name": "deepbase_cms_db",
            "database_user": "deepbase_user",
            "database_password": "deepbase_password",
            "company_name": "DeepBase",
            "company_name_bn": "ডিপবেস",
            "tagline": "Rapid Website Development Platform",
            "tagline_bn": "দ্রুত ওয়েবসাইট উন্নয়ন প্ল্যাটফর্ম"
        }

PROJECT_CONFIG = load_project_config()

# Environment variables with project-specific defaults
DATABASE_URL = config("DATABASE_URL", default=f"postgresql://{PROJECT_CONFIG['database_user']}:{PROJECT_CONFIG['database_password']}@localhost:5432/{PROJECT_CONFIG['database_name']}")
SECRET_KEY = config("SECRET_KEY", default="your-super-secret-key-here")
ALGORITHM = config("ALGORITHM", default="HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = config("ACCESS_TOKEN_EXPIRE_MINUTES", default=30, cast=int)

# Email configuration with project-specific defaults
MAIL_USERNAME = config("MAIL_USERNAME", default=PROJECT_CONFIG['admin_email'])
MAIL_PASSWORD = config("MAIL_PASSWORD", default="")
MAIL_FROM = config("MAIL_FROM", default=PROJECT_CONFIG['admin_email'])
MAIL_PORT = config("MAIL_PORT", default=587, cast=int)
MAIL_SERVER = config("MAIL_SERVER", default=f"mail.{PROJECT_CONFIG['project_domain']}")
MAIL_FROM_NAME = config("MAIL_FROM_NAME", default=PROJECT_CONFIG['company_name'])
USE_CREDENTIALS = config("USE_CREDENTIALS", default=True, cast=bool)
VALIDATE_CERTS = config("VALIDATE_CERTS", default=True, cast=bool)

# Database setup
database = Database(DATABASE_URL)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Email configuration
conf = ConnectionConfig(
    MAIL_USERNAME=MAIL_USERNAME,
    MAIL_PASSWORD=MAIL_PASSWORD,
    MAIL_FROM=MAIL_FROM,
    MAIL_PORT=MAIL_PORT,
    MAIL_SERVER=MAIL_SERVER,
    MAIL_FROM_NAME=MAIL_FROM_NAME,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=USE_CREDENTIALS,
    VALIDATE_CERTS=VALIDATE_CERTS
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 