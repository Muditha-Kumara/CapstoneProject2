const e = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify JWT and attach user to req
exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: err.message + ' ' + authHeader });
    req.user = user;
    next();
  });
};

// Middleware to check for required roles
exports.authorizeRoles =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
