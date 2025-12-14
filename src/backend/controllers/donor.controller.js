const db = require('../db');
const { validationResult } = require('express-validator');

/**
 * Get donor dashboard statistics
 * Returns total donated, meals funded, and average cost per meal
 */
exports.getDonorStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get total donated from transactions (deposits)
    const totalResult = await db.query(
      `SELECT COALESCE(SUM(amount), 0) as total_donated 
       FROM transactions 
       WHERE user_id = $1 AND type = 'deposit'`,
      [userId]
    );

    // Get completed donations count (represents meals funded)
    const mealsResult = await db.query(
      `SELECT COUNT(*) as meals_funded 
       FROM donations 
       WHERE user_id = $1 AND status = 'completed'`,
      [userId]
    );

    const totalDonated = parseFloat(totalResult.rows[0].total_donated) || 0;
    const mealsFunded = parseInt(mealsResult.rows[0].meals_funded) || 0;
    const avgCostPerMeal =
      mealsFunded > 0 ? (totalDonated / mealsFunded).toFixed(2) : 0;

    res.json({
      totalDonated: parseFloat(totalDonated.toFixed(2)),
      mealsFunded,
      avgCostPerMeal: parseFloat(avgCostPerMeal),
    });
  } catch (error) {
    console.error('Error fetching donor stats:', error);
    res.status(500).json({ message: 'Failed to fetch donor statistics' });
  }
};

/**
 * Get donor transaction history
 * Returns paginated list of deposits and deductions
 */
exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const result = await db.query(
      `SELECT 
        t.id,
        t.type,
        t.amount,
        t.description,
        t.created_at,
        CASE 
          WHEN t.type = 'deposit' THEN 'Completed'
          WHEN t.type = 'deduction' THEN 'Completed'
          ELSE 'Unknown'
        END as status
       FROM transactions t
       WHERE t.user_id = $1
       ORDER BY t.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM transactions WHERE user_id = $1`,
      [userId]
    );

    res.json({
      transactions: result.rows.map((row) => ({
        id: row.id,
        date: row.created_at,
        amount: parseFloat(row.amount),
        recipient: row.description || 'NourishNet Platform',
        status: row.status,
        type: row.type,
      })),
      total: parseInt(countResult.rows[0].total),
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({ message: 'Failed to fetch transaction history' });
  }
};

/**
 * Get donor's completed donations with delivery information
 * Returns donations that have been matched with requests and fulfilled
 */
exports.getDeliveredDonations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const result = await db.query(
      `SELECT 
        d.id as donation_id,
        d.food_type,
        d.quantity,
        d.created_at as donated_at,
        o.id as order_id,
        o.address,
        o.gps_location,
        o.fulfilled_at,
        o.status as order_status,
        u.name as recipient_name
       FROM donations d
       LEFT JOIN orders o ON d.id = o.donation_id
       LEFT JOIN requests r ON o.request_id = r.id
       LEFT JOIN users u ON r.user_id = u.id
       WHERE d.user_id = $1 AND d.status = 'completed'
       ORDER BY o.fulfilled_at DESC NULLS LAST, d.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await db.query(
      `SELECT COUNT(*) as total 
       FROM donations 
       WHERE user_id = $1 AND status = 'completed'`,
      [userId]
    );

    res.json({
      deliveries: result.rows.map((row) => ({
        donationId: row.donation_id,
        orderId: row.order_id,
        foodType: row.food_type,
        quantity: row.quantity,
        donatedAt: row.donated_at,
        deliveredAt: row.fulfilled_at,
        address: row.address,
        gpsLocation: row.gps_location,
        recipientName: row.recipient_name || 'Anonymous',
        status: row.order_status || 'processing',
      })),
      total: parseInt(countResult.rows[0].total),
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching delivered donations:', error);
    res.status(500).json({ message: 'Failed to fetch delivery information' });
  }
};

/**
 * Get feedback from recipients for donor's donations
 * Returns testimonials and ratings
 */
exports.getDonorFeedback = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 10;

    const result = await db.query(
      `SELECT 
        of.id,
        of.rating,
        of.feedback,
        of.created_at,
        u.name as recipient_name,
        o.id as order_id
       FROM order_feedback of
       JOIN orders o ON of.order_id = o.id
       JOIN donations d ON o.donation_id = d.id
       JOIN users u ON of.user_id = u.id
       WHERE d.user_id = $1 AND of.feedback IS NOT NULL
       ORDER BY of.created_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    res.json({
      feedback: result.rows.map((row) => ({
        id: row.id,
        rating: row.rating,
        message: row.feedback,
        recipientName: row.recipient_name,
        orderId: row.order_id,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching donor feedback:', error);
    res.status(500).json({ message: 'Failed to fetch feedback' });
  }
};

/**
 * Process a donation (deposit money)
 * This simulates payment processing and creates a transaction
 */
exports.processDonation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const client = await db.pool.connect();

  try {
    const userId = req.user.userId;
    const { amount, paymentMethod, cardDetails } = req.body;

    await client.query('BEGIN');

    // Simulate payment processing
    // In production, integrate with Stripe, PayPal, or other payment gateway
    const paymentResult = await simulatePaymentProcessing({
      amount,
      paymentMethod,
      cardDetails,
    });

    if (!paymentResult.success) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        message: 'Payment processing failed',
        error: paymentResult.error,
      });
    }

    // Create transaction record
    const transactionResult = await client.query(
      `INSERT INTO transactions (user_id, type, amount, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        userId,
        'deposit',
        amount,
        `Donation via ${paymentMethod} - Transaction ID: ${paymentResult.transactionId}`,
      ]
    );

    // Update user balance
    await client.query(
      `UPDATE users SET balance = balance + $1 WHERE id = $2`,
      [amount, userId]
    );

    // Create a donation record (for now, generic donation)
    await client.query(
      `INSERT INTO donations (user_id, food_type, quantity, status)
       VALUES ($1, $2, $3, $4)`,
      [userId, 'General Donation', Math.floor(amount / 2.5), 'pending']
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Donation successful',
      transaction: {
        id: transactionResult.rows[0].id,
        amount: parseFloat(transactionResult.rows[0].amount),
        description: transactionResult.rows[0].description,
        createdAt: transactionResult.rows[0].created_at,
      },
      paymentDetails: {
        transactionId: paymentResult.transactionId,
        last4: cardDetails?.last4 || '****',
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error processing donation:', error);
    res.status(500).json({ message: 'Failed to process donation' });
  } finally {
    client.release();
  }
};

/**
 * Get current user balance
 */
exports.getBalance = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await db.query(`SELECT balance FROM users WHERE id = $1`, [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      balance: parseFloat(result.rows[0].balance) || 0,
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ message: 'Failed to fetch balance' });
  }
};

/**
 * Simulate payment processing
 * In production, replace with actual payment gateway integration
 */
async function simulatePaymentProcessing({
  amount,
  paymentMethod,
  cardDetails,
}) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Basic validation
  if (amount <= 0) {
    return { success: false, error: 'Invalid amount' };
  }

  if (!paymentMethod) {
    return { success: false, error: 'Payment method required' };
  }

  // Validate card details for card payments
  if (paymentMethod === 'card' && cardDetails) {
    const { cardNumber, expiryMonth, expiryYear, cvv } = cardDetails;

    // Basic card validation
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      return { success: false, error: 'Invalid card number' };
    }

    if (!cvv || cvv.length < 3 || cvv.length > 4) {
      return { success: false, error: 'Invalid CVV' };
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (
      expiryYear < currentYear ||
      (expiryYear === currentYear && expiryMonth < currentMonth)
    ) {
      return { success: false, error: 'Card expired' };
    }
  }

  // Simulate successful payment
  return {
    success: true,
    transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
}
