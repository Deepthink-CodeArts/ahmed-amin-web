#!/bin/bash

# Debug 502 error
echo "🔍 Debugging 502 error..."

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

print_step "1. Checking container status..."
docker ps | grep ahmed-amin-frontend

print_step "2. Checking container logs..."
docker logs ahmed-amin-frontend

print_step "3. Testing container directly..."
curl -I http://localhost:8080

print_step "4. Checking Nginx error logs..."
tail -20 /var/log/nginx/error.log

print_step "5. Checking Nginx access logs..."
tail -20 /var/log/nginx/access.log

print_step "6. Testing Nginx configuration..."
nginx -t

print_step "7. Checking if port 8080 is listening..."
netstat -tuln | grep 8080

print_step "8. Testing proxy connection..."
curl -I http://localhost:8080/ | head -5
