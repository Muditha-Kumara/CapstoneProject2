Troubleshooting Guide

This guide lists common problems users or developers may experience and how to solve them.

1. Application does not start

Possible causes:

Missing dependencies

Wrong Node.js version

Environment variables not configured

Fix:

npm install
cp .env.example .env

2. Frontend cannot connect to backend

Possible causes:

Incorrect API URL in .env

Backend not running

CORS issues

Fix:

Start backend: npm run dev

Check VITE_API_URL in frontend

3. Docker build fails

Possible causes:

Old cache

Port already in use

Missing Docker Compose file

Fix:

docker-compose down
docker-compose up --build

4. Database connection error

Possible causes:

Database container not running

Wrong DB credentials

Migrations not applied

Fix:

Restart Docker

Re-check database configuration

5. Login or Signup not working

Possible causes:

Backend validation failing

Missing required fields

API endpoint not reachable

Fix:

Check browser console

Verify backend logs

Confirm API routes exist

6. UI components not displaying

Possible causes:

Missing imports

Incorrect CSS path

Build failure

Fix:

Reinstall frontend dependencies:

npm install


Restart dev server

7. Git errors when pushing or pulling

Possible causes:

Local branch behind remote

Merge conflict

Not on correct branch

Fix:

git pull
git status
git checkout issue29-docs

8. Summary

This guide helps users quickly identify and solve common problems during development or setup.