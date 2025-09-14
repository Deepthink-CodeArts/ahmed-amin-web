#!/bin/bash

# Ahmed Amin Group - Frontend Deployment Script
# This script builds and prepares the frontend for VPS deployment

echo "🚀 Starting Ahmed Amin Group Frontend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Navigate to frontend directory
cd frontend

print_status "Installing dependencies..."
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

print_status "Building production version..."
if npm run build; then
    print_success "Production build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# Check if build was successful
if [ ! -d "dist" ]; then
    print_error "Build directory not found. Build may have failed."
    exit 1
fi

print_status "Build artifacts created:"
ls -la dist/

# Create deployment package
print_status "Creating deployment package..."
cd ..
tar -czf ahmed-amin-group-frontend-$(date +%Y%m%d-%H%M%S).tar.gz -C frontend dist/ package.json

print_success "Deployment package created: ahmed-amin-group-frontend-$(date +%Y%m%d-%H%M%S).tar.gz"

# Create PM2 ecosystem file
print_status "Creating PM2 ecosystem file..."
cat > frontend/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'ahmed-amin-group-frontend',
    script: 'npm',
    args: 'run preview',
    cwd: '/var/www/ahmed-amin-group/frontend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

print_success "PM2 ecosystem file created"

# Create production environment file
print_status "Creating production environment file..."
cat > frontend/.env.production << 'EOF'
VITE_API_URL=https://api.ahmedamin.deepthinkcodearts.com
VITE_APP_TITLE=Ahmed Amin Group
VITE_APP_DESCRIPTION=Better Future Together
VITE_APP_URL=https://ahmedamin.deepthinkcodearts.com
EOF

print_success "Production environment file created"

# Create Nginx configuration
print_status "Creating Nginx configuration..."
mkdir -p deployment/nginx
cat > deployment/nginx/ahmedamin.deepthinkcodearts.com << 'EOF'
server {
    listen 80;
    server_name ahmedamin.deepthinkcodearts.com;

    # Redirect all HTTP requests to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ahmedamin.deepthinkcodearts.com;

    # SSL Configuration (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/ahmedamin.deepthinkcodearts.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ahmedamin.deepthinkcodearts.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # Main location block
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
}
EOF

print_success "Nginx configuration created"

# Create deployment instructions
print_status "Creating deployment instructions..."
cat > deployment/DEPLOYMENT_INSTRUCTIONS.md << 'EOF'
# Quick Deployment Instructions

## 1. Upload Files to VPS
```bash
# Upload the deployment package to your VPS
scp ahmed-amin-group-frontend-*.tar.gz user@your-vps-ip:/var/www/
```

## 2. Extract and Setup
```bash
# On your VPS
cd /var/www
tar -xzf ahmed-amin-group-frontend-*.tar.gz
mv dist ahmed-amin-group-frontend
cd ahmed-amin-group-frontend
npm install
```

## 3. Configure Nginx
```bash
# Copy Nginx configuration
sudo cp nginx/ahmedamin.deepthinkcodearts.com /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/ahmedamin.deepthinkcodearts.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 4. Setup SSL
```bash
# Get SSL certificate
sudo certbot --nginx -d ahmedamin.deepthinkcodearts.com
```

## 5. Start Application
```bash
# Install PM2 if not already installed
sudo npm install -g pm2

# Start the application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 6. Verify Deployment
- Visit https://ahmedamin.deepthinkcodearts.com
- Check SSL certificate
- Test all pages and functionality
EOF

print_success "Deployment instructions created"

# Create a simple health check script
print_status "Creating health check script..."
cat > deployment/health-check.sh << 'EOF'
#!/bin/bash

# Health check script for Ahmed Amin Group Frontend

echo "🔍 Checking Ahmed Amin Group Frontend Health..."

# Check if PM2 process is running
if pm2 list | grep -q "ahmed-amin-group-frontend"; then
    echo "✅ PM2 process is running"
else
    echo "❌ PM2 process is not running"
    exit 1
fi

# Check if Nginx is running
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
else
    echo "❌ Nginx is not running"
    exit 1
fi

# Check if the site is accessible
if curl -s -o /dev/null -w "%{http_code}" https://ahmedamin.deepthinkcodearts.com | grep -q "200"; then
    echo "✅ Website is accessible"
else
    echo "❌ Website is not accessible"
    exit 1
fi

echo "🎉 All health checks passed!"
EOF

chmod +x deployment/health-check.sh
print_success "Health check script created"

print_success "🎉 Frontend deployment preparation completed!"
print_status "Next steps:"
echo "1. Upload the deployment package to your VPS"
echo "2. Follow the instructions in deployment/DEPLOYMENT_INSTRUCTIONS.md"
echo "3. Run the health check script after deployment"

print_warning "Don't forget to:"
echo "- Update DNS records to point ahmedamin.deepthinkcodearts.com to your VPS IP"
echo "- Configure firewall rules"
echo "- Set up monitoring and backups"

print_status "Deployment package: $(ls -la ahmed-amin-group-frontend-*.tar.gz | tail -1 | awk '{print $9}')"
