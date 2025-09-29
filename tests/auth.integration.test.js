const request = require('supertest');
const app = require('../src/backend/app'); 

describe('Auth Integration', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'TestPassword123',
        role: 'donor'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/Registration successful/i);
  });

  it('should not register with existing email', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'TestPassword123',
        role: 'donor'
      });
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'TestPassword123',
        role: 'donor'
      });
    expect(res.statusCode).toBe(400);
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'WrongPassword'
      });
    expect(res.statusCode).toBe(401);
  });

  it('should request a password reset', async () => {
    const res = await request(app)
      .post('/auth/reset-password')
      .send({ email: 'testuser@example.com' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/reset link has been sent/i);
  });

  it('should not reset password with invalid token', async () => {
    const res = await request(app)
      .post('/auth/reset-password/confirm')
      .send({ token: 'invalidtoken', password: 'NewPassword123' });
    expect(res.statusCode).toBe(400);
  });

  it('should not refresh token without cookie', async () => {
    const res = await request(app)
      .post('/auth/refresh-token');
    expect(res.statusCode).toBe(401);
  });

  // Add more tests for email verification, password reset, refresh, etc.
});
