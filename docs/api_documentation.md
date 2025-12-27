API Documentation

The NourishNet backend uses Swagger UI and an OpenAPI specification to document all API endpoints.
This ensures that developers always have accurate and updated API information.

1. Accessing the API Docs

Start the backend server:

cd src/backend
npm install
npm start


Then open the API documentation in your browser:

http://localhost:5000/api-docs


This interface allows you to:

View all available endpoints

See request and response formats

Test API calls

Validate parameters and error responses

2. OpenAPI Specification File

The API specification file is stored in the repository at:

docs/openapi.yaml


This file defines all API schemas, routes, and models used by the backend.

3. Why Swagger Is Used

Keeps documentation always in sync with backend

Prevents outdated manual documentation

Provides automatic UI

Supports API testing

Helps future developers understand the backend quickly

4. Summary

This project uses Swagger/OpenAPI for API documentation.
Developers should use /api-docs and openapi.yaml as the source of truth.