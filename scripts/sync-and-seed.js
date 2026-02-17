const sequelize = require('../src/config/database');
const { User, Driver, Car } = require('../src/models');

const driversData = [
  {
    driver: { 
      name: 'Rahul Ahmed', 
      email: 'rahul.ahmed@example.com', 
      phone: '+8801712345601', 
      is_available: true, 
      current_lat: 23.8103, 
      current_lng: 90.4125 
    },
    car: { 
      model: 'Toyota Axio', 
      plate_number: 'DHA-1234', 
      color: 'Silver', 
      year: 2020 
    }
  },
  {
    driver: { 
      name: 'Shahid Khan', 
      email: 'shahid.khan@example.com', 
      phone: '+8801712345602', 
      is_available: true, 
      current_lat: 23.8150, 
      current_lng: 90.4200 
    },
    car: { 
      model: 'Honda Civic', 
      plate_number: 'DHA-5678', 
      color: 'Black', 
      year: 2021 
    }
  },
  {
    driver: { 
      name: 'Nasir Uddin', 
      email: 'nasir.uddin@example.com', 
      phone: '+8801712345603', 
      is_available: true, 
      current_lat: 23.7920, 
      current_lng: 90.4050 
    },
    car: { 
      model: 'Nissan Sunny', 
      plate_number: 'DHA-9012', 
      color: 'White', 
      year: 2019 
    }
  },
  {
    driver: { 
      name: 'Farid Hossain', 
      email: 'farid.hossain@example.com', 
      phone: '+8801712345604', 
      is_available: true, 
      current_lat: 23.8250, 
      current_lng: 90.3950 
    },
    car: { 
      model: 'Toyota Corolla', 
      plate_number: 'DHA-3456', 
      color: 'Blue', 
      year: 2022 
    }
  },
  {
    driver: { 
      name: 'Kamal Hasan', 
      email: 'kamal.hasan@example.com', 
      phone: '+8801712345605', 
      is_available: true, 
      current_lat: 23.9100, 
      current_lng: 90.5125 
    },
    car: { 
      model: 'Mitsubishi Pajero', 
      plate_number: 'DHA-7890', 
      color: 'Red', 
      year: 2018 
    }
  },
  {
    driver: { 
      name: 'Jahid Islam', 
      email: 'jahid.islam@example.com', 
      phone: '+8801712345606', 
      is_available: true, 
      current_lat: 23.7500, 
      current_lng: 90.3500 
    },
    car: { 
      model: 'Suzuki Swift', 
      plate_number: 'DHA-2345', 
      color: 'Gray', 
      year: 2021 
    }
  },
  {
    driver: { 
      name: 'Mizanur Rahman', 
      email: 'mizan.rahman@example.com', 
      phone: '+8801712345607', 
      is_available: true, 
      current_lat: 23.8800, 
      current_lng: 90.3800 
    },
    car: { 
      model: 'Hyundai Elantra', 
      plate_number: 'DHA-6789', 
      color: 'Silver', 
      year: 2020 
    }
  },
  {
    driver: { 
      name: 'Shafiqul Islam', 
      email: 'shafiq.islam@example.com', 
      phone: '+8801712345608', 
      is_available: true, 
      current_lat: 23.8200, 
      current_lng: 90.4100 
    },
    car: { 
      model: 'Toyota Premio', 
      plate_number: 'DHA-0123', 
      color: 'White', 
      year: 2022 
    }
  }
];

const syncAndSeed = async () => {
  try {
    console.log('🌍 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    console.log('🔄 Syncing database schema...');
    // Force: false means don't drop tables if they exist
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database schema synced');

    // Check if drivers already exist
    const driverCount = await Driver.count();
    
    if (driverCount === 0) {
      console.log('📦 Seeding database with initial data...');
      
      for (const data of driversData) {
        try {
          const driver = await Driver.create(data.driver);
          await Car.create({
            ...data.car,
            driver_id: driver.id
          });
          console.log(`✅ Created driver: ${driver.name}`);
        } catch (error) {
          console.log(`⚠️ Error creating ${data.driver.name}:`, error.message);
        }
      }
      
      console.log('🎉 Database seeding completed!');
    } else {
      console.log(`ℹ️ Database already has ${driverCount} drivers. Skipping seed.`);
    }

    // Create a test user for authentication
    const userCount = await User.count();
    if (userCount === 0) {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        password: 'password123'
      });
      console.log('✅ Created test user');
    }

    console.log('✨ Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
};

syncAndSeed();