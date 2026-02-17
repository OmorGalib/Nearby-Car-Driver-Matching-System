const User = require('./User');
const Driver = require('./Driver');
const Car = require('./Car');

// Associations
Driver.hasOne(Car, {
  foreignKey: 'driver_id',
  as: 'car'
});

Car.belongsTo(Driver, {
  foreignKey: 'driver_id',
  as: 'driver'
});

module.exports = {
  User,
  Driver,
  Car
};
