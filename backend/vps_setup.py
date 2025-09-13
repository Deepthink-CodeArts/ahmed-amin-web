#!/usr/bin/env python3
"""
VPS Setup Script for Aro Tours Backend
Run this script on your VPS after deployment to ensure proper setup
"""

import os
import sys
import subprocess
from pathlib import Path

def setup_directories():
    """Create and set proper permissions for upload directories"""
    print("🏗️  Setting up directories...")
    
    # Create uploads directory
    upload_dir = Path(__file__).parent / "uploads"
    upload_dir.mkdir(exist_ok=True, parents=True)
    
    try:
        # Set directory permissions (readable/writable by owner, readable by group and others)
        os.chmod(upload_dir, 0o755)
        print(f"✅ Created uploads directory: {upload_dir}")
        print(f"✅ Set permissions: 755")
    except Exception as e:
        print(f"⚠️  Warning: Could not set directory permissions: {e}")

def check_dependencies():
    """Check if required system dependencies are installed"""
    print("🔍 Checking dependencies...")
    
    required_packages = [
        'python3-pip',
        'python3-venv',
        'postgresql-client',
        'libpq-dev',
        'python3-dev'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        result = subprocess.run(['dpkg', '-l', package], 
                              capture_output=True, text=True)
        if result.returncode != 0:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Missing packages: {', '.join(missing_packages)}")
        print("📝 Run the following command to install:")
        print(f"sudo apt update && sudo apt install -y {' '.join(missing_packages)}")
        return False
    else:
        print("✅ All required packages are installed")
        return True

def setup_environment():
    """Setup environment variables for production"""
    print("🔧 Setting up environment...")
    
    env_file = Path(__file__).parent / ".env"
    
    if not env_file.exists():
        print("📝 Creating .env file template...")
        env_template = """# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/aro_cms_db

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS - Update with your domain
CORS_ORIGINS=https://yourdomain.com,http://localhost:3000

# Environment
ENVIRONMENT=production
"""
        env_file.write_text(env_template)
        print(f"✅ Created .env template at: {env_file}")
        print("⚠️  IMPORTANT: Update the .env file with your actual values!")
    else:
        print("✅ .env file already exists")

def create_systemd_service():
    """Create systemd service file for auto-start"""
    print("🔧 Creating systemd service...")
    
    current_dir = Path(__file__).parent.absolute()
    service_content = f"""[Unit]
Description=Aro Tours Backend API
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory={current_dir}
Environment=PATH={current_dir}/venv/bin
ExecStart={current_dir}/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
"""
    
    service_file = Path("/etc/systemd/system/aro-backend.service")
    
    print(f"📝 Service file content for {service_file}:")
    print(service_content)
    print("\n⚠️  Run the following commands as root to enable the service:")
    print(f"sudo tee {service_file} << 'EOF'\n{service_content}EOF")
    print("sudo systemctl daemon-reload")
    print("sudo systemctl enable aro-backend")
    print("sudo systemctl start aro-backend")

def setup_nginx():
    """Provide nginx configuration"""
    print("🌐 Nginx configuration...")
    
    nginx_config = """server {
    listen 80;
    server_name your-domain.com;

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files (uploads)
    location /static/uploads/ {
        alias /path/to/your/backend/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Frontend (if serving both from same server)
    location / {
        root /path/to/your/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
"""
    
    print("📝 Nginx configuration template:")
    print(nginx_config)
    print("\n⚠️  Update paths and domain name, then place in /etc/nginx/sites-available/")

def main():
    print("🚀 Aro Tours VPS Setup Script")
    print("=" * 40)
    
    setup_directories()
    print()
    
    if sys.platform.startswith('linux'):
        check_dependencies()
        print()
    
    setup_environment()
    print()
    
    create_systemd_service()
    print()
    
    setup_nginx()
    print()
    
    print("✅ VPS setup preparation completed!")
    print("\n📋 Next steps:")
    print("1. Update the .env file with your actual values")
    print("2. Install the systemd service (see commands above)")
    print("3. Configure nginx with the provided template")
    print("4. Run database migrations: alembic upgrade head")
    print("5. Test the image upload functionality")

if __name__ == "__main__":
    main() 