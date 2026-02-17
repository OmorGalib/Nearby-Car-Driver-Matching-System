// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const swaggerUi = require('swagger-ui-express');
// const swaggerJsdoc = require('swagger-jsdoc');
// const sequelize = require('./config/database');
// const apiRoutes = require('./routes/api');
// require('dotenv').config();

// const app = express();

// // Security middleware
// app.use(helmet({
//   contentSecurityPolicy: false, // Disable CSP for Swagger UI
// }));
// app.use(cors());

// // Body parsing middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Request logging middleware (for debugging)
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.path}`);
//   next();
// });

// // Swagger configuration
// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Nearby Car & Driver Matching API',
//       version: '1.0.0',
//       description: 'API for finding nearby available drivers',
//     },
//     servers: [
//       {
//         url: process.env.NODE_ENV === 'production' 
//           ? 'https://nearby-car-driver-matching-system.vercel.app/api' 
//           : 'http://localhost:3000/api',
//       },
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: 'http',
//           scheme: 'bearer',
//           bearerFormat: 'JWT',
//         },
//       },
//     },
//   },
//   apis: ['./src/routes/*.js', './src/models/*.js'],
// };

// const swaggerSpec = swaggerJsdoc(swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // Health check endpoint (root level)
// app.get('/health', (req, res) => {
//   res.json({ 
//     success: true, 
//     message: 'API is running',
//     environment: process.env.NODE_ENV,
//     timestamp: new Date().toISOString()
//   });
// });

// app.get('/api/health', (req, res) => {
//   res.json({ 
//     success: true, 
//     message: 'API is running',
//     environment: process.env.NODE_ENV,
//     timestamp: new Date().toISOString()
//   });
// });

// // API Routes
// app.use('/api', apiRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Error:', err.stack);
//   res.status(500).json({
//     success: false,
//     message: 'Something went wrong!',
//     error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found'
//   });
// });

// // Database connection function (not auto-connected)
// const initializeDatabase = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('✅ Database connected successfully');
    
//     if (process.env.NODE_ENV === 'development') {
//       await sequelize.sync({ alter: true });
//       console.log('✅ Database synced');
//     }
//   } catch (error) {
//     console.error('❌ Unable to connect to database:', error);
//   }
// };

// // For local development
// if (process.env.NODE_ENV !== 'production') {
//   initializeDatabase();
// }

// module.exports = app;
const express = require('express');
const apiRoutes = require('./routes/api');

const router = express.Router();

// Mount API routes
router.use('/', apiRoutes);

// Health check for API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;