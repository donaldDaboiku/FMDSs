// scripts/seedUsers.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check if MONGODB_URI is set
if (!process.env.MONGODB_URI) {
  console.error(' MONGODB_URI is not defined in .env file');
  process.exit(1);
}

console.log(' MongoDB URI:', process.env.MONGODB_URI);

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' Connected to MongoDB');
    
    // Clear existing demo users
    await User.deleteMany({ 
      email: { $in: ['admin@fmds.com', 'user@fmds.com'] } 
    });
    
    console.log(' Cleared existing demo users');
    
    // Create demo admin
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@fmds.com',
      password: 'password123',
      role: 'admin'
    });
    
    // Create demo user
    const user = await User.create({
      name: 'Demo User',
      email: 'user@fmds.com', 
      password: 'password123',
      role: 'user'
    });
    
    console.log(' Demo users created successfully!');
    console.log(' Admin: admin@fmds.com / password123');
    console.log(' User: user@fmds.com / password123');
    console.log(' You can now login with these credentials!');
    
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error(' Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();