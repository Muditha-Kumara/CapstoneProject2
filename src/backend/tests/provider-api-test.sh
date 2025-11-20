#!/bin/bash

# Provider API Test Script
# This script tests all provider endpoints

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="https://192.168.1.103:3001"

# Global variables
TOKEN=""
PROVIDER_ID=""
REQUEST_ID=""
ORDER_ID=""

# Function to print section headers
print_header() {
    echo -e "\n${YELLOW}========================================${NC}"
    echo -e "${YELLOW}$1${NC}"
    echo -e "${YELLOW}========================================${NC}\n"
}

# Function to print success messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error messages
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to extract JSON field value
extract_json() {
    echo "$1" | grep -o "\"$2\"[^,}]*" | grep -o '[^"]*$'
}

print_header "Provider API Test Suite"

# Test 1: Register Provider
print_header "Test 1: Register Provider"
REGISTER_RESPONSE=$(curl -sk -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Provider",
    "email": "provider_test_'$(date +%s)'@test.com",
    "password": "Password123!",
    "role": "provider"
  }')

if echo "$REGISTER_RESPONSE" | grep -q "User registered successfully"; then
    print_success "Provider registered successfully"
    PROVIDER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    PROVIDER_EMAIL=$(echo "$REGISTER_RESPONSE" | grep -o '"email":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "Provider ID: $PROVIDER_ID"
    echo "Provider Email: $PROVIDER_EMAIL"
else
    print_error "Failed to register provider"
    echo "Response: $REGISTER_RESPONSE"
    exit 1
fi

# Test 2: Login
print_header "Test 2: Login as Provider"
LOGIN_RESPONSE=$(curl -sk -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$PROVIDER_EMAIL'",
    "password": "Password123!"
  }')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    print_success "Login successful"
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "Token: ${TOKEN:0:50}..."
else
    print_error "Login failed"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

# Test 3: Get Provider Stats (Initial)
print_header "Test 3: Get Provider Stats (Initial)"
STATS_RESPONSE=$(curl -sk -X GET "$BASE_URL/provider/stats" \
  -H "Authorization: Bearer $TOKEN")

if echo "$STATS_RESPONSE" | grep -q "stats"; then
    print_success "Stats retrieved successfully"
    echo "$STATS_RESPONSE" | jq '.' 2>/dev/null || echo "$STATS_RESPONSE"
else
    print_error "Failed to get stats"
    echo "Response: $STATS_RESPONSE"
fi

# Test 4: Get Available Requests (Should be empty or show existing)
print_header "Test 4: Get Available Requests"
REQUESTS_RESPONSE=$(curl -sk -X GET "$BASE_URL/provider/requests?limit=10&offset=0" \
  -H "Authorization: Bearer $TOKEN")

if echo "$REQUESTS_RESPONSE" | grep -q "requests"; then
    print_success "Available requests retrieved successfully"
    echo "$REQUESTS_RESPONSE" | jq '.' 2>/dev/null || echo "$REQUESTS_RESPONSE"
    
    # Try to extract a request ID for testing
    REQUEST_ID=$(echo "$REQUESTS_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    if [ -n "$REQUEST_ID" ] && [ "$REQUEST_ID" != "" ]; then
        echo "Found Request ID: $REQUEST_ID"
    else
        echo "No pending requests found. Creating one..."
    fi
else
    print_error "Failed to get available requests"
    echo "Response: $REQUESTS_RESPONSE"
fi

# Test 5: Create a Request (as requester) if none exist
if [ -z "$REQUEST_ID" ] || [ "$REQUEST_ID" == "" ]; then
    print_header "Test 5: Create Sample Request (as requester)"
    
    # Register requester
    REQUESTER_REGISTER=$(curl -sk -X POST "$BASE_URL/auth/register" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Test Requester",
        "email": "requester_test_'$(date +%s)'@test.com",
        "password": "Password123!",
        "role": "recipient"
      }')
    
    if echo "$REQUESTER_REGISTER" | grep -q "User registered successfully"; then
        print_success "Requester registered"
        REQUESTER_EMAIL=$(echo "$REQUESTER_REGISTER" | grep -o '"email":"[^"]*"' | head -1 | cut -d'"' -f4)
        
        # Login as requester
        REQUESTER_LOGIN=$(curl -sk -X POST "$BASE_URL/auth/login" \
          -H "Content-Type: application/json" \
          -d '{
            "email": "'$REQUESTER_EMAIL'",
            "password": "Password123!"
          }')
        
        REQUESTER_TOKEN=$(echo "$REQUESTER_LOGIN" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        
        # Create request
        CREATE_REQUEST=$(curl -sk -X POST "$BASE_URL/requests" \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer $REQUESTER_TOKEN" \
          -d '{
            "meal_type": "dinner",
            "location": "123 Test Street, Test City",
            "time": "'$(date -u -d '+2 hours' +%Y-%m-%dT%H:%M:%S)'Z",
            "special_dietary_needs": "None"
          }')
        
        if echo "$CREATE_REQUEST" | grep -q "success"; then
            print_success "Sample request created"
            REQUEST_ID=$(echo "$CREATE_REQUEST" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
            echo "Request ID: $REQUEST_ID"
        else
            print_error "Failed to create request"
            echo "Response: $CREATE_REQUEST"
        fi
    fi
fi

# Test 6: Accept Request
if [ -n "$REQUEST_ID" ] && [ "$REQUEST_ID" != "" ]; then
    print_header "Test 6: Accept Request"
    ACCEPT_RESPONSE=$(curl -sk -X POST "$BASE_URL/provider/accept" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "requestId": "'$REQUEST_ID'",
        "estimatedTime": "30 minutes"
      }')
    
    if echo "$ACCEPT_RESPONSE" | grep -q "success"; then
        print_success "Request accepted successfully"
        echo "$ACCEPT_RESPONSE" | jq '.' 2>/dev/null || echo "$ACCEPT_RESPONSE"
        ORDER_ID=$(echo "$ACCEPT_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
        echo "Order ID: $ORDER_ID"
    else
        print_error "Failed to accept request"
        echo "Response: $ACCEPT_RESPONSE"
    fi
else
    print_error "No request ID available to accept"
fi

# Test 7: Get Provider Orders
print_header "Test 7: Get Provider Orders"
ORDERS_RESPONSE=$(curl -sk -X GET "$BASE_URL/provider/orders?limit=10&offset=0" \
  -H "Authorization: Bearer $TOKEN")

if echo "$ORDERS_RESPONSE" | grep -q "orders"; then
    print_success "Provider orders retrieved successfully"
    echo "$ORDERS_RESPONSE" | jq '.' 2>/dev/null || echo "$ORDERS_RESPONSE"
else
    print_error "Failed to get provider orders"
    echo "Response: $ORDERS_RESPONSE"
fi

# Test 8: Update Order Status to Preparing
if [ -n "$ORDER_ID" ] && [ "$ORDER_ID" != "" ]; then
    print_header "Test 8: Update Order Status to Preparing"
    UPDATE_STATUS_RESPONSE=$(curl -sk -X PUT "$BASE_URL/provider/order/status" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "orderId": "'$ORDER_ID'",
        "status": "preparing",
        "photoUrl": "https://example.com/preparing-food.jpg"
      }')
    
    if echo "$UPDATE_STATUS_RESPONSE" | grep -q "success"; then
        print_success "Order status updated to preparing"
        echo "$UPDATE_STATUS_RESPONSE" | jq '.' 2>/dev/null || echo "$UPDATE_STATUS_RESPONSE"
    else
        print_error "Failed to update order status"
        echo "Response: $UPDATE_STATUS_RESPONSE"
    fi
    
    # Test 9: Update Order Status to Ready
    print_header "Test 9: Update Order Status to Ready"
    UPDATE_READY_RESPONSE=$(curl -sk -X PUT "$BASE_URL/provider/order/status" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "orderId": "'$ORDER_ID'",
        "status": "ready",
        "photoUrl": "https://example.com/ready-food.jpg"
      }')
    
    if echo "$UPDATE_READY_RESPONSE" | grep -q "success"; then
        print_success "Order status updated to ready"
        echo "$UPDATE_READY_RESPONSE" | jq '.' 2>/dev/null || echo "$UPDATE_READY_RESPONSE"
    else
        print_error "Failed to update order status to ready"
        echo "Response: $UPDATE_READY_RESPONSE"
    fi
    
    # Test 10: Update Order Status to Fulfilled
    print_header "Test 10: Update Order Status to Fulfilled"
    UPDATE_FULFILLED_RESPONSE=$(curl -sk -X PUT "$BASE_URL/provider/order/status" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "orderId": "'$ORDER_ID'",
        "status": "fulfilled",
        "photoUrl": "https://example.com/completed-meal.jpg"
      }')
    
    if echo "$UPDATE_FULFILLED_RESPONSE" | grep -q "success"; then
        print_success "Order status updated to fulfilled"
        echo "$UPDATE_FULFILLED_RESPONSE" | jq '.' 2>/dev/null || echo "$UPDATE_FULFILLED_RESPONSE"
    else
        print_error "Failed to update order status to fulfilled"
        echo "Response: $UPDATE_FULFILLED_RESPONSE"
    fi
else
    print_error "No order ID available for status updates"
fi

# Test 11: Get Provider Stats (Final)
print_header "Test 11: Get Provider Stats (Final)"
FINAL_STATS_RESPONSE=$(curl -sk -X GET "$BASE_URL/provider/stats" \
  -H "Authorization: Bearer $TOKEN")

if echo "$FINAL_STATS_RESPONSE" | grep -q "stats"; then
    print_success "Final stats retrieved successfully"
    echo "$FINAL_STATS_RESPONSE" | jq '.' 2>/dev/null || echo "$FINAL_STATS_RESPONSE"
else
    print_error "Failed to get final stats"
    echo "Response: $FINAL_STATS_RESPONSE"
fi

# Test 12: Test Cancel Order (Create another order first)
print_header "Test 12: Test Cancel Order"
if [ -n "$REQUEST_ID" ] && [ "$REQUEST_ID" != "" ]; then
    # Get another request ID or create one
    NEW_REQUESTS_RESPONSE=$(curl -sk -X GET "$BASE_URL/provider/requests?limit=1&offset=0" \
      -H "Authorization: Bearer $TOKEN")
    
    NEW_REQUEST_ID=$(echo "$NEW_REQUESTS_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    if [ -n "$NEW_REQUEST_ID" ] && [ "$NEW_REQUEST_ID" != "" ]; then
        # Accept new request
        ACCEPT_NEW_RESPONSE=$(curl -sk -X POST "$BASE_URL/provider/accept" \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer $TOKEN" \
          -d '{
            "requestId": "'$NEW_REQUEST_ID'",
            "estimatedTime": "45 minutes"
          }')
        
        NEW_ORDER_ID=$(echo "$ACCEPT_NEW_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
        
        if [ -n "$NEW_ORDER_ID" ] && [ "$NEW_ORDER_ID" != "" ]; then
            # Cancel the order
            CANCEL_RESPONSE=$(curl -sk -X POST "$BASE_URL/provider/order/cancel" \
              -H "Content-Type: application/json" \
              -H "Authorization: Bearer $TOKEN" \
              -d '{
                "orderId": "'$NEW_ORDER_ID'",
                "reason": "Test cancellation - Unable to prepare"
              }')
            
            if echo "$CANCEL_RESPONSE" | grep -q "success"; then
                print_success "Order cancelled successfully"
                echo "$CANCEL_RESPONSE" | jq '.' 2>/dev/null || echo "$CANCEL_RESPONSE"
            else
                print_error "Failed to cancel order"
                echo "Response: $CANCEL_RESPONSE"
            fi
        else
            echo "No new order to cancel"
        fi
    else
        echo "No available requests to test cancellation"
    fi
else
    echo "Skipping cancel test - no requests available"
fi

# Test 13: Test Error Handling - Invalid Order ID
print_header "Test 13: Test Error Handling - Invalid Order ID"
ERROR_RESPONSE=$(curl -sk -X PUT "$BASE_URL/provider/order/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "orderId": "00000000-0000-0000-0000-000000000000",
    "status": "preparing"
  }')

if echo "$ERROR_RESPONSE" | grep -q "error"; then
    print_success "Error handling works correctly"
    echo "$ERROR_RESPONSE" | jq '.' 2>/dev/null || echo "$ERROR_RESPONSE"
else
    print_error "Error handling not working as expected"
    echo "Response: $ERROR_RESPONSE"
fi

# Test 14: Test Unauthorized Access (without token)
print_header "Test 14: Test Unauthorized Access"
UNAUTH_RESPONSE=$(curl -sk -X GET "$BASE_URL/provider/stats")

if echo "$UNAUTH_RESPONSE" | grep -q "Unauthorized"; then
    print_success "Unauthorized access blocked correctly"
else
    print_error "Unauthorized access not blocked"
    echo "Response: $UNAUTH_RESPONSE"
fi

# Final Summary
print_header "Test Summary"
echo "All tests completed!"
echo "Provider Email: $PROVIDER_EMAIL"
echo "Provider ID: $PROVIDER_ID"
echo "Test Request ID: $REQUEST_ID"
echo "Test Order ID: $ORDER_ID"
echo ""
echo "Check the responses above for detailed results."
