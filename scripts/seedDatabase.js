const sequelize = require('../src/config/database');
const { Driver, Car } = require('../src/models');

const driversData = [
  // Dhaka locations
  {
    driver: { name: 'Rahul Ahmed', email: 'rahul@example.com', phone: '+8801712345601', is_available: true, current_lat: 23.8103, current_lng: 90.4125 },
    car: { model: 'Toyota Axio', plate_number: 'DHA-1234', color: 'Silver', year: 2020 }
  },
  {
    driver: { name: 'Shahid Khan', email: 'shahid@example.com', phone: '+8801712345602', is_available: true, current_lat: 23.8150, current_lng: 90.4200 },
    car: { model: 'Honda Civic', plate_number: 'DHA-5678', color: 'Black', year: 2021 }
  },
  {
    driver: { name: 'Nasir Uddin', email: 'nasir@example.com', phone: '+8801712345603', is_available: true, current_lat: 23.7920, current_lng: 90.4050 },
    car: { model: 'Nissan Sunny', plate_number: 'DHA-9012', color: 'White', year: 2019 }
  },
  {
    driver: { name: 'Farid Hossain', email: 'farid@example.com', phone: '+8801712345604', is_available: true, current_lat: 23.8250, current_lng: 90.3950 },
    car: { model: 'Toyota Corolla', plate_number: 'DHA-3456', color: 'Blue', year: 2022 }
  },
  // Outside 5km radius (for testing)
  {
    driver: { name: 'Kamal Hasan', email: 'kamal@example.com', phone: '+8801712345605', is_available: true, current_lat: 23.9100, current_lng: 90.5125 },
    car: { model: 'Mitsubishi Pajero', plate_number: 'DHA-7890', color: 'Red', year: 2018 }
  },
  {
    driver: { name: 'Jahid Islam', email: 'jahid@example.com', phone: '+8801712345606', is_available: true, current_lat: 23.7500, current_lng: 90.3500 },
    car: { model: 'Suzuki Swift', plate_number: 'DHA-2345', color: 'Gray', year: 2021 }
  },
  {
    driver: { name: 'Mizanur Rahman', email: 'mizan@example.com', phone: '+8801712345607', is_available: true, current_lat: 23.8800, current_lng: 90.3800 },
    car: { model: 'Hyundai Elantra', plate_number: 'DHA-6789', color: 'Silver', year: 2020 }
  },
  {
    driver: { name: 'Shafiqul Islam', email: 'shafiq@example.com', phone: '+8801712345608', is_available: false, current_lat: 23.8200, current_lng: 90.4100 },
    car: { model: 'Toyota Premio', plate_number: 'DHA-0123', color: 'White', year: 2022 }
  }
];

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    console.log('Syncing database models...');
    await sequelize.sync({ force: true });

    console.log('Database synced successfully');

    console.log('Seeding data...');
    for (const data of driversData) {
      const driver = await Driver.create(data.driver);
      await Car.create({
        ...data.car,
        driver_id: driver.id
      });
      console.log(`Created driver: ${driver.name} with car: ${data.car.model}`);
    }

    console.log('Database seeded successfully!');
    
    const driverCount = await Driver.count();
    const carCount = await Car.count();
    console.log(`Total drivers: ${driverCount}, Total cars: ${carCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();