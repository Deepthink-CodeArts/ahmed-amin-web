#!/usr/bin/env python3
"""
Setup script for uploads directory
Ensures proper permissions and directory structure for file uploads
"""

import os
import stat
from pathlib import Path

def setup_uploads_directory():
    """Setup uploads directory with proper permissions"""
    
    # Get the uploads directory path
    script_dir = Path(__file__).parent
    uploads_dir = script_dir / "uploads"
    
    print(f"Setting up uploads directory: {uploads_dir}")
    
    # Create uploads directory if it doesn't exist
    uploads_dir.mkdir(exist_ok=True, parents=True)
    
    # Set proper permissions (755 - owner can read/write/execute, others can read/execute)
    try:
        os.chmod(uploads_dir, stat.S_IRWXU | stat.S_IRGRP | stat.S_IXGRP | stat.S_IROTH | stat.S_IXOTH)
        print(f"✓ Set permissions on uploads directory: {oct(os.stat(uploads_dir).st_mode)[-3:]}")
    except Exception as e:
        print(f"⚠ Warning: Could not set directory permissions: {e}")
    
    # Create a .gitkeep file to ensure the directory is tracked
    gitkeep_file = uploads_dir / ".gitkeep"
    if not gitkeep_file.exists():
        gitkeep_file.touch()
        print("✓ Created .gitkeep file")
    
    # Create a test file to verify permissions
    test_file = uploads_dir / "test_permissions.txt"
    try:
        with open(test_file, 'w') as f:
            f.write("Test file for permissions verification\n")
        os.remove(test_file)
        print("✓ Write permissions verified")
    except Exception as e:
        print(f"✗ Write permissions test failed: {e}")
        return False
    
    print(f"✓ Uploads directory setup complete: {uploads_dir}")
    return True

def verify_environment():
    """Verify environment configuration"""
    print("\nEnvironment Verification:")
    
    # Check if we're in a virtual environment
    in_venv = hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix)
    print(f"Virtual Environment: {'✓' if in_venv else '✗'}")
    
    # Check Python version
    python_version = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    print(f"Python Version: {python_version}")
    
    # Check if required packages are available
    required_packages = ['fastapi', 'uvicorn', 'sqlalchemy', 'databases']
    for package in required_packages:
        try:
            __import__(package)
            print(f"✓ {package}")
        except ImportError:
            print(f"✗ {package} - not installed")
    
    return True

if __name__ == "__main__":
    import sys
    
    print("=" * 50)
    print("ARO Tours - Uploads Directory Setup")
    print("=" * 50)
    
    # Verify environment
    verify_environment()
    
    print("\n" + "=" * 50)
    
    # Setup uploads directory
    if setup_uploads_directory():
        print("\n🎉 Setup completed successfully!")
        print("\nNext steps:")
        print("1. Copy env.example to .env and configure your environment")
        print("2. Start the backend server: python -m uvicorn app.main:app --reload")
        print("3. Test file uploads in the CMS")
    else:
        print("\n❌ Setup failed. Please check the errors above.")
        sys.exit(1)
