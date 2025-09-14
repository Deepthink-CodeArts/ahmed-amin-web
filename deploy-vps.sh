#!/bin/bash

# Ahmed Amin Group - VPS Deployment Script
echo "🚀 Starting Ahmed Amin Group Frontend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install it first."
    exit 1
fi

print_status "Docker and Docker Compose are available."

# Stop and remove existing containers
print_status "Stopping existing containers..."
docker-compose down

# Remove old images (optional)
print_warning "Removing old images..."
docker image prune -f

# Build and start the application
print_status "Building and starting the application..."
docker-compose up --build -d

# Check if the container is running
if docker ps | grep -q "ahmed-amin-frontend"; then
    print_status "✅ Frontend is running successfully!"
    print_status "🌐 Your website is available at: http://your-vps-ip"
    print_status "📊 Container status:"
    docker ps | grep ahmed-amin-frontend
else
    print_error "❌ Failed to start the frontend container."
    print_error "Check logs with: docker-compose logs"
    exit 1
fi

print_status "🎉 Deployment completed successfully!"
print_status "To view logs: docker-compose logs -f"
print_status "To stop: docker-compose down"
