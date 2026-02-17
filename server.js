const { app, initializeDatabase } = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Start server
const startServer = async () => {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
  });
};

startServer();
