#!/bin/bash

# Ahmed Amin Group - Domain Setup Script
echo "🌐 Setting up ahmedamin.deepthinkcodearts.com domain..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

print_step "1. Installing required packages..."
apt update
apt install -y nginx certbot python3-certbot-nginx

print_step "2. Creating directories..."
mkdir -p ssl webroot

print_step "3. Setting up initial Nginx configuration..."
cat > /etc/nginx/sites-available/ahmedamin.deepthinkcodearts.com << 'EOF'
server {
    listen 80;
    server_name ahmedamin.deepthinkcodearts.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/ahmedamin.deepthinkcodearts.com /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

print_step "4. Obtaining SSL certificate..."
certbot certonly --webroot -w /var/www/certbot -d ahmedamin.deepthinkcodearts.com --email admin@deepthinkcodearts.com --agree-tos --no-eff-email

print_step "5. Setting up SSL renewal..."
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -

print_step "6. Creating production Nginx configuration..."
cat > /etc/nginx/sites-available/ahmedamin.deepthinkcodearts.com << 'EOF'
server {
    listen 80;
    server_name ahmedamin.deepthinkcodearts.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name ahmedamin.deepthinkcodearts.com;
    root /var/www/html;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/ahmedamin.deepthinkcodearts.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ahmedamin.deepthinkcodearts.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
EOF

print_step "7. Testing and reloading Nginx..."
nginx -t && systemctl reload nginx

print_status "✅ Domain setup completed!"
print_status "🌐 Your website will be available at: https://ahmedamin.deepthinkcodearts.com"
print_status "📋 Next steps:"
print_status "   1. Update DNS A record in Namecheap to point to your VPS IP"
print_status "   2. Wait for DNS propagation (5-30 minutes)"
print_status "   3. Deploy your frontend with: ./deploy-vps.sh"
