# NourishNet Backend Test Suite

## 📋 Overview

Comprehensive test suite for the NourishNet backend API, including automated Jest tests and manual API test scripts for all major features.

---

## 📦 Test Files

### Automated Tests (Jest + Supertest)

1. **auth.controller.unit.test.js** - Unit tests for authentication controller (28 tests, 98.19% coverage)
2. **auth.integration.test.js** - Integration tests for authentication endpoints
3. **admin_and_email.integration.test.js** - Integration tests for admin and email functionality

### Manual API Test Scripts (Bash)

1. **donor-api-test.sh** - Complete test suite for donor endpoints
2. **provider-api-test.sh** - Complete test suite for provider endpoints

---

## 🚀 Setup

### Prerequisites

```bash
# Install test dependencies
npm install --save-dev jest supertest

# For bash scripts, ensure you have curl and jq installed
sudo apt-get install curl jq  # Ubuntu/Debian
brew install curl jq          # macOS
```

### Environment Setup

Make sure your backend server is running:
```bash
# Start with docker-compose
docker-compose up -d

# Or start manually
cd src/backend
npm install
node server.js
```

---

## 🧪 Running Tests

### Automated Tests (Jest)

**Run all tests:**
```bash
npm test
```

**Run tests with coverage:**
```bash
npm run test:coverage
```

**Run tests in watch mode:**
```bash
npm run test:watch
```

**Run specific test file:**
```bash
npm test auth.controller.unit.test.js
```

### Manual API Tests (Bash Scripts)

**Test Donor API (10 comprehensive tests):**
```bash
cd src/backend/tests
./donor-api-test.sh
```

**Test Provider API (14 comprehensive tests):**
```bash
cd src/backend/tests
./provider-api-test.sh
```

---

## 📊 Test Coverage

### Auth Controller Unit Tests
- **Total Tests**: 28 passing
- **Code Coverage**: 98.19%
- **Functions Covered**: 100%
- **Branches Covered**: 100%

**Test Suites:**
1. Register Function (4 tests)
2. Verify Email Function (3 tests)
3. Login Function (6 tests)
4. Logout Function (1 test)
5. Request Password Reset Function (4 tests)
6. Reset Password Function (5 tests)
7. Refresh Token Function (5 tests)

---

## 📝 Manual Test Scripts

### donor-api-test.sh

Complete test suite for donor functionality:

1. **Register Donor** - Create test donor account
2. **Login** - Authenticate and get JWT token
3. **Get Donor Stats** - Verify statistics endpoint
4. **Get Transaction History** - Test transaction retrieval with pagination
5. **Get Delivered Donations** - Test delivery tracking
6. **Get Donor Feedback** - Test feedback system
7. **Get Donor Balance** - Verify balance calculation
8. **Process Donation (Credit Card)** - Test card payment with Luhn validation
9. **Process Donation (PayPal)** - Test PayPal payment method
10. **Process Donation (Bank Transfer)** - Test bank payment method
11. **Test Error Handling** - Invalid donation amount
12. **Test Unauthorized Access** - Verify authentication requirement

**What it tests:**
- ✅ User registration and authentication
- ✅ All 6 donor endpoints
- ✅ Payment processing (3 methods)
- ✅ Card validation (Luhn algorithm)
- ✅ Input validation
- ✅ Error handling
- ✅ Authorization

**Example output:**
```
========================================
Test 8: Process Donation (Credit Card)
========================================

✓ Donation processed successfully (Credit Card)
{
  "success": true,
  "message": "Donation processed successfully",
  "donation": {
    "id": "...",
    "amount": 100.00,
    "payment_method": "credit_card"
  }
}
```

### provider-api-test.sh

Complete test suite for provider functionality:

1. **Register Provider** - Create test provider account
2. **Login** - Authenticate and get JWT token
3. **Get Provider Stats (Initial)** - Verify empty stats
4. **Get Available Requests** - List pending food requests
5. **Create Sample Request** - Generate test data if needed
6. **Accept Request** - Test order creation
7. **Get Provider Orders** - Verify order retrieval
8. **Update Order to Preparing** - Test status transition
9. **Update Order to Ready** - Test status progression
10. **Update Order to Fulfilled** - Complete order workflow
11. **Get Provider Stats (Final)** - Verify updated statistics
12. **Test Cancel Order** - Test cancellation with reason
13. **Test Error Handling** - Invalid order ID
14. **Test Unauthorized Access** - Verify authentication

**What it tests:**
- ✅ User registration and authentication
- ✅ All 6 provider endpoints
- ✅ Order lifecycle (processing → preparing → ready → fulfilled)
- ✅ Photo URL uploads
- ✅ Order cancellation
- ✅ Request-to-order conversion
- ✅ Statistics calculation
- ✅ Input validation
- ✅ Error handling
- ✅ Authorization

**Example output:**
```
========================================
Test 6: Accept Request
========================================

✓ Request accepted successfully
{
  "success": true,
  "message": "Request accepted successfully",
  "order": {
    "id": "uuid-here",
    "request_id": "request-uuid",
    "provider_id": "provider-uuid",
    "status": "processing",
    "estimated_time": "30 minutes"
  }
}
```

---

## 🎯 Writing New Tests

### Adding Automated Tests

1. **Create test file**: `feature.test.js`

2. **Follow the pattern:**
```javascript
const request = require('supertest');
const app = require('../app');
const db = require('../db');

describe('Feature Tests', () => {
  let authToken;

  beforeAll(async () => {
    // Setup test database connection
  });

  afterAll(async () => {
    // Cleanup
    await db.end();
  });

  it('should test something', async () => {
    const response = await request(app)
      .post('/endpoint')
      .send({ data: 'test' })
      .expect(200);
    
    expect(response.body).toHaveProperty('success', true);
  });
});
```

3. **Add to package.json** (if needed)

### Adding Manual Test Scripts

1. **Create bash script**: `feature-api-test.sh`

2. **Make executable:**
```bash
chmod +x feature-api-test.sh
```

3. **Follow the pattern** from existing scripts

---

## 🐛 Debugging Tests

### Automated Tests

**Enable verbose output:**
```bash
npm test -- --verbose
```

**Run single test:**
```bash
npm test -- --testNamePattern="test name"
```

**Debug with Node inspector:**
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Manual Test Scripts

**Enable debug mode:**
```bash
bash -x ./donor-api-test.sh
```

**View raw responses:**
```bash
# Add -v flag to curl commands in script
curl -skv -X GET "$BASE_URL/endpoint"
```

---

## 📋 Test Checklist

Before committing:

- [ ] All automated tests pass
- [ ] Code coverage meets targets (>80%)
- [ ] Manual test scripts run successfully
- [ ] No console errors
- [ ] API responses follow expected format
- [ ] Error handling works correctly
- [ ] Authentication/authorization works
- [ ] Input validation tested
- [ ] Edge cases covered
- [ ] Documentation updated

---

## 🆘 Common Issues

### Issue: Tests fail with "port already in use"
**Solution:** Stop the running server before running tests

### Issue: Database connection errors
**Solution:** Check database is running and credentials are correct

### Issue: Token expired in manual tests
**Solution:** Tests auto-generate new tokens

### Issue: curl command not found
**Solution:** `sudo apt-get install curl`

### Issue: jq command not found
**Solution:** `sudo apt-get install jq`

### Issue: "Permission denied" when running bash scripts
**Solution:** `chmod +x script-name.sh`

---

## 💡 Best Practices

1. **Test Isolation**: Each test should be independent
2. **Clean Database**: Reset test data between tests
3. **Mock External Services**: Don't rely on external APIs
4. **Test Error Cases**: Test both success and failure scenarios
5. **Use Descriptive Names**: Test names should explain what they test
6. **Keep Tests Fast**: Tests should run quickly
7. **Don't Test Implementation**: Test behavior, not implementation
8. **Use Setup/Teardown**: Properly initialize and cleanup test data

---

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [curl Documentation](https://curl.se/docs/)
- [jq Documentation](https://stedolan.github.io/jq/)
- [Testing Best Practices](https://testingjavascript.com/)

---

## 📞 Support

For test-related issues:
1. Check this README
2. Review test output carefully
3. Check backend logs: `docker logs nourishnet-backend`
4. Review API documentation in controllers
5. Check DONOR_IMPLEMENTATION.md or PROVIDER_IMPLEMENTATION.md

---

**Last Updated:** November 20, 2025  
**Test Coverage:** 28 automated tests + 24 manual test scenarios  
**Status:** ✅ All tests passing
