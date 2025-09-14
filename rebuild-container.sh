#!/bin/bash

# Rebuild container with fixed Nginx config
echo "🔧 Rebuilding container with fixed Nginx configuration..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
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

print_step "1. Stopping and removing old container..."
docker stop ahmed-amin-frontend 2>/dev/null || true
docker rm ahmed-amin-frontend 2>/dev/null || true

print_step "2. Removing old image..."
docker rmi ahmed-amin-frontend 2>/dev/null || true

print_step "3. Building new container with fixed config..."
cd frontend
docker build -t ahmed-amin-frontend .
if [ $? -ne 0 ]; then
    print_error "Docker build failed!"
    exit 1
fi

print_step "4. Running new container..."
docker run -d \
    --name ahmed-amin-frontend \
    --restart unless-stopped \
    -p 8080:80 \
    ahmed-amin-frontend

if [ $? -ne 0 ]; then
    print_error "Failed to start container!"
    exit 1
fi

print_step "5. Waiting for container to start..."
sleep 5

print_step "6. Testing container..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 | grep -q "200"; then
    print_status "✅ Container is working on port 8080!"
    
    print_step "7. Updating Nginx proxy configuration..."
    cat > /etc/nginx/sites-available/ahmedamin.deepthinkcodearts.com << 'EOF'
server {
    listen 80;
    server_name ahmedamin.deepthinkcodearts.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
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
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
EOF

    print_step "8. Testing and reloading Nginx..."
    nginx -t && systemctl reload nginx
    
    print_step "9. Testing website..."
    sleep 2
    if curl -s -o /dev/null -w "%{http_code}" http://ahmedamin.deepthinkcodearts.com | grep -q "200\|301\|302"; then
        print_status "✅ Website is working! https://ahmedamin.deepthinkcodearts.com"
    else
        print_warning "Website might still be loading, try again in a moment"
    fi
    
    print_status "📊 Container status:"
    docker ps | grep ahmed-amin-frontend
    
else
    print_error "❌ Container is still not working!"
    print_error "Container logs:"
    docker logs ahmed-amin-frontend | tail -10
    exit 1
fi

print_status "🎉 Container rebuilt successfully!"
print_status "🌐 Your website: https://ahmedamin.deepthinkcodearts.com"
