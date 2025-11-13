const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: { message: 'Too many requests, please try again later.' },
});

// Registration route
router.post(
  '/register',
  authLimiter,
  [
    body('name').isString().notEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).trim().escape(),
    body('role').isIn(['donor', 'recipient', 'provider', 'admin']),
  ],
  authController.register
);

// Email verification route
router.get('/verify-email', authLimiter, authController.verifyEmail);

// Login route
router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().notEmpty().trim().escape(),
  ],
  authController.login
);

// Logout route
router.post('/logout', authLimiter, authController.logout);

// Password reset request
router.post(
  '/reset-password',
  authLimiter,
  [body('email').isEmail().normalizeEmail()],
  authController.requestPasswordReset
);
// Password reset confirmation
router.post(
  '/reset-password/confirm',
  authLimiter,
  [
    body('token').isString().notEmpty().trim().escape(),
    body('password').isLength({ min: 8 }).trim().escape(),
  ],
  authController.resetPassword
);

// Token refresh route
router.post('/refresh-token', authLimiter, authController.refreshToken);

module.exports = router;
