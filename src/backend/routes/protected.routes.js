const express = require('express');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Example: Only admin can access this route
router.get('/admin-only', authenticateJWT, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome, admin!', user: req.user });
});

// Example: Any authenticated user can access this route
router.get('/me', authenticateJWT, (req, res) => {
  res.json({ message: 'This is your profile', user: req.user });
});

module.exports = router;
