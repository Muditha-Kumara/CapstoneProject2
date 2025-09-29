// Express app with Swagger UI best practice setup
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Load OpenAPI spec
const swaggerDocument = YAML.load(path.join(__dirname, '../../docs/openapi.yaml'));

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Authentication routes
const authRoutes = require('./routes/auth.routes');
app.use(express.json());
app.use('/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
