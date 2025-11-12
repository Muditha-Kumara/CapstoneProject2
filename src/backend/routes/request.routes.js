const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const requestController = require('../controllers/request.controller');

// Create food request
router.post(
  '/',
  [
    body('userId').isString().notEmpty(),
    body('foodType').isString().notEmpty(),
    body('quantity').isInt({ min: 1 }),
    body('location').isString().notEmpty(),
    body('mealTime').isString().notEmpty(),
    body('numChildren').isInt({ min: 1 }),
    body('phoneNumber').isString().notEmpty(),
    body('dietaryNeeds').optional().isString(),
  ],
  requestController.createRequest
);

module.exports = router;
