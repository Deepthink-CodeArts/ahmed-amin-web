# Ahmed Amin Group - VPS Deployment Guide

## Frontend Deployment to Subdomain: ahmedamin.deepthinkcodearts.com

### Prerequisites
- VPS with Ubuntu/Debian
- Nginx installed
- Node.js 18+ installed
- PM2 process manager
- SSL certificate (Let's Encrypt)

### Step 1: Prepare the VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

### Step 2: Deploy the Frontend

```bash
# Create application directory
sudo mkdir -p /var/www/ahmed-amin-group
sudo chown -R $USER:$USER /var/www/ahmed-amin-group

# Clone your repository (or upload files)
cd /var/www/ahmed-amin-group
git clone <your-repo-url> .

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build the production version
npm run build

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
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

# Start the application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 3: Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/ahmedamin.deepthinkcodearts.com
```

Add the following configuration:

```nginx
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
```

### Step 4: Enable the Site and Get SSL Certificate

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/ahmedamin.deepthinkcodearts.com /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d ahmedamin.deepthinkcodearts.com

# Test SSL renewal
sudo certbot renew --dry-run
```

### Step 5: Configure Firewall

```bash
# Allow necessary ports
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

### Step 6: Set up Auto-Deployment (Optional)

Create a deployment script:

```bash
# Create deployment script
nano deploy.sh
```

Add the following content:

```bash
#!/bin/bash

# Ahmed Amin Group Frontend Deployment Script

echo "Starting deployment..."

# Navigate to project directory
cd /var/www/ahmed-amin-group

# Pull latest changes
git pull origin main

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Build the project
npm run build

# Restart PM2 process
pm2 restart ahmed-amin-group-frontend

echo "Deployment completed successfully!"
```

Make it executable:

```bash
chmod +x deploy.sh
```

### Step 7: Monitoring and Maintenance

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs ahmed-amin-group-frontend

# Monitor resources
pm2 monit

# Restart application
pm2 restart ahmed-amin-group-frontend

# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Step 8: Environment Configuration

Create environment file for production:

```bash
# Create production environment file
nano /var/www/ahmed-amin-group/frontend/.env.production
```

Add:

```env
VITE_API_URL=https://api.ahmedamin.deepthinkcodearts.com
VITE_APP_TITLE=Ahmed Amin Group
VITE_APP_DESCRIPTION=Better Future Together
```

### Step 9: Backup Strategy

```bash
# Create backup script
nano backup.sh
```

Add:

```bash
#!/bin/bash

# Create backup directory
BACKUP_DIR="/var/backups/ahmed-amin-group"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/frontend_$DATE.tar.gz -C /var/www/ahmed-amin-group frontend

# Backup Nginx configuration
cp /etc/nginx/sites-available/ahmedamin.deepthinkcodearts.com $BACKUP_DIR/nginx_config_$DATE.conf

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.conf" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/frontend_$DATE.tar.gz"
```

### Step 10: Performance Optimization

```bash
# Install additional tools for monitoring
sudo apt install htop iotop nethogs -y

# Configure log rotation
sudo nano /etc/logrotate.d/ahmed-amin-group
```

Add:

```
/var/log/ahmed-amin-group/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
```

## Verification Steps

1. **Check if the site is accessible:**
   ```bash
   curl -I https://ahmedamin.deepthinkcodearts.com
   ```

2. **Test SSL certificate:**
   ```bash
   openssl s_client -connect ahmedamin.deepthinkcodearts.com:443 -servername ahmedamin.deepthinkcodearts.com
   ```

3. **Check performance:**
   ```bash
   curl -w "@curl-format.txt" -o /dev/null -s https://ahmedamin.deepthinkcodearts.com
   ```

## Troubleshooting

### Common Issues:

1. **502 Bad Gateway:**
   - Check if PM2 process is running: `pm2 status`
   - Check application logs: `pm2 logs ahmed-amin-group-frontend`

2. **SSL Certificate Issues:**
   - Renew certificate: `sudo certbot renew`
   - Check certificate status: `sudo certbot certificates`

3. **Nginx Issues:**
   - Test configuration: `sudo nginx -t`
   - Reload Nginx: `sudo systemctl reload nginx`

4. **Performance Issues:**
   - Check system resources: `htop`
   - Monitor PM2: `pm2 monit`

## Security Checklist

- [ ] SSL certificate installed and auto-renewing
- [ ] Firewall configured properly
- [ ] Security headers added
- [ ] Regular backups scheduled
- [ ] PM2 process monitoring enabled
- [ ] Nginx access logs monitored
- [ ] System updates automated

## Maintenance Schedule

- **Daily:** Check PM2 status and logs
- **Weekly:** Review Nginx access logs
- **Monthly:** Update system packages
- **Quarterly:** Review and update SSL certificates
- **Annually:** Security audit and backup testing

---

**Note:** This deployment guide assumes you have root/sudo access to your VPS. Adjust paths and permissions as needed for your specific setup.
