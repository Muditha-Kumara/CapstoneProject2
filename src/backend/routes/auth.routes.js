const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Registration route
router.post(
  '/register',
  [
    body('name').isString().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('role').isIn(['donor', 'recipient', 'provider', 'admin'])
  ],
  authController.register
);

// Email verification route
router.get('/verify-email', authController.verifyEmail);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').isString().notEmpty()
  ],
  authController.login
);

module.exports = router;
