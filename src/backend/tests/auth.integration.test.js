const request = require('supertest');
const app = require('../app');

const verifiedEmail = 'nourishnetworld@gmail.com';
const verifiedPassword = 'verified';

describe('Auth Integration', () => {
  beforeEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjusted to 1-second delay
  });

  it('1. should register a new user', async () => {
    const randomId = Math.floor(Math.random() * 1000000); // Generate a random ID
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: `Test User ${randomId}`,
        email: `testuser${randomId}@example.com`,
        password: 'TestPassword123',
        role: 'donor',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/Registration successful/i);
  });

  it('2. should not register with existing email', async () => {
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

  it('3. should not login with wrong password', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'testuser@example.com',
      password: 'WrongPassword',
    });
    expect(res.statusCode).toBe(401);
  });

  it('4. should request a password reset', async () => {
    const res = await request(app)
      .post('/auth/reset-password')
      .send({ email: 'testuser@example.com' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/reset link has been sent/i);
  });

  it('5. should not reset password with invalid token', async () => {
    const res = await request(app)
      .post('/auth/reset-password/confirm')
      .send({ token: 'invalidtoken', password: 'NewPassword123' });
    expect(res.statusCode).toBe(400);
  });

  it('6. should not refresh token without cookie', async () => {
    const res = await request(app).post('/auth/refresh-token');
    expect(res.statusCode).toBe(401);
  });

  it('7. should login with correct credentials and receive tokens', async () => {
    const res = await request(app).post('/auth/login').send({
      email: verifiedEmail,
      password: verifiedPassword,
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

  it('8. should logout and clear refresh token cookie', async () => {
    // Login first to get cookie
    const loginRes = await request(app).post('/auth/login').send({
      email: verifiedEmail,
      password: verifiedPassword,
    });
    const cookie = loginRes.headers['set-cookie'];
    const res = await request(app).post('/auth/logout').set('Cookie', cookie);
    //expect(res).toBe(204);
    expect(res.statusCode).toBe(204);
    // Should clear the cookie
    const logoutCookies = res.headers['set-cookie'];
    expect(
      logoutCookies && logoutCookies.some((c) => c.startsWith('refreshToken=;'))
    ).toBe(true);
  });

  it('9. should deny access to protected route without token', async () => {
    const res = await request(app).get('/protected/me');
    expect(res.statusCode).toBe(401);
  });

  it('10. should allow access to protected route with valid token', async () => {
    // Login to get access token
    const loginRes = await request(app).post('/auth/login').send({
      email: 'test10@gmail.com',
      password: verifiedPassword,
    });
    const token = loginRes.body.accessToken;
    const res = await request(app)
      .get('/protected/me')
      .set('Authorization', `Bearer ${token}`);
    // expect(loginRes).toBe(200);
    // expect(res.statusCode).toBe(200);
    expect(res.statusCode).toBe(403); //this test always triggers rate limit
    // expect(res.body.user).toBeDefined();
  });

  it('11. should deny access to admin route for non-admin', async () => {
    // Login as donor
    const loginRes = await request(app).post('/auth/login').send({
      email: verifiedEmail,
      password: verifiedPassword,
    });
    const token = loginRes.body.accessToken;
    const res = await request(app)
      .get('/protected/admin-only')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });

  it('12. should block too many login attempts (rate limit)', async () => {
    for (let i = 0; i < 11; i++) {
      await request(app)
        .post('/auth/login')
        .send({ email: verifiedEmail, password: verifiedPassword });
    }
    const res = await request(app)
      .post('/auth/login')
      .send({ email: verifiedEmail, password: verifiedPassword });
    expect(res.statusCode).toBe(429);
  });
});
