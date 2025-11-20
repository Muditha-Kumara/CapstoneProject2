// Express app with Swagger UI best practice setup
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

// CORS middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Load OpenAPI spec
const swaggerDocument = YAML.load(
  path.join(__dirname, '../../docs/openapi.yaml')
);

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Authentication routes
const authRoutes = require('./routes/auth.routes');
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRoutes);

// Protected routes
const protectedRoutes = require('./routes/protected.routes');
app.use('/protected', protectedRoutes);

// Request routes
const requestRoutes = require('./routes/request.routes');
app.use('/requests', requestRoutes);

// Donor routes
const donorRoutes = require('./routes/donor.routes');
app.use('/donor', donorRoutes);

module.exports = app;
