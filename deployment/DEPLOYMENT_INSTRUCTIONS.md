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
