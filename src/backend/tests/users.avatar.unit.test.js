const db = require('../db');
const authController = require('../controllers/auth.controller');
const path = require('path');

describe('POST /api/users/avatar', () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 1 }, file: { filename: 'avatar123.png' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should update avatar_url and return updated profile', async () => {
    db.query = jest.fn().mockResolvedValue({
      rows: [
        {
          id: 1,
          name: 'User',
          email: 'user@example.com',
          role: 'donor',
          balance: 100,
          verified: true,
          avatar_url: '/uploads/avatars/avatar123.png',
          preferences: {},
        },
      ],
    });
    await authController.uploadUserAvatar(req, res);
    expect(res.json).toHaveBeenCalledWith({
      profile: expect.objectContaining({
        avatar_url: '/uploads/avatars/avatar123.png',
      }),
      avatarUrl: '/uploads/avatars/avatar123.png',
    });
  });

  it('should return 400 if no file uploaded', async () => {
    req.file = undefined;
    await authController.uploadUserAvatar(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'No file uploaded' });
  });

  it('should return 404 if user not found', async () => {
    db.query = jest.fn().mockResolvedValue({ rows: [] });
    await authController.uploadUserAvatar(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should handle database errors', async () => {
    db.query = jest.fn().mockRejectedValue(new Error('DB error'));
    await authController.uploadUserAvatar(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error uploading avatar',
      error: 'DB error',
    });
  });
});
