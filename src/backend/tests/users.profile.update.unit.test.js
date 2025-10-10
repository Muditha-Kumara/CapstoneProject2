const db = require('../db');
const { validationResult } = require('express-validator');
const authController = require('../controllers/auth.controller');

describe('PUT /api/users/profile', () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 1 }, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should update user profile with valid fields', async () => {
    req.body = {
      name: 'Updated Name',
      email: 'updated@example.com',
      balance: 500,
    };
    db.query = jest.fn().mockResolvedValue({
      rows: [
        {
          id: 1,
          name: 'Updated Name',
          email: 'updated@example.com',
          role: 'donor',
          balance: 500,
          verified: true,
          avatar_url: null,
          preferences: {},
        },
      ],
    });
    await authController.updateUserProfile(req, res);
    expect(res.json).toHaveBeenCalledWith({
      profile: expect.objectContaining({
        name: 'Updated Name',
        email: 'updated@example.com',
        balance: 500,
      }),
    });
  });

  it('should return 400 if no valid fields to update', async () => {
    req.body = {};
    await authController.updateUserProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'No valid fields to update',
    });
  });

  it('should return 404 if user not found', async () => {
    req.body = { name: 'Name' };
    db.query = jest.fn().mockResolvedValue({ rows: [] });
    await authController.updateUserProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should handle database errors', async () => {
    req.body = { name: 'Name' };
    db.query = jest.fn().mockRejectedValue(new Error('DB error'));
    await authController.updateUserProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error updating profile',
      error: 'DB error',
    });
  });
});
