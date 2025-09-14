#!/bin/bash

# Ahmed Amin Group - Domain Deployment Script
echo "🚀 Deploying to ahmedamin.deepthinkcodearts.com..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

print_step "1. Building frontend..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    print_error "Build failed!"
    exit 1
fi

print_step "2. Copying built files to web root..."
cp -r dist/* /var/www/html/
chown -R www-data:www-data /var/www/html/

print_step "3. Testing Nginx configuration..."
nginx -t
if [ $? -ne 0 ]; then
    print_error "Nginx configuration test failed!"
    exit 1
fi

print_step "4. Reloading Nginx..."
systemctl reload nginx

print_step "5. Checking SSL certificate..."
if [ ! -f "/etc/letsencrypt/live/ahmedamin.deepthinkcodearts.com/fullchain.pem" ]; then
    print_warning "SSL certificate not found. Run setup-domain.sh first!"
    exit 1
fi

print_status "✅ Deployment completed successfully!"
print_status "🌐 Your website is now live at: https://ahmedamin.deepthinkcodearts.com"
print_status "🔒 SSL certificate is active"
print_status "📊 Check status with: systemctl status nginx"
