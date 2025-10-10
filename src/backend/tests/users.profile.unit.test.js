const db = require('../db');
const authController = require('../controllers/auth.controller');

describe('GET /api/users/profile', () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return profile for Verified User sample data', async () => {
    db.query = jest.fn().mockResolvedValue({
      rows: [
        {
          id: 1,
          name: 'Verified User',
          email: 'nourishnetworld@gmail.com',
          password_hash:
            '$2b$10$upQLo0xNScfLEgRwVXG4Fe1BWqT88ZqrgGQBpQTrJN2xuZ3dnN91G',
          role: 'donor',
          balance: 1000.0,
          verified: true,
          avatar_url: null,
          preferences: {},
        },
      ],
    });
    await authController.getUserProfile(req, res);
    expect(res.json).toHaveBeenCalledWith({
      profile: expect.objectContaining({
        name: 'Verified User',
        email: 'nourishnetworld@gmail.com',
        role: 'donor',
        balance: 1000.0,
        verified: true,
      }),
    });
  });

  it('should return 404 if user not found', async () => {
    db.query = jest.fn().mockResolvedValue({ rows: [] });
    await authController.getUserProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should handle database errors', async () => {
    db.query = jest.fn().mockRejectedValue(new Error('DB error'));
    await authController.getUserProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error fetching profile',
      error: 'DB error',
    });
  });
});
