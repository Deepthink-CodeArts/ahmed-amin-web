#!/bin/bash

# Fix 502 error
echo "🔧 Fixing 502 error..."

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

print_step "1. Checking container status..."
if ! docker ps | grep -q "ahmed-amin-frontend"; then
    print_error "Container is not running! Starting it..."
    docker start ahmed-amin-frontend
    sleep 5
fi

print_step "2. Getting container port..."
CONTAINER_PORT=$(docker ps --format "table {{.Ports}}" | grep ahmed-amin-frontend | grep -o '[0-9]*:80' | cut -d: -f1)
print_status "Container is running on port: $CONTAINER_PORT"

print_step "3. Testing container directly..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:$CONTAINER_PORT | grep -q "200"; then
    print_status "✅ Container is responding on port $CONTAINER_PORT"
else
    print_error "❌ Container is not responding on port $CONTAINER_PORT"
    print_error "Container logs:"
    docker logs ahmed-amin-frontend | tail -10
    exit 1
fi

print_step "4. Updating Nginx configuration with correct port..."
cat > /etc/nginx/sites-available/ahmedamin.deepthinkcodearts.com << EOF
server {
    listen 80;
    server_name ahmedamin.deepthinkcodearts.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        proxy_pass http://127.0.0.1:$CONTAINER_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
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
        proxy_pass http://127.0.0.1:$CONTAINER_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
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

print_step "5. Testing Nginx configuration..."
nginx -t
if [ $? -ne 0 ]; then
    print_error "Nginx configuration test failed!"
    exit 1
fi

print_step "6. Reloading Nginx..."
systemctl reload nginx

print_step "7. Testing the website..."
sleep 2
if curl -s -o /dev/null -w "%{http_code}" http://ahmedamin.deepthinkcodearts.com | grep -q "200"; then
    print_status "✅ Website is working! HTTP 200"
elif curl -s -o /dev/null -w "%{http_code}" http://ahmedamin.deepthinkcodearts.com | grep -q "301\|302"; then
    print_status "✅ Website is redirecting (HTTPS working)"
else
    print_error "❌ Website still not working"
    print_error "Testing direct container access:"
    curl -I http://localhost:$CONTAINER_PORT
    print_error "Testing Nginx proxy:"
    curl -I http://localhost
fi

print_status "🎉 502 fix completed!"
print_status "🌐 Try accessing: https://ahmedamin.deepthinkcodearts.com"
