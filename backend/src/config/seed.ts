import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subscription from '../models/subscription.model';
import User from '../models/user.model';
import PlayerStats from '../models/playerStats.model';

dotenv.config();

const seedDatabase = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI as string;
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out in production)
    console.log('Clearing existing data...');
    await Subscription.deleteMany({});
    // await User.deleteMany({}); // Uncomment to clear users
    // await PlayerStats.deleteMany({}); // Uncomment to clear stats

    // Seed Subscriptions
    console.log('Seeding subscriptions...');
    const subscriptions = [
      {
        name: 'Free',
        description: 'Perfect for casual players who want to enjoy the game',
        price: 0,
        currency: 'USD',
        duration: {
          value: 1,
          unit: 'year',
        },
        features: {
          maxGames: null,
          multiplayerAccess: true,
          premiumSupport: false,
          adFree: false,
          customThemes: false,
          priorityAccess: false,
          cloudSave: true,
        },
        benefits: [
          'Unlimited local games',
          'Basic online matches',
          'Standard board sizes (3x3, 5x5)',
          'Cloud save support',
        ],
        isActive: true,
        displayOrder: 1,
      },
      {
        name: 'Premium',
        description: 'For serious players who want the ultimate experience',
        price: 9.99,
        currency: 'USD',
        duration: {
          value: 1,
          unit: 'month',
        },
        features: {
          maxGames: null,
          multiplayerAccess: true,
          premiumSupport: true,
          adFree: true,
          customThemes: true,
          priorityAccess: true,
          cloudSave: true,
        },
        benefits: [
          'Ad-free experience',
          'All board sizes (3x3 to 20x20)',
          'Advanced AI opponents',
          'Custom themes and avatars',
          'Priority matchmaking',
          'Detailed statistics and analytics',
          'Premium support',
          'Ranked competitive play',
        ],
        isActive: true,
        displayOrder: 2,
      },
    ];

    const createdSubscriptions = await Subscription.insertMany(subscriptions);
    console.log(`Created ${createdSubscriptions.length} subscriptions`);

    // Create sample admin user (optional)
    console.log('Creating admin user...');
    const adminExists = await User.findOne({ email: 'admin@tictactoe.com' });
    
    if (!adminExists) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const admin = await User.create({
        username: 'admin',
        email: 'admin@tictactoe.com',
        password: hashedPassword,
        role: 'admin',
        profile: {
          firstName: 'Admin',
          lastName: 'User',
          avatar: '',
          bio: 'System Administrator',
        },
        isEmailVerified: true,
        isActive: true,
      });

      // Create stats for admin
      await PlayerStats.create({
        user: admin._id,
      });

      console.log('Admin user created (email: admin@tictactoe.com, password: admin123)');
    } else {
      console.log('ℹAdmin user already exists');
    }

    console.log(' Database seeding completed successfully!');
    console.log('\n Summary:');
    console.log(`  - Subscriptions: ${createdSubscriptions.length}`);
    console.log(`  - Free tier: $0/year`);
    console.log(`  - Premium tier: $9.99/month`);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run seeder
seedDatabase();