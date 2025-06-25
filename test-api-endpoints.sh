#!/bin/bash

# =====================================================
# API ENDPOINT TESTING SCRIPT
# File: test-api-endpoints.sh
# =====================================================

# Configuration
BASE_URL="http://localhost:3000"
AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcGlkYWR2ZGVlbGx2cXhxdWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MzczNDksImV4cCI6MjA2MjIxMzM0OX0.oLynlxCyaQVKNLEKCw9C_ljsLmE3U5LO-jfIIqkqWOw"

# Colours for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Colour

# Helper functions
print_header() {
    echo -e "\n${BLUE}=====================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}=====================================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Test function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    local auth_required=$5
    
    echo -e "${BLUE}Testing: $description${NC}"
    echo -e "Endpoint: $method $BASE_URL$endpoint"
    
    if [ "$auth_required" = "false" ]; then
        # Test without authentication
        if [ "$method" = "GET" ]; then
            response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL$endpoint" \
                -H "Content-Type: application/json")
        elif [ "$method" = "POST" ]; then
            response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint" \
                -H "Content-Type: application/json" \
                -d "$data")
        fi
    else
        # Test with authentication
        if [ "$method" = "GET" ]; then
            response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL$endpoint" \
                -H "Authorization: Bearer $AUTH_TOKEN" \
                -H "Content-Type: application/json")
        elif [ "$method" = "POST" ]; then
            response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint" \
                -H "Authorization: Bearer $AUTH_TOKEN" \
                -H "Content-Type: application/json" \
                -d "$data")
        elif [ "$method" = "PUT" ]; then
            response=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL$endpoint" \
                -H "Authorization: Bearer $AUTH_TOKEN" \
                -H "Content-Type: application/json" \
                -d "$data")
        elif [ "$method" = "DELETE" ]; then
            response=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL$endpoint" \
                -H "Authorization: Bearer $AUTH_TOKEN" \
                -H "Content-Type: application/json")
        fi
    fi
    
    # Extract status code (last line)
    status_code=$(echo "$response" | tail -n1)
    # Extract response body (all lines except last)
    response_body=$(echo "$response" | head -n -1)
    
    echo -e "Status Code: $status_code"
    echo -e "Response: $response_body"
    
    if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
        print_success "Test passed"
    else
        print_error "Test failed"
    fi
    
    echo ""
}

# Wait for server to start
print_header "Starting API Tests"
print_warning "Make sure your Next.js development server is running on http://localhost:3000"
print_warning "Using Supabase anon key from .env.local"
echo ""

# Test 0: Basic API Test (No Auth Required)
print_header "0. Testing Basic API Endpoint"
test_endpoint "GET" "/api/test" "" "Basic API test (no auth required)" "false"

# Test 0.5: Authentication Test
print_header "0.5. Testing Authentication"
test_endpoint "GET" "/api/test-auth" "" "Authentication test" "true"

# Test 1: Test Dashboard Statistics (No Auth Required)
print_header "1. Testing Dashboard Statistics (Test Endpoint)"
test_endpoint "GET" "/api/test-dashboard-stats" "" "Get dashboard statistics (test endpoint)" "false"

# Test 2: Test Organisations (No Auth Required)
print_header "2. Testing Organisations (Test Endpoint)"
test_endpoint "GET" "/api/test-organisations" "" "Get all organisations (test endpoint)" "false"

# Test 3: Test Properties (No Auth Required)
print_header "3. Testing Properties (Test Endpoint)"
test_endpoint "GET" "/api/test-properties" "" "Get all properties (test endpoint)" "false"

# Test 4: Dashboard Statistics (Authenticated)
print_header "4. Testing Dashboard Statistics (Authenticated)"
test_endpoint "GET" "/api/dashboard/stats" "" "Get dashboard statistics" "true"

# Test 5: Organisations
print_header "5. Testing Organisations Endpoint"
test_endpoint "GET" "/api/organisations" "" "Get all organisations" "true"

# Test 6: Properties
print_header "6. Testing Properties Endpoint"
test_endpoint "GET" "/api/properties" "" "Get all properties" "true"

# Test 7: Electrical Reports
print_header "7. Testing Electrical Reports Endpoint"
test_endpoint "GET" "/api/electrical-reports" "" "Get all electrical reports" "true"

# Test 8: Drainage Reports
print_header "8. Testing Drainage Reports Endpoint"
test_endpoint "GET" "/api/drainage-reports" "" "Get all drainage reports" "true"

# Test 9: Documents
print_header "9. Testing Documents Endpoint"
test_endpoint "GET" "/api/documents" "" "Get all documents" "true"

# Test 10: Risk Assessments
print_header "10. Testing Risk Assessments Endpoint"
test_endpoint "GET" "/api/risk-assessments" "" "Get all risk assessments" "true"

# Test 11: Filtered Properties (by organisation)
print_header "11. Testing Filtered Properties"
test_endpoint "GET" "/api/properties?organisation_id=test-org-id" "" "Get properties by organisation" "true"

# Test 12: Filtered Documents (by category)
print_header "12. Testing Filtered Documents"
test_endpoint "GET" "/api/documents?category=certificates" "" "Get documents by category" "true"

# Test 13: Expiring Documents
print_header "13. Testing Expiring Documents"
test_endpoint "GET" "/api/documents?expiring_in_days=30" "" "Get documents expiring in 30 days" "true"

# Test 14: Filtered Electrical Reports
print_header "14. Testing Filtered Electrical Reports"
test_endpoint "GET" "/api/electrical-reports?inspection_type=periodic" "" "Get periodic electrical reports" "true"

# Test 15: Filtered Risk Assessments
print_header "15. Testing Filtered Risk Assessments"
test_endpoint "GET" "/api/risk-assessments?assessment_type=fire_safety" "" "Get fire safety assessments" "true"

print_header "API Testing Complete"
print_success "All endpoint tests completed!"
print_warning "Note: POST/PUT/DELETE tests require valid data and proper authentication"
print_warning "Update the script with actual organisation IDs and property IDs for full testing"
print_warning "If you see 401 errors, you need to create a user account and sign in first"
print_warning "Test endpoints (0-3) should work without authentication" 