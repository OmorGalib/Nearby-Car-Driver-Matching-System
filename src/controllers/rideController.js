const { Driver, Car } = require('../models');
const sequelize = require('../config/database');
const { getDistanceQuery } = require('../utils/distanceCalculator');
const { validationResult } = require('express-validator');

const requestRide = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { pickup_lat, pickup_lng, radius_km } = req.body;
    const userId = req.userId;

    // Validate coordinates
    if (pickup_lat < -90 || pickup_lat > 90 || pickup_lng < -180 || pickup_lng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }

    // Execute raw query for better performance with geo calculations
    const distanceQuery = getDistanceQuery(pickup_lat, pickup_lng, radius_km);
    const [nearbyDrivers] = await sequelize.query(distanceQuery);

    // Format the response
    const availableDrivers = nearbyDrivers.map(driver => ({
      driver_id: driver.id,
      driver_name: driver.name,
      car_model: driver.car_model || 'Unknown Model',
      car_color: driver.color,
      car_plate: driver.plate_number,
      distance_km: parseFloat(driver.distance).toFixed(1),
      location: {
        lat: parseFloat(driver.current_lat),
        lng: parseFloat(driver.current_lng)
      }
    }));

    res.json({
      success: true,
      user_id: userId,
      pickup_location: {
        lat: pickup_lat,
        lng: pickup_lng
      },
      radius_km: radius_km,
      total_drivers_found: availableDrivers.length,
      available_drivers: availableDrivers
    });

  } catch (error) {
    console.error('Ride request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const updateDriverLocation = async (req, res) => {
  try {
    const { lat, lng, available } = req.body;
    const driverId = req.driverId; // Assuming driver authentication middleware

    const driver = await Driver.findByPk(driverId);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    await driver.update({
      current_lat: lat,
      current_lng: lng,
      is_available: available !== undefined ? available : driver.is_available,
      last_location_update: new Date()
    });

    res.json({
      success: true,
      message: 'Location updated successfully',
      driver: {
        id: driver.id,
        location: { lat: driver.current_lat, lng: driver.current_lng },
        available: driver.is_available
      }
    });

  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  requestRide,
  updateDriverLocation
};
