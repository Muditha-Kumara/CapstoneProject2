const express = require('express');
const { body } = require('express-validator');
const donorController = require('../controllers/donor.controller');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiter for donor endpoints
const donorLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per minute
  message: { message: 'Too many requests, please try again later.' },
});

// Rate limiter for payment processing (stricter)
const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 payment attempts per minute
  message: { message: 'Too many payment attempts, please try again later.' },
});

// All routes require authentication and donor role
router.use(authenticateJWT);
router.use(authorizeRoles('donor', 'admin'));

/**
 * GET /donor/stats
 * Get donor dashboard statistics
 */
router.get('/stats', donorLimiter, donorController.getDonorStats);

/**
 * GET /donor/transactions
 * Get transaction history with pagination
 * Query params: limit (default: 20), offset (default: 0)
 */
router.get(
  '/transactions',
  donorLimiter,
  donorController.getTransactionHistory
);

/**
 * GET /donor/deliveries
 * Get delivered donations with location tracking
 * Query params: limit (default: 20), offset (default: 0)
 */
router.get('/deliveries', donorLimiter, donorController.getDeliveredDonations);

/**
 * GET /donor/feedback
 * Get feedback from recipients
 * Query params: limit (default: 10)
 */
router.get('/feedback', donorLimiter, donorController.getDonorFeedback);

/**
 * GET /donor/balance
 * Get current account balance
 */
router.get('/balance', donorLimiter, donorController.getBalance);

/**
 * POST /donor/donate
 * Process a donation (payment)
 */
router.post(
  '/donate',
  paymentLimiter,
  [
    body('amount')
      .isFloat({ min: 1 })
      .withMessage('Amount must be at least $1'),
    body('paymentMethod')
      .isIn(['card', 'paypal', 'bank_transfer'])
      .withMessage('Invalid payment method'),
    body('cardDetails')
      .optional()
      .isObject()
      .withMessage('Card details must be an object'),
    body('cardDetails.cardNumber')
      .optional()
      .isString()
      .matches(/^\d{13,19}$/)
      .withMessage('Invalid card number'),
    body('cardDetails.cardholderName')
      .optional()
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Cardholder name is required'),
    body('cardDetails.expiryMonth')
      .optional()
      .isInt({ min: 1, max: 12 })
      .withMessage('Invalid expiry month'),
    body('cardDetails.expiryYear')
      .optional()
      .isInt({ min: new Date().getFullYear() })
      .withMessage('Invalid expiry year'),
    body('cardDetails.cvv')
      .optional()
      .isString()
      .matches(/^\d{3,4}$/)
      .withMessage('Invalid CVV'),
  ],
  donorController.processDonation
);

module.exports = router;
