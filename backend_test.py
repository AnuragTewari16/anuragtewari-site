#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class PersonalWebsiteAPITester:
    def __init__(self, base_url="https://smart-work-money.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else self.api_url
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:500]}")

            result = {
                'test': name,
                'method': method,
                'endpoint': endpoint,
                'expected_status': expected_status,
                'actual_status': response.status_code,
                'success': success,
                'response_preview': response.text[:200]
            }
            self.results.append(result)
            
            return success, response.json() if success and response.content else {}

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Network Error: {str(e)}")
            result = {
                'test': name,
                'method': method,
                'endpoint': endpoint,
                'expected_status': expected_status,
                'actual_status': 'Network Error',
                'success': False,
                'error': str(e)
            }
            self.results.append(result)
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Unexpected Error: {str(e)}")
            result = {
                'test': name,
                'method': method,
                'endpoint': endpoint,
                'expected_status': expected_status,
                'actual_status': 'Unexpected Error',
                'success': False,
                'error': str(e)
            }
            self.results.append(result)
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_status_endpoints(self):
        """Test status check endpoints"""
        # Create status check
        test_data = {
            "client_name": f"test_client_{datetime.now().strftime('%H%M%S')}"
        }
        success, response = self.run_test(
            "Create Status Check", 
            "POST", 
            "status", 
            200, 
            data=test_data
        )
        
        if not success:
            return False

        # Get status checks
        success, _ = self.run_test("Get Status Checks", "GET", "status", 200)
        return success

    def test_newsletter_endpoints(self):
        """Test newsletter subscription endpoints"""
        # Subscribe to newsletter
        timestamp = datetime.now().strftime('%H%M%S')
        newsletter_data = {
            "name": f"Test User {timestamp}",
            "email": f"test{timestamp}@example.com"
        }
        success, response = self.run_test(
            "Newsletter Subscription", 
            "POST", 
            "newsletter", 
            200, 
            data=newsletter_data
        )
        
        if not success:
            return False

        # Test duplicate subscription
        success, _ = self.run_test(
            "Duplicate Newsletter Subscription", 
            "POST", 
            "newsletter", 
            200, 
            data=newsletter_data
        )
        
        # Get newsletter subscribers
        success, _ = self.run_test("Get Newsletter Subscribers", "GET", "newsletter/subscribers", 200)
        return success

    def test_contact_endpoints(self):
        """Test contact form endpoints"""
        # Submit contact form
        timestamp = datetime.now().strftime('%H%M%S')
        contact_data = {
            "name": f"Test Contact {timestamp}",
            "email": f"testcontact{timestamp}@example.com",
            "message": f"This is a test message sent at {timestamp}"
        }
        success, response = self.run_test(
            "Contact Form Submission", 
            "POST", 
            "contact", 
            200, 
            data=contact_data
        )
        
        if not success:
            return False

        # Get contact messages
        success, _ = self.run_test("Get Contact Messages", "GET", "contact/messages", 200)
        return success

    def test_insights_endpoints(self):
        """Test insights endpoints"""
        # Seed insights first
        success, _ = self.run_test("Seed Insights", "POST", "seed-insights", 200)
        
        # Get all insights
        success, all_insights = self.run_test("Get All Insights", "GET", "insights", 200)
        if not success or not all_insights:
            return False

        print(f"   Found {len(all_insights)} total insights")

        # Get AI insights
        success, ai_insights = self.run_test(
            "Get AI Insights", 
            "GET", 
            "insights", 
            200, 
            params={"category": "ai"}
        )
        if success and ai_insights:
            print(f"   Found {len(ai_insights)} AI insights")

        # Get investing insights
        success, investing_insights = self.run_test(
            "Get Investing Insights", 
            "GET", 
            "insights", 
            200, 
            params={"category": "investing"}
        )
        if success and investing_insights:
            print(f"   Found {len(investing_insights)} investing insights")

        # Test getting a specific insight
        if all_insights:
            first_insight = all_insights[0]
            insight_id = first_insight.get('id')
            if insight_id:
                success, _ = self.run_test(
                    f"Get Specific Insight ({insight_id})", 
                    "GET", 
                    f"insights/{insight_id}", 
                    200
                )

        # Test creating a new insight
        new_insight_data = {
            "title": f"Test Insight {datetime.now().strftime('%H%M%S')}",
            "summary": "This is a test insight created during API testing",
            "content": "This is the test content for the insight.",
            "category": "ai",
            "tags": ["test", "api"]
        }
        success, _ = self.run_test(
            "Create New Insight", 
            "POST", 
            "insights", 
            200, 
            data=new_insight_data
        )

        return True

    def test_404_handling(self):
        """Test 404 error handling"""
        success, _ = self.run_test(
            "Non-existent Insight", 
            "GET", 
            "insights/nonexistent-id", 
            404
        )
        return success

    def print_summary(self):
        """Print test summary"""
        print(f"\n{'='*60}")
        print(f"🧪 API TEST RESULTS SUMMARY")
        print(f"{'='*60}")
        print(f"Total Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%" if self.tests_run > 0 else "No tests run")
        
        if self.tests_passed < self.tests_run:
            print(f"\n❌ FAILED TESTS:")
            for result in self.results:
                if not result['success']:
                    print(f"   - {result['test']}: {result.get('error', f'Status {result[\"actual_status\"]}'')}")

        return self.tests_passed == self.tests_run

def main():
    """Main test execution"""
    print("🚀 Starting Anurag Tewari Personal Website API Tests")
    print(f"Testing against: https://smart-work-money.preview.emergentagent.com/api")
    
    tester = PersonalWebsiteAPITester()
    
    # Run all tests
    print(f"\n{'='*60}")
    print("🔍 RUNNING API TESTS")
    print(f"{'='*60}")
    
    # Basic connectivity
    if not tester.test_root_endpoint():
        print("❌ Root endpoint failed - stopping tests")
        return 1

    # Test all endpoints
    tester.test_status_endpoints()
    tester.test_newsletter_endpoints() 
    tester.test_contact_endpoints()
    tester.test_insights_endpoints()
    tester.test_404_handling()
    
    # Print results
    all_passed = tester.print_summary()
    
    # Return appropriate exit code
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())