const request = require('supertest');
const app = require('../app');

describe('Auth Integration', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'TestPassword123',
      role: 'donor',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/Registration successful/i);
  });

  it('should not register with existing email', async () => {
    await request(app).post('/auth/register').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'TestPassword123',
      role: 'donor',
    });
    const res = await request(app).post('/auth/register').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'TestPassword123',
      role: 'donor',
    });
    expect(res.statusCode).toBe(400);
  });

  it('should not login with wrong password', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'testuser@example.com',
      password: 'WrongPassword',
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
    const res = await request(app).post('/auth/refresh-token');
    expect(res.statusCode).toBe(401);
  });

  it('should login with correct credentials and receive tokens', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'testuser@example.com',
      password: 'TestPassword123',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user).toBeDefined();
    // Check for refresh token cookie
    const cookies = res.headers['set-cookie'];
    expect(cookies && cookies.some((c) => c.startsWith('refreshToken='))).toBe(
      true
    );
  });

  it('should logout and clear refresh token cookie', async () => {
    // Login first to get cookie
    const loginRes = await request(app).post('/auth/login').send({
      email: 'testuser@example.com',
      password: 'TestPassword123',
    });
    const cookie = loginRes.headers['set-cookie'];
    const res = await request(app).post('/auth/logout').set('Cookie', cookie);
    expect(res.statusCode).toBe(204);
    // Should clear the cookie
    const logoutCookies = res.headers['set-cookie'];
    expect(
      logoutCookies && logoutCookies.some((c) => c.startsWith('refreshToken=;'))
    ).toBe(true);
  });

  it('should block too many login attempts (rate limit)', async () => {
    for (let i = 0; i < 11; i++) {
      await request(app)
        .post('/auth/login')
        .send({ email: 'testuser@example.com', password: 'WrongPassword' });
    }
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'testuser@example.com', password: 'WrongPassword' });
    expect(res.statusCode).toBe(429);
  });

  it('should deny access to protected route without token', async () => {
    const res = await request(app).get('/protected/me');
    expect(res.statusCode).toBe(401);
  });

  it('should allow access to protected route with valid token', async () => {
    // Login to get access token
    const loginRes = await request(app).post('/auth/login').send({
      email: 'testuser@example.com',
      password: 'TestPassword123',
    });
    const token = loginRes.body.accessToken;
    const res = await request(app)
      .get('/protected/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toBeDefined();
  });

  it('should deny access to admin route for non-admin', async () => {
    // Login as donor
    const loginRes = await request(app).post('/auth/login').send({
      email: 'testuser@example.com',
      password: 'TestPassword123',
    });
    const token = loginRes.body.accessToken;
    const res = await request(app)
      .get('/protected/admin-only')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });
});
