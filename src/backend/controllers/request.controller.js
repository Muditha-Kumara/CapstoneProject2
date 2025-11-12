const { v4: uuidv4 } = require('uuid');
const db = require('../db');

exports.createRequest = async (req, res) => {
  try {
    const {
      userId,
      foodType,
      quantity,
      location,
      mealTime,
      numChildren,
      phoneNumber,
      dietaryNeeds,
    } = req.body;
    const id = uuidv4();
    const status = 'pending';
    const createdAt = new Date().toISOString();
    const sql = `INSERT INTO requests (
      id, user_id, food_type, quantity, location, meal_time, num_children, phone_number, dietary_needs, status, created_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`;
    const params = [
      id,
      userId,
      foodType,
      quantity,
      location,
      mealTime,
      numChildren,
      phoneNumber,
      dietaryNeeds || '',
      status,
      createdAt,
    ];
    const result = await db.query(sql, params);
    res.status(201).json({ message: 'Request created', data: result.rows[0] });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to create request', error: err.message });
  }
};
