# Auth Controller Unit Tests

## Overview
This document describes the comprehensive unit tests for the authentication controller (`auth.controller.js`).

## Test Coverage
- **Total Tests**: 28 passing tests
- **Code Coverage**: 98.19% of auth.controller.js
- **Functions Covered**: 100%
- **Branches Covered**: 100%

## Test Suites

### 1. Register Function (4 tests)
- ✅ Should register a new user successfully
- ✅ Should return 400 if validation fails
- ✅ Should return 400 if email already exists
- ✅ Should return 500 on server error

### 2. Verify Email Function (3 tests)
- ✅ Should verify email successfully
- ✅ Should return 400 if token is invalid
- ✅ Should return 500 on server error

### 3. Login Function (6 tests)
- ✅ Should login successfully and return tokens
- ✅ Should return 400 if validation fails
- ✅ Should return 401 if user not found
- ✅ Should return 401 if email not verified
- ✅ Should return 401 if password is invalid
- ✅ Should return 500 on server error

### 4. Logout Function (1 test)
- ✅ Should logout successfully and clear cookie

### 5. Request Password Reset Function (4 tests)
- ✅ Should send password reset email successfully
- ✅ Should return 400 if validation fails
- ✅ Should return generic message if user not found
- ✅ Should return 500 on server error

### 6. Reset Password Function (5 tests)
- ✅ Should reset password successfully
- ✅ Should return 400 if validation fails
- ✅ Should return 400 if token is invalid
- ✅ Should return 400 if token is expired
- ✅ Should return 500 on server error

### 7. Refresh Token Function (5 tests)
- ✅ Should refresh access token successfully
- ✅ Should return 401 if no refresh token provided
- ✅ Should return 403 if refresh token is invalid
- ✅ Should return 401 if user not found
- ✅ Should handle database error in jwt callback

## Mocked Dependencies

The following dependencies are mocked in the tests:
- `../db` - Database queries
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT token generation and verification
- `uuid` - UUID generation for tokens
- `nodemailer` - Email sending
- `express-validator` - Request validation

## Running the Tests

### Run all unit tests
```bash
npm test -- auth.controller.unit.test.js
```

### Run tests with coverage
```bash
npm test -- auth.controller.unit.test.js --coverage
```

### Run tests in watch mode
```bash
npm test -- auth.controller.unit.test.js --watch
```

### Run tests with verbose output
```bash
npm test -- auth.controller.unit.test.js --verbose
```

## Test Structure

Each test follows this pattern:
1. **Arrange**: Set up mock data and configure mocks
2. **Act**: Call the controller function
3. **Assert**: Verify the expected behavior

## Key Testing Techniques Used

1. **Mocking External Dependencies**: All external modules are mocked to isolate the controller logic
2. **Request/Response Mocking**: Express request and response objects are mocked
3. **Async/Await Testing**: Proper handling of asynchronous operations
4. **Error Scenario Testing**: Comprehensive error handling coverage
5. **Edge Case Testing**: Token expiration, missing data, invalid inputs

## Notes

- Console errors are suppressed during tests to reduce noise
- All environment variables are mocked in the test setup
- Tests are isolated and don't depend on external services or databases
- Each test clears all mocks before execution to ensure independence
