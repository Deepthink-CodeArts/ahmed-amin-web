#!/bin/bash

# Ahmed Amin Group - Docker Deployment Script
echo "🐳 Deploying with Docker to ahmedamin.deepthinkcodearts.com..."

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

print_step "1. Building Docker image..."
cd frontend
docker build -t ahmed-amin-frontend .
if [ $? -ne 0 ]; then
    print_error "Docker build failed!"
    exit 1
fi

print_step "2. Stopping existing container..."
docker stop ahmed-amin-frontend 2>/dev/null || true
docker rm ahmed-amin-frontend 2>/dev/null || true

print_step "3. Running new container..."
docker run -d \
    --name ahmed-amin-frontend \
    --restart unless-stopped \
    -p 80:80 \
    -p 443:443 \
    -v /etc/letsencrypt:/etc/letsencrypt:ro \
    -v /var/www/certbot:/var/www/certbot:ro \
    ahmed-amin-frontend

if [ $? -ne 0 ]; then
    print_error "Failed to start container!"
    exit 1
fi

print_step "4. Updating Nginx configuration for Docker..."
cat > /etc/nginx/sites-available/ahmedamin.deepthinkcodearts.com << 'EOF'
server {
    listen 80;
    server_name ahmedamin.deepthinkcodearts.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl http2;
    server_name ahmedamin.deepthinkcodearts.com;

    ssl_certificate /etc/letsencrypt/live/ahmedamin.deepthinkcodearts.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ahmedamin.deepthinkcodearts.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
EOF

print_step "5. Testing and reloading Nginx..."
nginx -t && systemctl reload nginx

print_step "6. Checking container status..."
if docker ps | grep -q "ahmed-amin-frontend"; then
    print_status "✅ Container is running successfully!"
    print_status "🌐 Your website is live at: https://ahmedamin.deepthinkcodearts.com"
    print_status "📊 Container status:"
    docker ps | grep ahmed-amin-frontend
else
    print_error "❌ Container failed to start!"
    print_error "Check logs with: docker logs ahmed-amin-frontend"
    exit 1
fi

print_status "🎉 Docker deployment completed successfully!"
print_status "To view logs: docker logs -f ahmed-amin-frontend"
print_status "To stop: docker stop ahmed-amin-frontend"
