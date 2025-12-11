API Documentation (Placeholder)

This document outlines the main API endpoints used by the system.
As backend development continues, new endpoints may be added and existing ones updated.

1. Authentication Endpoints
POST /api/auth/register

Creates a new user account.

Request body example:

{
  "name": "John",
  "email": "john@example.com",
  "password": "123456"
}

POST /api/auth/login

Authenticates a user and returns a token used for protected routes.

2. User Endpoints
GET /api/users/me

Returns the logged-in user's profile information.

3. Food Request Endpoints
POST /api/requests

Creates a new food assistance request.

GET /api/requests

Returns all available food requests.

GET /api/requests/:id

Returns detailed information about a specific request.

4. Donor Endpoints
POST /api/donations

Allows donors to donate toward a specific food request.

GET /api/donations/history

Returns the donation history for the logged-in donor.

5. Admin Endpoints
GET /api/admin/stats

Returns system-level statistics for admins.

6. Notes

Many endpoints require an authentication token.

Exact field names or payloads may change as development continues.

This placeholder will be updated as backend work progresses.

7. Summary

This API documentation provides a basic overview of the system's endpoints and serves as a placeholder for future detailed updates.