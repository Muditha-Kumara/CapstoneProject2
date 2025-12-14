# Donor Controller

## Overview
The `donor.controller.js` handles all donor-related operations including:
- Dashboard statistics
- Transaction history
- Delivery tracking
- Recipient feedback
- Donation processing (payment simulation)

## API Endpoints

### GET /donor/stats
Get donor dashboard statistics including total donated, meals funded, and average cost per meal.

**Authentication Required:** Yes (Bearer Token)  
**Authorization:** donor, admin

**Response:**
```json
{
  "totalDonated": 320.00,
  "mealsFunded": 128,
  "avgCostPerMeal": 2.50
}
```

### GET /donor/transactions
Get paginated transaction history for the authenticated donor.

**Authentication Required:** Yes (Bearer Token)  
**Authorization:** donor, admin  
**Query Parameters:**
- `limit` (optional): Number of records (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "transactions": [
    {
      "id": "uuid",
      "date": "2025-11-01T...",
      "amount": 50.00,
      "recipient": "NourishNet Platform",
      "status": "Completed",
      "type": "deposit"
    }
  ],
  "total": 100,
  "limit": 20,
  "offset": 0
}
```

### GET /donor/deliveries
Get delivered donations with tracking information.

**Authentication Required:** Yes (Bearer Token)  
**Authorization:** donor, admin  
**Query Parameters:**
- `limit` (optional): Number of records (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "deliveries": [
    {
      "donationId": "uuid",
      "orderId": "uuid",
      "foodType": "General Donation",
      "quantity": 20,
      "donatedAt": "2025-11-01T...",
      "deliveredAt": "2025-11-02T...",
      "address": "123 Main St",
      "gpsLocation": "lat,lng",
      "recipientName": "John Doe",
      "status": "fulfilled"
    }
  ],
  "total": 50,
  "limit": 20,
  "offset": 0
}
```

### GET /donor/feedback
Get feedback from recipients for the donor's contributions.

**Authentication Required:** Yes (Bearer Token)  
**Authorization:** donor, admin  
**Query Parameters:**
- `limit` (optional): Number of records (default: 10)

**Response:**
```json
{
  "feedback": [
    {
      "id": "uuid",
      "rating": 5,
      "message": "Thank you for the meal!",
      "recipientName": "Jane Smith",
      "orderId": "uuid",
      "createdAt": "2025-11-01T..."
    }
  ]
}
```

### GET /donor/balance
Get current account balance for the donor.

**Authentication Required:** Yes (Bearer Token)  
**Authorization:** donor, admin

**Response:**
```json
{
  "balance": 150.00
}
```

### POST /donor/donate
Process a donation payment (simulated).

**Authentication Required:** Yes (Bearer Token)  
**Authorization:** donor, admin  
**Rate Limit:** 5 requests per minute

**Request Body:**
```json
{
  "amount": 50.00,
  "paymentMethod": "card",
  "cardDetails": {
    "cardNumber": "4111111111111111",
    "cardholderName": "John Doe",
    "expiryMonth": 12,
    "expiryYear": 2025,
    "cvv": "123",
    "last4": "1111"
  }
}
```

**Validation Rules:**
- `amount`: Must be at least $1
- `paymentMethod`: Must be one of: 'card', 'paypal', 'bank_transfer'
- `cardDetails` (for card payments):
  - `cardNumber`: 13-19 digits
  - `cardholderName`: Required
  - `expiryMonth`: 1-12
  - `expiryYear`: Current year or later
  - `cvv`: 3-4 digits

**Response:**
```json
{
  "message": "Donation successful",
  "transaction": {
    "id": "uuid",
    "amount": 50.00,
    "description": "Donation via card - Transaction ID: TXN-...",
    "createdAt": "2025-11-01T..."
  },
  "paymentDetails": {
    "transactionId": "TXN-1234567890",
    "last4": "1111"
  }
}
```

## Payment Processing

The current implementation simulates payment processing. In production:

1. **Integrate Real Payment Gateway:**
   - Replace `simulatePaymentProcessing()` with Stripe, PayPal, or Square API
   - Store payment gateway transaction IDs
   - Implement webhooks for payment confirmation

2. **Security Enhancements:**
   - Never store full card numbers
   - Use PCI-compliant payment processing
   - Implement 3D Secure for card payments
   - Add fraud detection

3. **Transaction Management:**
   - Implement idempotency keys
   - Add transaction rollback on payment failure
   - Create audit logs for all financial operations

## Database Transactions

All financial operations use database transactions to ensure data consistency:
- Begin transaction
- Process payment
- Create transaction record
- Update user balance
- Create donation record
- Commit or rollback

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created (for donations)
- `400`: Bad request (validation errors)
- `401`: Unauthorized (no token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not found
- `500`: Internal server error

## Testing

To test the donor endpoints:

1. Register a donor account
2. Login to get access token
3. Use the token in Authorization header: `Bearer <token>`
4. Make requests to donor endpoints

Example using curl:
```bash
# Get stats
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://192.168.1.103:3001/donor/stats

# Process donation
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 50, "paymentMethod": "card", "cardDetails": {...}}' \
  https://192.168.1.103:3001/donor/donate
```
