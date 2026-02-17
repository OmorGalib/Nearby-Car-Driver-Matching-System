const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Car = sequelize.define('Car', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  driver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'Drivers',
      key: 'id'
    }
  },
  model: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  plate_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  color: {
    type: DataTypes.STRING(30)
  },
  year: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1900,
      max: new Date().getFullYear() + 1
    }
  }
}, {
  timestamps: true
});

module.exports = Car;
