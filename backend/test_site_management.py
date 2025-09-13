#!/usr/bin/env python3
"""
Site Management API Test Script
Tests all endpoints for hero scenes, hero content, contact info, and service options.
"""

import requests
import json
import sys
from datetime import datetime

# API Configuration
API_BASE_URL = "http://localhost:8000/api/v1"
SITE_MGMT_BASE = f"{API_BASE_URL}/site-management"

# Test credentials (update these with valid admin credentials)
TEST_EMAIL = "admin@arotravels.com"
TEST_PASSWORD = "admin123"

class SiteManagementTester:
    def __init__(self):
        self.auth_token = None
        self.test_results = {
            "passed": 0,
            "failed": 0,
            "errors": []
        }
    
    def authenticate(self):
        """Authenticate and get auth token."""
        print("🔐 Authenticating...")
        
        try:
            response = requests.post(f"{API_BASE_URL}/auth/login", data={
                "username": TEST_EMAIL,
                "password": TEST_PASSWORD
            })
            
            if response.status_code == 200:
                data = response.json()
                self.auth_token = data.get("access_token")
                print("✅ Authentication successful!")
                return True
            else:
                print(f"❌ Authentication failed: {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Authentication error: {e}")
            return False
    
    def get_headers(self):
        """Get headers with auth token."""
        return {
            "Authorization": f"Bearer {self.auth_token}",
            "Content-Type": "application/json"
        }
    
    def test_endpoint(self, method, endpoint, data=None, expected_status=200, description=""):
        """Test a single endpoint."""
        url = f"{SITE_MGMT_BASE}{endpoint}"
        
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=self.get_headers())
            elif method.upper() == "POST":
                response = requests.post(url, headers=self.get_headers(), json=data)
            elif method.upper() == "PUT":
                response = requests.put(url, headers=self.get_headers(), json=data)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=self.get_headers())
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            if response.status_code == expected_status:
                print(f"✅ {description}: {method} {endpoint} - Status {response.status_code}")
                self.test_results["passed"] += 1
                return response.json() if response.content else {}
            else:
                print(f"❌ {description}: {method} {endpoint} - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text}")
                self.test_results["failed"] += 1
                self.test_results["errors"].append(f"{description}: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ {description}: {method} {endpoint} - Error: {e}")
            self.test_results["failed"] += 1
            self.test_results["errors"].append(f"{description}: {e}")
            return None
    
    def test_overview(self):
        """Test site management overview."""
        print("\n📊 Testing Site Management Overview...")
        self.test_endpoint("GET", "/overview", description="Get overview")
    
    def test_hero_scenes(self):
        """Test hero scenes CRUD operations."""
        print("\n🎨 Testing Hero Scenes...")
        
        # List hero scenes
        scenes = self.test_endpoint("GET", "/hero-scenes", description="List hero scenes")
        
        # Create a test scene
        test_scene = {
            "name": "Test City",
            "name_bn": "টেস্ট শহর",
            "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
            "gradient_class": "from-blue-500 to-purple-600",
            "order": 999,
            "is_active": True
        }
        
        created_scene = self.test_endpoint("POST", "/hero-scenes", data=test_scene, 
                                         expected_status=200, description="Create hero scene")
        
        if created_scene and "id" in created_scene:
            scene_id = created_scene["id"]
            
            # Get the created scene
            self.test_endpoint("GET", f"/hero-scenes/{scene_id}", description="Get hero scene by ID")
            
            # Update the scene
            update_data = {"name": "Updated Test City", "is_active": False}
            self.test_endpoint("PUT", f"/hero-scenes/{scene_id}", data=update_data,
                             description="Update hero scene")
            
            # Test reordering
            self.test_endpoint("POST", f"/hero-scenes/{scene_id}/reorder", 
                             data={"new_order": 1}, description="Reorder hero scene")
            
            # Delete the scene
            self.test_endpoint("DELETE", f"/hero-scenes/{scene_id}", 
                             description="Delete hero scene")
    
    def test_hero_content(self):
        """Test hero content CRUD operations."""
        print("\n📝 Testing Hero Content...")
        
        # List hero content
        self.test_endpoint("GET", "/hero-content", description="List hero content")
        
        # Try to get active hero content
        self.test_endpoint("GET", "/hero-content/active", description="Get active hero content")
        
        # Create test content
        test_content = {
            "headline_en": "Test Headline",
            "headline_bn": "টেস্ট শিরোনাম",
            "subtitle_en": "Test subtitle for the hero section",
            "subtitle_bn": "হিরো সেকশনের জন্য টেস্ট সাবটাইটেল",
            "cta_text_en": "Test CTA",
            "cta_text_bn": "টেস্ট সিটিএ",
            "cta_link": "#test",
            "is_active": False
        }
        
        created_content = self.test_endpoint("POST", "/hero-content", data=test_content,
                                           description="Create hero content")
        
        if created_content and "id" in created_content:
            content_id = created_content["id"]
            
            # Get the created content
            self.test_endpoint("GET", f"/hero-content/{content_id}", 
                             description="Get hero content by ID")
            
            # Update the content
            update_data = {"headline_en": "Updated Test Headline"}
            self.test_endpoint("PUT", f"/hero-content/{content_id}", data=update_data,
                             description="Update hero content")
            
            # Delete the content
            self.test_endpoint("DELETE", f"/hero-content/{content_id}",
                             description="Delete hero content")
    
    def test_contact_info(self):
        """Test contact info CRUD operations."""
        print("\n📞 Testing Contact Info...")
        
        # List contact info
        self.test_endpoint("GET", "/contact-info", description="List contact info")
        
        # Try to get active contact info
        self.test_endpoint("GET", "/contact-info/active", description="Get active contact info")
        
        # Create test contact info
        test_contact = {
            "company_name": "Test Travel Co",
            "company_name_bn": "টেস্ট ট্রাভেল কোম্পানি",
            "tagline_en": "Test tagline",
            "tagline_bn": "টেস্ট ট্যাগলাইন",
            "address_en": "123 Test Street, Test City",
            "address_bn": "১২৩ টেস্ট স্ট্রিট, টেস্ট শহর",
            "phone": "+1-234-567-8900",
            "email": "test@testtravel.com",
            "working_hours_en": "Test hours",
            "working_hours_bn": "টেস্ট সময়",
            "is_active": False
        }
        
        created_contact = self.test_endpoint("POST", "/contact-info", data=test_contact,
                                           description="Create contact info")
        
        if created_contact and "id" in created_contact:
            contact_id = created_contact["id"]
            
            # Get the created contact info
            self.test_endpoint("GET", f"/contact-info/{contact_id}",
                             description="Get contact info by ID")
            
            # Update the contact info
            update_data = {"company_name": "Updated Test Travel Co"}
            self.test_endpoint("PUT", f"/contact-info/{contact_id}", data=update_data,
                             description="Update contact info")
            
            # Delete the contact info
            self.test_endpoint("DELETE", f"/contact-info/{contact_id}",
                             description="Delete contact info")
    
    def test_service_options(self):
        """Test service options CRUD operations."""
        print("\n🛎️ Testing Service Options...")
        
        # List service options
        self.test_endpoint("GET", "/service-options", description="List service options")
        
        # Create test service option
        test_service = {
            "name_en": "Test Service",
            "name_bn": "টেস্ট সেবা",
            "description_en": "This is a test service",
            "description_bn": "এটি একটি টেস্ট সেবা",
            "icon": "TestIcon",
            "order": 999,
            "is_active": True
        }
        
        created_service = self.test_endpoint("POST", "/service-options", data=test_service,
                                           description="Create service option")
        
        if created_service and "id" in created_service:
            service_id = created_service["id"]
            
            # Get the created service
            self.test_endpoint("GET", f"/service-options/{service_id}",
                             description="Get service option by ID")
            
            # Update the service
            update_data = {"name_en": "Updated Test Service"}
            self.test_endpoint("PUT", f"/service-options/{service_id}", data=update_data,
                             description="Update service option")
            
            # Test reordering
            self.test_endpoint("POST", f"/service-options/{service_id}/reorder",
                             data={"new_order": 1}, description="Reorder service option")
            
            # Delete the service
            self.test_endpoint("DELETE", f"/service-options/{service_id}",
                             description="Delete service option")
    
    def run_all_tests(self):
        """Run all tests."""
        print("🚀 Starting Site Management API Tests...")
        print("=" * 60)
        
        if not self.authenticate():
            print("❌ Cannot proceed without authentication")
            return False
        
        # Run all test suites
        self.test_overview()
        self.test_hero_scenes()
        self.test_hero_content()
        self.test_contact_info()
        self.test_service_options()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📋 Test Summary")
        print("=" * 60)
        print(f"✅ Passed: {self.test_results['passed']}")
        print(f"❌ Failed: {self.test_results['failed']}")
        
        if self.test_results["errors"]:
            print("\n🔍 Errors:")
            for error in self.test_results["errors"]:
                print(f"   • {error}")
        
        success_rate = (self.test_results["passed"] / 
                       (self.test_results["passed"] + self.test_results["failed"])) * 100
        
        print(f"\n🎯 Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 90:
            print("🎉 Excellent! Site Management API is working great!")
        elif success_rate >= 70:
            print("👍 Good! Site Management API is mostly working.")
        else:
            print("⚠️ Site Management API needs attention.")
        
        return success_rate >= 70

def main():
    """Main function."""
    print("🌟 Site Management API Test Suite")
    print("=" * 60)
    print(f"🕒 Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 Testing API at: {API_BASE_URL}")
    print()
    
    tester = SiteManagementTester()
    success = tester.run_all_tests()
    
    print(f"\n🕒 Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main() 