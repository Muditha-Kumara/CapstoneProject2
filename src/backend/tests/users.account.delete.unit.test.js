const db = require('../db');
const authController = require('../controllers/auth.controller');

describe('DELETE /api/users/account', () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should soft delete user account and return success message', async () => {
    db.query = jest.fn().mockResolvedValue({ rows: [{ id: 1 }] });
    await authController.deleteUserAccount(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Account deleted successfully',
    });
  });

  it('should return 404 if user not found or already deleted', async () => {
    db.query = jest.fn().mockResolvedValue({ rows: [] });
    await authController.deleteUserAccount(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User not found or already deleted',
    });
  });

  it('should handle database errors', async () => {
    db.query = jest.fn().mockRejectedValue(new Error('DB error'));
    await authController.deleteUserAccount(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error deleting account',
      error: 'DB error',
    });
  });
});
