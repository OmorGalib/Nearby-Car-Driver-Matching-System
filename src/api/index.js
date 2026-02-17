const app = require('../src/app');
const sequelize = require('../src/config/database');

// Export the Express app for Vercel
module.exports = async (req, res) => {
  try {
    // Ensure database connection is established
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    // Handle the request with your Express app
    return app(req, res);
  } catch (error) {
    console.error('Database connection failed:', error);
    
    // Return a graceful error response
    res.status(500).json({
      success: false,
      message: 'Service temporarily unavailable',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};