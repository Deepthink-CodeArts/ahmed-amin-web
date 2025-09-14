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
