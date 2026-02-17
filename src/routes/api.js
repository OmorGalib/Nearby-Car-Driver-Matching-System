const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authenticate = require('../middleware/auth');
const { requestRide, updateDriverLocation } = require('../controllers/rideController');
const { register, login } = require('../controllers/authController');

// Validation rules
const rideRequestValidation = [
  body('pickup_lat').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('pickup_lng').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('radius_km').isFloat({ min: 0.1, max: 100 }).withMessage('Radius must be between 0.1 and 100 km')
];

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').matches(/^[0-9+\-\s()]+$/).withMessage('Valid phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Auth routes
router.post('/auth/register', registerValidation, register);
router.post('/auth/login', loginValidation, login);

// Protected routes
router.post('/ride/request', authenticate, rideRequestValidation, requestRide);
router.put('/driver/location', authenticate, updateDriverLocation);

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
