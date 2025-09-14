#!/bin/bash

# Ahmed Amin Group - Simple Docker Deployment (No Nginx conflict)
echo "🐳 Simple Docker deployment to ahmedamin.deepthinkcodearts.com..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

print_step "1. Stopping Nginx to free up port 80..."
systemctl stop nginx

print_step "2. Stopping existing container..."
docker stop ahmed-amin-frontend 2>/dev/null || true
docker rm ahmed-amin-frontend 2>/dev/null || true

print_step "3. Building Docker image..."
cd frontend
docker build -t ahmed-amin-frontend .
if [ $? -ne 0 ]; then
    print_warning "Alpine build failed, trying Ubuntu alternative..."
    docker build -f Dockerfile.alternative -t ahmed-amin-frontend .
    if [ $? -ne 0 ]; then
        print_error "Both Docker builds failed!"
        exit 1
    fi
fi

print_step "4. Running container on port 80..."
docker run -d \
    --name ahmed-amin-frontend \
    --restart unless-stopped \
    -p 80:80 \
    -p 443:443 \
    -v /etc/letsencrypt:/etc/letsencrypt:ro \
    ahmed-amin-frontend

if [ $? -ne 0 ]; then
    print_error "Failed to start container!"
    print_warning "Trying port 3000 instead..."
    docker run -d \
        --name ahmed-amin-frontend \
        --restart unless-stopped \
        -p 3000:80 \
        ahmed-amin-frontend
fi

print_step "5. Checking container status..."
if docker ps | grep -q "ahmed-amin-frontend"; then
    print_status "✅ Container is running successfully!"
    
    # Check which port it's running on
    if docker ps | grep -q ":80->"; then
        print_status "🌐 Your website is live at: http://ahmedamin.deepthinkcodearts.com"
        print_status "🔒 HTTPS will work once SSL is configured"
    else
        print_status "🌐 Your website is live at: http://ahmedamin.deepthinkcodearts.com:3000"
        print_warning "You may need to configure Nginx to proxy to port 3000"
    fi
    
    print_status "📊 Container status:"
    docker ps | grep ahmed-amin-frontend
else
    print_error "❌ Container failed to start!"
    print_error "Check logs with: docker logs ahmed-amin-frontend"
    exit 1
fi

print_status "🎉 Simple Docker deployment completed!"
print_status "To view logs: docker logs -f ahmed-amin-frontend"
print_status "To stop: docker stop ahmed-amin-frontend"
