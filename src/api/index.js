const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Express app
const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(express.json());

// Simple in-memory health check (no DB required)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Nearby Driver Matching API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      docs: '/api-docs',
      auth: '/api/auth/*',
      ride: '/api/ride/*'
    }
  });
});

// Health check endpoint (no DB required)
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Test database endpoint
app.get('/test-db', async (req, res) => {
  try {
    const sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false
    });
    
    await sequelize.authenticate();
    
    res.json({
      success: true,
      message: 'Database connected successfully',
      database: process.env.DATABASE_URL ? 'URL configured' : 'No URL'
    });
    
    await sequelize.close();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Import your main app after basic routes
try {
  const mainApp = require('../src/app');
  
  // Mount your main app under /api
  app.use('/api', mainApp);
  
  // Also mount swagger docs
  try {
    const swaggerUi = require('swagger-ui-express');
    const swaggerJsdoc = require('swagger-jsdoc');
    
    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Nearby Car & Driver Matching API',
          version: '1.0.0',
        },
      },
      apis: ['./src/routes/*.js'],
    };
    
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  } catch (swaggerError) {
    console.log('Swagger not available:', swaggerError.message);
  }
  
} catch (error) {
  console.log('Main app not loaded:', error.message);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method,
    availableEndpoints: [
      '/',
      '/health',
      '/test-db',
      '/api-docs',
      '/api/auth/register',
      '/api/auth/login',
      '/api/ride/request'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Export for Vercel
module.exports = app;