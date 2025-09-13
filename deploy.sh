#!/bin/bash

# DeepBase Deployment Script
# This script handles both local development and VPS production deployment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="DeepBase"
DOCKER_COMPOSE_FILE="docker-compose.yml"
DOCKER_COMPOSE_PROD_FILE="docker-compose.prod.yml"
ENV_FILE=".env"

# Functions
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

check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are available"
}

check_project_config() {
    if [ ! -f "project.config.json" ]; then
        print_warning "project.config.json not found. Creating default configuration..."
        cat > project.config.json << EOF
{
  "project_name": "DeepBase",
  "project_display_name": "DeepBase CMS",
  "project_description": "Rapid website development platform",
  "project_domain": "localhost",
  "admin_email": "admin@localhost",
  "admin_password": "admin123",
  "database_name": "deepbase_cms_db",
  "database_user": "deepbase_user",
  "database_password": "deepbase_password",
  "company_name": "DeepBase",
  "company_name_bn": "ডিপবেস",
  "tagline": "Rapid Website Development Platform",
  "tagline_bn": "দ্রুত ওয়েবসাইট উন্নয়ন প্ল্যাটফর্ম",
  "default_theme": {
    "primary_color": "#8b5cf6",
    "secondary_color": "#06b6d4"
  },
  "features": {
    "hero_scenes": false,
    "hero_content": true,
    "contact_info": true,
    "service_options": false,
    "blog_posts": true,
    "staff_management": true
  }
}
EOF
        print_success "Default project.config.json created"
    fi
}

setup_environment() {
    if [ ! -f "$ENV_FILE" ]; then
        print_warning "Environment file not found. Creating from example..."
        if [ -f "backend/env.example" ]; then
            cp backend/env.example "$ENV_FILE"
            print_success "Environment file created from example"
        else
            print_error "No environment example file found"
            exit 1
        fi
    fi
}

create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p logs/nginx
    mkdir -p backups
    mkdir -p nginx/ssl
    print_success "Directories created"
}

build_images() {
    print_status "Building Docker images..."
    docker-compose build --no-cache
    print_success "Docker images built successfully"
}

start_services() {
    local mode=$1
    print_status "Starting services in $mode mode..."
    
    if [ "$mode" = "production" ]; then
        docker-compose -f $DOCKER_COMPOSE_FILE -f $DOCKER_COMPOSE_PROD_FILE up -d
    else
        docker-compose up -d
    fi
    
    print_success "Services started successfully"
}

wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for database
    print_status "Waiting for database..."
    timeout=60
    while ! docker-compose exec postgres pg_isready -U ${POSTGRES_USER:-deepbase_user} -d ${POSTGRES_DB:-deepbase_cms_db} &> /dev/null; do
        sleep 2
        timeout=$((timeout - 2))
        if [ $timeout -le 0 ]; then
            print_error "Database failed to start within 60 seconds"
            exit 1
        fi
    done
    print_success "Database is ready"
    
    # Wait for backend
    print_status "Waiting for backend..."
    timeout=60
    while ! curl -f http://localhost:8000/health &> /dev/null; do
        sleep 2
        timeout=$((timeout - 2))
        if [ $timeout -le 0 ]; then
            print_error "Backend failed to start within 60 seconds"
            exit 1
        fi
    done
    print_success "Backend is ready"
    
    # Wait for frontend
    print_status "Waiting for frontend..."
    timeout=60
    while ! curl -f http://localhost:3000 &> /dev/null; do
        sleep 2
        timeout=$((timeout - 2))
        if [ $timeout -le 0 ]; then
            print_error "Frontend failed to start within 60 seconds"
            exit 1
        fi
    done
    print_success "Frontend is ready"
}

initialize_database() {
    print_status "Initializing database..."
    docker-compose exec backend python init_db.py
    print_success "Database initialized"
}

show_status() {
    print_status "Service Status:"
    docker-compose ps
    
    echo ""
    print_status "Access URLs:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:8000"
    echo "  Admin Panel: http://localhost:3000/cms"
    echo "  API Docs: http://localhost:8000/docs"
}

cleanup() {
    print_status "Cleaning up..."
    docker-compose down -v
    print_success "Cleanup completed"
}

show_help() {
    echo "DeepBase Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev         Start development environment"
    echo "  prod        Start production environment"
    echo "  stop        Stop all services"
    echo "  restart     Restart all services"
    echo "  logs        Show logs"
    echo "  status      Show service status"
    echo "  cleanup     Stop and remove all containers and volumes"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev      # Start development environment"
    echo "  $0 prod     # Start production environment"
    echo "  $0 logs     # Show logs from all services"
}

# Main script
case "${1:-dev}" in
    "dev")
        print_status "Starting DeepBase in development mode..."
        check_docker
        check_project_config
        setup_environment
        create_directories
        build_images
        start_services "development"
        wait_for_services
        initialize_database
        show_status
        print_success "Development environment is ready!"
        ;;
    "prod")
        print_status "Starting DeepBase in production mode..."
        check_docker
        check_project_config
        setup_environment
        create_directories
        build_images
        start_services "production"
        wait_for_services
        initialize_database
        show_status
        print_success "Production environment is ready!"
        ;;
    "stop")
        print_status "Stopping all services..."
        docker-compose down
        print_success "All services stopped"
        ;;
    "restart")
        print_status "Restarting all services..."
        docker-compose restart
        print_success "All services restarted"
        ;;
    "logs")
        docker-compose logs -f
        ;;
    "status")
        show_status
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac