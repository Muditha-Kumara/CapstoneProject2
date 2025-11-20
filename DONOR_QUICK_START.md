# Quick Start Guide - Donor Feature

## Prerequisites
- Docker and Docker Compose installed
- Backend and frontend containers running
- Database migrations applied

## Start the Application

### 1. Start Docker Containers
```bash
cd /home/muditha/CapstoneProject2
docker-compose up -d
```

### 2. Verify Services are Running
```bash
docker-compose ps
```

You should see:
- `nourishnet-db` (PostgreSQL)
- `nourishnet-backend` (Node.js API)
- `nourishnet-frontend` (React/Vite)

### 3. Check Backend Logs
```bash
docker-compose logs -f backend
```

Look for: `HTTPS server running on https://192.168.1.103:3001`

### 4. Check Frontend Logs
```bash
docker-compose logs -f frontend
```

Look for: `Local: https://192.168.1.103:3000`

## Testing the Donor Feature

### Option 1: Use the Frontend UI

1. **Open the Application**
   ```
   https://192.168.1.103:3000
   ```

2. **Register a Donor Account**
   - Click "Sign Up" or navigate to registration
   - Fill in details:
     - Name: Test Donor
     - Email: donor@test.com
     - Password: Password123!
     - Role: Donor

3. **Login**
   - Use the credentials above
   - You'll be redirected to the Donor Dashboard

4. **Explore the Dashboard**
   - View your stats (initially zeros)
   - Click "Donate Again" button
   - Fill out the payment form:
     - Amount: $50
     - Payment Method: Card
     - Card Number: 4111111111111111 (test Visa)
     - Name: Test Donor
     - Expiry: 12/2025
     - CVV: 123
   - Click "Donate"

5. **Verify Results**
   - See success message
   - Stats update automatically
   - Check "Donation Log" tab for transaction history

### Option 2: Use the API Test Script

1. **Run the Test Script**
   ```bash
   cd /home/muditha/CapstoneProject2/src/backend/tests
   ./donor-api-test.sh
   ```

2. **Review Results**
   The script will:
   - Register a new donor
   - Login and get token
   - Test all donor endpoints
   - Process a $50 donation
   - Verify stats update

### Option 3: Manual API Testing with curl

1. **Register Donor**
   ```bash
   curl -sk -X POST https://192.168.1.103:3001/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Donor",
       "email": "donor@example.com",
       "password": "Password123!",
       "role": "donor"
     }'
   ```

2. **Login**
   ```bash
   curl -sk -X POST https://192.168.1.103:3001/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "donor@example.com",
       "password": "Password123!"
     }'
   ```

   Save the `accessToken` from response.

3. **Get Stats**
   ```bash
   curl -sk -X GET https://192.168.1.103:3001/donor/stats \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

4. **Make Donation**
   ```bash
   curl -sk -X POST https://192.168.1.103:3001/donor/donate \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -d '{
       "amount": 50,
       "paymentMethod": "card",
       "cardDetails": {
         "cardNumber": "4111111111111111",
         "cardholderName": "Test Donor",
         "expiryMonth": 12,
         "expiryYear": 2025,
         "cvv": "123",
         "last4": "1111"
       }
     }'
   ```

## Test Card Numbers

Use these test card numbers:

- **Visa**: 4111111111111111
- **Mastercard**: 5555555555554444
- **Amex**: 378282246310005
- **Discover**: 6011111111111117

All test cards:
- Expiry: Any future date
- CVV: Any 3-4 digits
- Name: Any name

## Troubleshooting

### Backend Not Starting
```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Database Connection Issues
```bash
# Check if database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Frontend Build Errors
```bash
# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

### CORS Errors
Check `src/backend/.env`:
```
CORS_ORIGIN=https://192.168.1.103:3000
```

### SSL Certificate Issues
If using Chrome/Firefox:
1. Click "Advanced"
2. Click "Proceed to site"
3. Accept self-signed certificate

### API Returns 401 Unauthorized
- Token may be expired
- Login again to get fresh token
- Token expires after 1 hour (configurable)

### Payment Processing Fails
Check:
1. Card number is valid (Luhn check)
2. Expiry date is in the future
3. CVV is 3-4 digits
4. All required fields are filled

## Viewing Data in Database

```bash
# Connect to database
docker exec -it nourishnet-db psql -U postgres -d nourishnet

# View transactions
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10;

# View donations
SELECT * FROM donations ORDER BY created_at DESC LIMIT 10;

# View user balances
SELECT id, name, email, balance FROM users WHERE role = 'donor';

# Exit psql
\q
```

## API Documentation

Access Swagger UI:
```
https://192.168.1.103:3001/api-docs
```

## Monitoring Logs in Real-Time

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend

# Database only
docker-compose logs -f db
```

## Stop the Application

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

## File Structure

```
src/
├── backend/
│   ├── controllers/
│   │   ├── donor.controller.js      ← Donor business logic
│   │   └── README.md                 ← API documentation
│   ├── routes/
│   │   └── donor.routes.js           ← Donor API routes
│   ├── tests/
│   │   └── donor-api-test.sh         ← Test script
│   └── app.js                        ← Route registration
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── PaymentModal.jsx      ← Payment UI
    │   ├── pages/
    │   │   └── Donor.jsx              ← Donor dashboard
    │   └── lib/
    │       └── api.js                 ← API client
```

## Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Review API docs: `src/backend/controllers/README.md`
3. Run test script: `./src/backend/tests/donor-api-test.sh`
4. Check implementation guide: `DONOR_IMPLEMENTATION.md`

## Next Steps

1. Test all donor features
2. Verify transactions in database
3. Check delivery tracking
4. Test with multiple donors
5. Integrate real payment gateway (Stripe, PayPal)
6. Add monitoring and analytics
7. Deploy to production

---

**Happy Testing! 🚀**
