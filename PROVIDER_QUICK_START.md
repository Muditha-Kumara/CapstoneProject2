# Provider Feature - Quick Start Guide 🚀

## Prerequisites
- Docker and Docker Compose installed
- PostgreSQL database running
- Backend server running on port 3001
- Frontend server running on port 5173

---

## Step 1: Run Database Migration

```bash
# Apply the new provider fields migration
docker exec -it nourishnet-db psql -U postgres -d nourishnet -f /docker-entrypoint-initdb.d/005_alter_orders_add_provider_fields.sql
```

**Expected Output:**
```
ALTER TABLE
CREATE INDEX
```

---

## Step 2: Restart Backend Server

```bash
# Restart backend to load new provider routes
docker-compose restart backend

# Or if using docker compose
docker compose restart backend
```

**Wait for:** "Server is running on https://192.168.1.103:3001"

---

## Step 3: Test Provider Endpoints

### 3.1 Register as Provider

```bash
curl -sk -X POST https://192.168.1.103:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Provider",
    "email": "provider@test.com",
    "password": "Password123!",
    "role": "provider"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid-here",
    "name": "Test Provider",
    "email": "provider@test.com",
    "role": "provider"
  }
}
```

### 3.2 Login

```bash
curl -sk -X POST https://192.168.1.103:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "provider@test.com",
    "password": "Password123!"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid-here",
    "name": "Test Provider",
    "email": "provider@test.com",
    "role": "provider"
  }
}
```

**Save the token for next steps!**

### 3.3 Get Available Requests

```bash
# Replace YOUR_TOKEN with actual token from login
export TOKEN="YOUR_TOKEN_HERE"

curl -sk -X GET https://192.168.1.103:3001/provider/requests \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "requests": [
    {
      "id": "request-uuid",
      "meal_type": "dinner",
      "location": "Downtown Food Bank",
      "time": "2024-11-20T18:00:00Z",
      "special_dietary_needs": "Vegetarian",
      "status": "pending",
      "created_at": "2024-11-20T10:00:00Z",
      "requester_name": "Child #1234"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "offset": 0
  }
}
```

### 3.4 Get Provider Stats

```bash
curl -sk -X GET https://192.168.1.103:3001/provider/stats \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "stats": {
    "activeOrders": 0,
    "completedOrders": 0,
    "totalOrders": 0,
    "mealsServed": 0
  }
}
```

### 3.5 Accept a Request

```bash
# Replace REQUEST_UUID with actual request ID
export REQUEST_ID="your-request-uuid"

curl -sk -X POST https://192.168.1.103:3001/provider/accept \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "requestId": "'$REQUEST_ID'",
    "estimatedTime": "30 minutes"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Request accepted successfully",
  "order": {
    "id": "order-uuid",
    "request_id": "request-uuid",
    "provider_id": "provider-uuid",
    "status": "processing",
    "estimated_time": "30 minutes",
    "created_at": "2024-11-20T12:00:00Z"
  }
}
```

### 3.6 Get Provider Orders

```bash
curl -sk -X GET https://192.168.1.103:3001/provider/orders \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "order-uuid",
      "request_id": "request-uuid",
      "meal_type": "dinner",
      "location": "Downtown Food Bank",
      "status": "processing",
      "estimated_time": "30 minutes",
      "created_at": "2024-11-20T12:00:00Z",
      "requester_name": "Child #1234"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "offset": 0
  }
}
```

### 3.7 Update Order Status

```bash
# Replace ORDER_UUID with actual order ID
export ORDER_ID="your-order-uuid"

curl -sk -X PUT https://192.168.1.103:3001/provider/order/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "orderId": "'$ORDER_ID'",
    "status": "preparing",
    "photoUrl": "https://example.com/food-photo.jpg"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "order": {
    "id": "order-uuid",
    "status": "preparing",
    "photo_url": "https://example.com/food-photo.jpg"
  }
}
```

### 3.8 Mark Order as Fulfilled

```bash
curl -sk -X PUT https://192.168.1.103:3001/provider/order/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "orderId": "'$ORDER_ID'",
    "status": "fulfilled",
    "photoUrl": "https://example.com/completed-meal.jpg"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully. Request marked as approved.",
  "order": {
    "id": "order-uuid",
    "status": "fulfilled",
    "photo_url": "https://example.com/completed-meal.jpg"
  }
}
```

### 3.9 Cancel an Order (Optional)

```bash
curl -sk -X POST https://192.168.1.103:3001/provider/order/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "orderId": "'$ORDER_ID'",
    "reason": "Unable to prepare due to missing ingredients"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "order": {
    "id": "order-uuid",
    "status": "cancelled",
    "cancellation_reason": "Unable to prepare due to missing ingredients"
  }
}
```

---

## Step 4: Test in Browser

### 4.1 Navigate to Provider Page

1. Open browser: https://192.168.1.103:5173
2. Click "Login"
3. Enter provider credentials:
   - Email: `provider@test.com`
   - Password: `Password123!`
4. Navigate to "/provider" or click "Provider" in header

### 4.2 Test Features

**Dashboard View:**
- ✅ See statistics cards (Active, Completed, Total, Meals Served)
- ✅ Three tabs: Available Requests, Active Orders, Completed Orders

**Available Requests Tab:**
- ✅ See all pending requests
- ✅ View request details
- ✅ Click "Accept Request" button
- ✅ Enter estimated time in modal
- ✅ Submit to accept request

**Active Orders Tab:**
- ✅ See your active orders
- ✅ View order details
- ✅ Click "Update Status" button
- ✅ Select new status (processing → preparing → ready → fulfilled)
- ✅ Upload photo URL
- ✅ Submit to update status

**Cancel Order:**
- ✅ Click "Cancel Order" button on active order
- ✅ Enter cancellation reason
- ✅ Confirm cancellation

**Completed Orders Tab:**
- ✅ See order history
- ✅ View completed order details

---

## Step 5: End-to-End Testing

### Full Workflow Test

1. **As Requester:**
   - Register/Login as requester
   - Create a food request
   - Navigate to "/requester"
   - Click "Request Food"
   - Fill form and submit

2. **As Provider:**
   - Login as provider
   - Navigate to "/provider"
   - Go to "Available Requests" tab
   - See the new request
   - Click "Accept Request"
   - Enter estimated time
   - Submit

3. **Update Order:**
   - Go to "Active Orders" tab
   - See the accepted order
   - Click "Update Status"
   - Change status to "preparing"
   - Add photo URL (optional)
   - Submit

4. **Complete Order:**
   - Click "Update Status" again
   - Change status to "fulfilled"
   - Submit
   - Order moves to "Completed Orders" tab

5. **As Requester Again:**
   - Go back to requester account
   - Navigate to "/requester"
   - See request status changed to "approved"
   - View order details

---

## Troubleshooting

### Issue: "Route not found"
**Solution:** Restart backend server:
```bash
docker-compose restart backend
```

### Issue: "Provider not authorized"
**Solution:** Make sure you're logged in with provider role:
```bash
# Check user role in database
docker exec -it nourishnet-db psql -U postgres -d nourishnet -c "SELECT id, name, email, role FROM users WHERE email='provider@test.com';"
```

### Issue: "No requests found"
**Solution:** Create a request first as a requester:
```bash
# Register as requester
curl -sk -X POST https://192.168.1.103:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Requester",
    "email": "requester@test.com",
    "password": "Password123!",
    "role": "recipient"
  }'

# Login as requester
curl -sk -X POST https://192.168.1.103:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "requester@test.com",
    "password": "Password123!"
  }'

# Create request (save token first)
export REQUESTER_TOKEN="token-from-login"

curl -sk -X POST https://192.168.1.103:3001/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $REQUESTER_TOKEN" \
  -d '{
    "meal_type": "dinner",
    "location": "123 Main St",
    "time": "2024-11-20T18:00:00Z",
    "special_dietary_needs": "None"
  }'
```

### Issue: Database migration error
**Solution:** Check if migration already applied:
```bash
docker exec -it nourishnet-db psql -U postgres -d nourishnet -c "\d orders"
```
Look for columns: `provider_id`, `estimated_time`, `photo_url`, `cancellation_reason`

### Issue: Token expired
**Solution:** Login again to get new token

---

## Success Criteria ✅

- [ ] Database migration applied successfully
- [ ] Backend server restarted
- [ ] Provider can register and login
- [ ] Provider can view available requests
- [ ] Provider can see statistics
- [ ] Provider can accept requests
- [ ] Provider can update order status
- [ ] Provider can upload photos
- [ ] Provider can cancel orders
- [ ] Provider can view completed orders
- [ ] End-to-end workflow works (requester → provider → completion)

---

## Next Steps

1. **Test with real data**
2. **Integrate photo upload** (AWS S3, Cloudinary)
3. **Add real-time notifications** (Socket.io)
4. **Add location-based filtering**
5. **Add chat system**
6. **Deploy to production**

---

## Support

If you encounter issues:
1. Check backend logs: `docker logs nourishnet-backend`
2. Check frontend console: Browser DevTools → Console
3. Review PROVIDER_IMPLEMENTATION.md for detailed docs
4. Check database: `docker exec -it nourishnet-db psql -U postgres -d nourishnet`

**Status:** ✅ Ready for Testing  
**Last Updated:** November 20, 2025
