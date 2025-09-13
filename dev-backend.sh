#!/bin/bash

# Start backend development server
echo "🚀 Starting DeepBase Backend Development Server"
echo "============================================="

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Check if dependencies are installed
if [ ! -f "venv/pyvenv.cfg" ] || [ ! -d "venv/lib" ]; then
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
fi

# Check if database is set up
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Please copy env.example to .env and configure your database settings."
    echo "📋 Example: cp env.example .env"
    exit 1
fi

echo "🗄️ Starting FastAPI development server..."
echo "Backend API will be available at: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo "Admin API: http://localhost:8000/api"
echo ""
echo "Press Ctrl+C to stop the server"

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
