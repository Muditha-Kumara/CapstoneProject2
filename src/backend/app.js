// Express app with Swagger UI best practice setup
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Load OpenAPI spec
const swaggerDocument = YAML.load(path.join(__dirname, '../../docs/openapi.yaml'));

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
