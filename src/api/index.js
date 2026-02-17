const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Sequelize } = require('sequelize');

const app = express();

// Basic middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Nearby Driver Matching API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api_health: '/api/health',
      docs: '/api-docs',
      register: '/api/auth/register',
      login: '/api/auth/login',
      ride_request: '/api/ride/request'
    }
  });
});

// Simple health check (no DB required)
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is operational',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    const sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false }
      },
      logging: false
    });
    
    await sequelize.authenticate();
    await sequelize.close();
    
    res.json({
      success: true,
      message: '✅ Database connected successfully',
      database_url: process.env.DATABASE_URL ? 'Configured' : 'Missing'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Database connection failed',
      error: error.message
    });
  }
});

// Import and use the main app for API routes
try {
  const mainApp = require('../src/app');
  app.use('/api', mainApp);
  app.use('/api-docs', mainApp);
} catch (error) {
  console.log('Main app not loaded:', error.message);
  
  // Fallback API routes
  app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'API fallback working' });
  });
  
  app.post('/api/auth/register', (req, res) => {
    res.json({ success: true, message: 'Register endpoint (fallback)' });
  });
  
  app.post('/api/auth/login', (req, res) => {
    res.json({ success: true, message: 'Login endpoint (fallback)' });
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

module.exports = app;