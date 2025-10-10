const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const rateLimit = require('express-rate-limit');
const { authenticateJWT } = require('../middleware/auth');
const multer = require('multer');

const router = express.Router();

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: { message: 'Too many requests, please try again later.' },
});

// Multer configuration for file uploads
const upload = multer({
  dest: 'uploads/avatars/',
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
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

// Update user profile
router.put(
  '/users/profile',
  authenticateJWT,
  [
    body('name').optional().isString().trim().notEmpty().escape(),
    body('email').optional().isEmail().normalizeEmail(),
    body('avatar_url').optional().isString().trim(),
    body('balance').optional().isFloat({ min: 0 }),
  ],
  authController.updateUserProfile
);

// Upload user avatar
router.post(
  '/users/avatar',
  authenticateJWT,
  upload.single('avatar'),
  authController.uploadUserAvatar
);

module.exports = router;
