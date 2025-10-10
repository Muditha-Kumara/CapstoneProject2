const db = require('../db');
const authController = require('../controllers/auth.controller');
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));
const { validationResult } = require('express-validator');

describe('PUT /api/users/preferences', () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 1 }, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
  });

  it('should update preferences and return updated preferences', async () => {
    req.body = { preferences: { theme: 'light', notifications: false } };
    db.query = jest.fn().mockResolvedValue({
      rows: [{ preferences: { theme: 'light', notifications: false } }],
    });
    await authController.updateUserPreferences(req, res);
    expect(res.json).toHaveBeenCalledWith({
      preferences: { theme: 'light', notifications: false },
    });
  });

  it('should return 400 if preferences is not provided', async () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: 'Preferences required' }],
    });
    req.body = {};
    await authController.updateUserPreferences(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: expect.any(Array) });
  });

  it('should return 404 if user not found', async () => {
    req.body = { preferences: { theme: 'dark' } };
    db.query = jest.fn().mockResolvedValue({ rows: [] });
    await authController.updateUserPreferences(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should handle database errors', async () => {
    req.body = { preferences: { theme: 'dark' } };
    db.query = jest.fn().mockRejectedValue(new Error('DB error'));
    await authController.updateUserPreferences(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error updating preferences',
      error: 'DB error',
    });
  });
});
