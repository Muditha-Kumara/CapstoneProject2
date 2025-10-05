const request = require('supertest');
const app = require('../app');

describe('Admin & Email Verification Integration', () => {
  let adminToken, adminEmailToken;

  it('should register a new admin user', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'AdminPassword123',
      role: 'admin',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/Registration successful/i);
    // Simulate fetching the verification token from DB (mock or direct DB call in real test)
    // Here, assume the backend exposes a test-only endpoint or you have a way to get the token
  });

  it('should not login before email verification', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'admin@example.com',
      password: 'AdminPassword123',
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/email not verified/i);
  });

  // This test assumes you can retrieve the verification token for the admin user
  it('should verify admin email (simulate token)', async () => {
    // In a real test, fetch the token from DB or mock the email sending
    // For demonstration, assume a helper function getVerificationToken(email)
    // const token = await getVerificationToken('admin@example.com');
    // For now, skip actual DB and just check endpoint structure
    // const res = await request(app).get(`/auth/verify-email?token=${token}`);
    // expect(res.statusCode).toBe(200);
    // expect(res.body.message).toMatch(/verified/i);
  });

  it('should login as admin after verification (simulate verified)', async () => {
    // In a real test, mark the user as verified in DB or use the verified token
    // For now, this is a placeholder for the flow
    // const res = await request(app)
    //   .post('/auth/login')
    //   .send({ email: 'admin@example.com', password: 'AdminPassword123' });
    // expect(res.statusCode).toBe(200);
    // adminToken = res.body.accessToken;
  });

  it('should allow access to admin-only route for admin', async () => {
    // Placeholder: Use adminToken from above
    // const res = await request(app)
    //   .get('/protected/admin-only')
    //   .set('Authorization', `Bearer ${adminToken}`);
    // expect(res.statusCode).toBe(200);
    // expect(res.body.user.role).toBe('admin');
  });
});
