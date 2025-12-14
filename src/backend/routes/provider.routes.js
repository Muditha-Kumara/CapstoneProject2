const express = require('express');
const { body } = require('express-validator');
const providerController = require('../controllers/provider.controller');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiter for provider endpoints
const providerLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per minute
  message: { message: 'Too many requests, please try again later.' },
});

// All routes require authentication and provider role
router.use(authenticateJWT);
router.use(authorizeRoles('provider', 'admin'));

/**
 * GET /provider/requests
 * Get all available pending requests
 */
router.get(
  '/requests',
  providerLimiter,
  providerController.getAvailableRequests
);

/**
 * GET /provider/orders
 * Get provider's orders
 * Query params: limit, offset, status (optional)
 */
router.get('/orders', providerLimiter, providerController.getProviderOrders);

/**
 * GET /provider/stats
 * Get provider statistics
 */
router.get('/stats', providerLimiter, providerController.getProviderStats);

/**
 * POST /provider/accept
 * Accept a request (create order)
 */
router.post(
  '/accept',
  providerLimiter,
  [
    body('requestId').isUUID().withMessage('Valid request ID required'),
    body('estimatedTime').optional().isString(),
  ],
  providerController.acceptRequest
);

/**
 * PUT /provider/order/status
 * Update order status
 */
router.put(
  '/order/status',
  providerLimiter,
  [
    body('orderId').isUUID().withMessage('Valid order ID required'),
    body('status')
      .isIn(['processing', 'preparing', 'ready', 'fulfilled'])
      .withMessage('Invalid status'),
    body('photoUrl').optional().isURL().withMessage('Valid photo URL required'),
  ],
  providerController.updateOrderStatus
);

/**
 * POST /provider/order/cancel
 * Cancel an order
 */
router.post(
  '/order/cancel',
  providerLimiter,
  [
    body('orderId').isUUID().withMessage('Valid order ID required'),
    body('reason').optional().isString(),
  ],
  providerController.cancelOrder
);

module.exports = router;
