const db = require('../db');
const { validationResult } = require('express-validator');

/**
 * Get all pending requests available for providers
 * Shows requests that haven't been accepted yet
 */
exports.getAvailableRequests = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const result = await db.query(
      `SELECT 
        r.id,
        r.food_type,
        r.quantity,
        r.location,
        r.meal_time,
        r.num_children,
        r.phone_number,
        r.dietary_needs,
        r.status,
        r.created_at,
        u.name as requester_name
       FROM requests r
       JOIN users u ON r.user_id = u.id
       WHERE r.status = 'pending'
       ORDER BY r.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM requests WHERE status = 'pending'`
    );

    res.json({
      requests: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching available requests:', error);
    res.status(500).json({ message: 'Failed to fetch available requests' });
  }
};

/**
 * Get provider's accepted and completed orders
 */
exports.getProviderOrders = async (req, res) => {
  try {
    const providerId = req.user.userId;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const status = req.query.status; // optional filter

    let sql = `
      SELECT 
        o.id as order_id,
        o.status as order_status,
        o.fulfilled_at,
        o.created_at as accepted_at,
        r.id as request_id,
        r.food_type,
        r.quantity,
        r.location,
        r.meal_time,
        r.num_children,
        r.phone_number,
        r.dietary_needs,
        u.name as requester_name
      FROM orders o
      JOIN requests r ON o.request_id = r.id
      JOIN users u ON r.user_id = u.id
      WHERE o.provider_id = $1
    `;

    const params = [providerId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      sql += ` AND o.status = $${paramCount}`;
      params.push(status);
    }

    paramCount++;
    sql += ` ORDER BY o.created_at DESC LIMIT $${paramCount}`;
    params.push(limit);

    paramCount++;
    sql += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await db.query(sql, params);

    const countSql = status
      ? `SELECT COUNT(*) as total FROM orders WHERE provider_id = $1 AND status = $2`
      : `SELECT COUNT(*) as total FROM orders WHERE provider_id = $1`;
    const countParams = status ? [providerId, status] : [providerId];
    const countResult = await db.query(countSql, countParams);

    res.json({
      orders: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching provider orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

/**
 * Accept a request (create an order)
 */
exports.acceptRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const client = await db.pool.connect();

  try {
    const providerId = req.user.userId;
    const { requestId, estimatedTime } = req.body;

    await client.query('BEGIN');

    // Check if request exists and is pending
    const requestCheck = await client.query(
      `SELECT * FROM requests WHERE id = $1 AND status = 'pending'`,
      [requestId]
    );

    if (requestCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res
        .status(404)
        .json({ message: 'Request not found or already accepted' });
    }

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (request_id, provider_id, status, estimated_time, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [requestId, providerId, 'processing', estimatedTime]
    );

    // Update request status
    await client.query(
      `UPDATE requests SET status = 'approved' WHERE id = $1`,
      [requestId]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Request accepted successfully',
      order: orderResult.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error accepting request:', error);
    res.status(500).json({ message: 'Failed to accept request' });
  } finally {
    client.release();
  }
};

/**
 * Update order status (preparing, ready, fulfilled)
 */
exports.updateOrderStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const client = await db.pool.connect();

  try {
    const providerId = req.user.userId;
    const { orderId, status, photoUrl } = req.body;

    await client.query('BEGIN');

    // Verify provider owns this order
    const orderCheck = await client.query(
      `SELECT * FROM orders WHERE id = $1 AND provider_id = $2`,
      [orderId, providerId]
    );

    if (orderCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status
    let updateSql = `UPDATE orders SET status = $1`;
    const params = [status, orderId, providerId];

    if (status === 'fulfilled') {
      updateSql += `, fulfilled_at = NOW()`;
    }

    if (photoUrl) {
      updateSql += `, photo_url = $4`;
      params.push(photoUrl);
    }

    updateSql += ` WHERE id = $2 AND provider_id = $3 RETURNING *`;

    const result = await client.query(updateSql, params);

    // Update request status if fulfilled
    if (status === 'fulfilled') {
      await client.query(
        `UPDATE requests SET status = 'fulfilled' WHERE id = $1`,
        [orderCheck.rows[0].request_id]
      );
    }

    await client.query('COMMIT');

    res.json({
      message: 'Order status updated successfully',
      order: result.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  } finally {
    client.release();
  }
};

/**
 * Get provider statistics
 */
exports.getProviderStats = async (req, res) => {
  try {
    const providerId = req.user.userId;

    const stats = await db.query(
      `SELECT 
        COUNT(*) FILTER (WHERE status = 'processing') as active_orders,
        COUNT(*) FILTER (WHERE status = 'fulfilled') as completed_orders,
        COUNT(*) as total_orders
       FROM orders
       WHERE provider_id = $1`,
      [providerId]
    );

    const mealsServed = await db.query(
      `SELECT COALESCE(SUM(r.quantity), 0) as total_meals
       FROM orders o
       JOIN requests r ON o.request_id = r.id
       WHERE o.provider_id = $1 AND o.status = 'fulfilled'`,
      [providerId]
    );

    res.json({
      activeOrders: parseInt(stats.rows[0].active_orders) || 0,
      completedOrders: parseInt(stats.rows[0].completed_orders) || 0,
      totalOrders: parseInt(stats.rows[0].total_orders) || 0,
      mealsServed: parseInt(mealsServed.rows[0].total_meals) || 0,
    });
  } catch (error) {
    console.error('Error fetching provider stats:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
};

/**
 * Cancel an order (before preparation)
 */
exports.cancelOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const client = await db.pool.connect();

  try {
    const providerId = req.user.userId;
    const { orderId, reason } = req.body;

    await client.query('BEGIN');

    // Verify provider owns this order and it's not fulfilled
    const orderCheck = await client.query(
      `SELECT * FROM orders WHERE id = $1 AND provider_id = $2 AND status != 'fulfilled'`,
      [orderId, providerId]
    );

    if (orderCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res
        .status(404)
        .json({ message: 'Order not found or cannot be cancelled' });
    }

    // Update order status to cancelled
    await client.query(
      `UPDATE orders SET status = 'cancelled', cancellation_reason = $1 WHERE id = $2`,
      [reason, orderId]
    );

    // Update request back to pending
    await client.query(`UPDATE requests SET status = 'pending' WHERE id = $1`, [
      orderCheck.rows[0].request_id,
    ]);

    await client.query('COMMIT');

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Failed to cancel order' });
  } finally {
    client.release();
  }
};
