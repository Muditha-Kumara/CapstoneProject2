#!/bin/bash
# Donor API Test Script
# This script tests all donor endpoints

BASE_URL="https://192.168.1.103:3001"
CONTENT_TYPE="Content-Type: application/json"

echo "=================================="
echo "Donor API Integration Test"
echo "=================================="
echo ""

# Step 1: Register a test donor
echo "1. Registering test donor..."
REGISTER_RESPONSE=$(curl -sk -X POST "$BASE_URL/auth/register" \
  -H "$CONTENT_TYPE" \
  -d '{
    "name": "Test Donor",
    "email": "donor_test_'$(date +%s)'@example.com",
    "password": "Password123!",
    "role": "donor"
  }')

echo "Registration Response: $REGISTER_RESPONSE"
echo ""

# Extract email from response
TEST_EMAIL=$(echo $REGISTER_RESPONSE | grep -oP '"email":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TEST_EMAIL" ]; then
  echo "❌ Failed to register donor"
  exit 1
fi

echo "✅ Donor registered: $TEST_EMAIL"
echo ""

# Step 2: Login
echo "2. Logging in..."
LOGIN_RESPONSE=$(curl -sk -X POST "$BASE_URL/auth/login" \
  -H "$CONTENT_TYPE" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"Password123!\"
  }")

echo "Login Response: $LOGIN_RESPONSE"
echo ""

# Extract access token
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -oP '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ Failed to login"
  exit 1
fi

echo "✅ Login successful"
echo "Access Token: ${ACCESS_TOKEN:0:20}..."
echo ""

# Step 3: Get Donor Stats
echo "3. Getting donor stats..."
STATS_RESPONSE=$(curl -sk -X GET "$BASE_URL/donor/stats" \
  -H "$CONTENT_TYPE" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Stats Response: $STATS_RESPONSE"
echo ""

if echo "$STATS_RESPONSE" | grep -q "totalDonated"; then
  echo "✅ Stats retrieved successfully"
else
  echo "❌ Failed to get stats"
fi
echo ""

# Step 4: Get Transaction History
echo "4. Getting transaction history..."
TRANSACTIONS_RESPONSE=$(curl -sk -X GET "$BASE_URL/donor/transactions?limit=10" \
  -H "$CONTENT_TYPE" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Transactions Response: $TRANSACTIONS_RESPONSE"
echo ""

if echo "$TRANSACTIONS_RESPONSE" | grep -q "transactions"; then
  echo "✅ Transactions retrieved successfully"
else
  echo "❌ Failed to get transactions"
fi
echo ""

# Step 5: Get Deliveries
echo "5. Getting deliveries..."
DELIVERIES_RESPONSE=$(curl -sk -X GET "$BASE_URL/donor/deliveries?limit=10" \
  -H "$CONTENT_TYPE" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Deliveries Response: $DELIVERIES_RESPONSE"
echo ""

if echo "$DELIVERIES_RESPONSE" | grep -q "deliveries"; then
  echo "✅ Deliveries retrieved successfully"
else
  echo "❌ Failed to get deliveries"
fi
echo ""

# Step 6: Get Feedback
echo "6. Getting feedback..."
FEEDBACK_RESPONSE=$(curl -sk -X GET "$BASE_URL/donor/feedback?limit=5" \
  -H "$CONTENT_TYPE" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Feedback Response: $FEEDBACK_RESPONSE"
echo ""

if echo "$FEEDBACK_RESPONSE" | grep -q "feedback"; then
  echo "✅ Feedback retrieved successfully"
else
  echo "❌ Failed to get feedback"
fi
echo ""

# Step 7: Get Balance
echo "7. Getting balance..."
BALANCE_RESPONSE=$(curl -sk -X GET "$BASE_URL/donor/balance" \
  -H "$CONTENT_TYPE" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Balance Response: $BALANCE_RESPONSE"
echo ""

if echo "$BALANCE_RESPONSE" | grep -q "balance"; then
  echo "✅ Balance retrieved successfully"
else
  echo "❌ Failed to get balance"
fi
echo ""

# Step 8: Process Donation
echo "8. Processing donation..."
DONATION_RESPONSE=$(curl -sk -X POST "$BASE_URL/donor/donate" \
  -H "$CONTENT_TYPE" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "amount": 50.00,
    "paymentMethod": "card",
    "cardDetails": {
      "cardNumber": "4111111111111111",
      "cardholderName": "Test Donor",
      "expiryMonth": 12,
      "expiryYear": 2025,
      "cvv": "123",
      "last4": "1111"
    }
  }')

echo "Donation Response: $DONATION_RESPONSE"
echo ""

if echo "$DONATION_RESPONSE" | grep -q "Donation successful"; then
  echo "✅ Donation processed successfully"
else
  echo "❌ Failed to process donation"
fi
echo ""

# Step 9: Verify Updated Stats
echo "9. Verifying updated stats..."
UPDATED_STATS=$(curl -sk -X GET "$BASE_URL/donor/stats" \
  -H "$CONTENT_TYPE" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Updated Stats: $UPDATED_STATS"
echo ""

TOTAL_DONATED=$(echo $UPDATED_STATS | grep -oP '"totalDonated":\s*\K[0-9.]+')

if [ -n "$TOTAL_DONATED" ] && [ $(echo "$TOTAL_DONATED > 0" | bc) -eq 1 ]; then
  echo "✅ Stats updated correctly (Total Donated: \$$TOTAL_DONATED)"
else
  echo "⚠️ Stats might not be updated yet"
fi
echo ""

echo "=================================="
echo "Test Complete!"
echo "=================================="
