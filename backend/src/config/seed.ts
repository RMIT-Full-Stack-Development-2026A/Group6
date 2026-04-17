import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Subscription from '../models/subscription.model';
import User from '../models/user.model';
import PlayerStats from '../models/playerStats.model';
import UserSubscription from '../models/userSubscription.model';
import Game from '../models/game.model';

dotenv.config();

const seedDatabase = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI as string;

    console.log(' Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log(' Connected to MongoDB');

    // ─── Clear existing data ────────────────────────────────────────
    console.log(' Clearing existing data...');
    await Promise.all([
      Subscription.deleteMany({}),
      UserSubscription.deleteMany({}),
      PlayerStats.deleteMany({}),
      Game.deleteMany({}),
      User.deleteMany({}),
    ]);

    // ─── 1. Seed Subscription Plans ────────────────────────────────
    console.log(' Seeding subscription plans...');
    const [freePlan, premiumPlan] = await Subscription.insertMany([
      {
        name: 'Free',
        description: 'Perfect for casual players who want to enjoy the game',
        price: 0,
        currency: 'USD',
        duration: { value: 1, unit: 'year' },
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
          'Standard board sizes (10x10)',
          'Cloud save support',
        ],
        isActive: true,
        displayOrder: 1,
      },
      {
        name: 'Premium',
        description: 'For serious players who want the ultimate experience',
        price: 10,
        currency: 'USD',
        duration: { value: 1, unit: 'month' },
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
          'All board sizes (10x10 and 15x15)',
          'Advanced AI opponents (Easy, Medium, Hard)',
          'Custom themes and markers',
          'Priority matchmaking',
          'Game replay with Pause/Resume/Forward/Backward',
          'Real-time chat during online matches',
          'Premium support',
        ],
        isActive: true,
        displayOrder: 2,
      },
    ]);
    console.log(`   Created ${2} subscription plans`);

    // ─── 2. Seed Users ──────────────────────────────────────────────
    console.log(' Seeding users...');
    const passwordHash = async (pw: string) => bcrypt.hash(pw, 10);

    // Admin
    const admin = await User.create({
      username: 'admin',
      email: 'admin@tictactoang.com',
      password: await passwordHash('Admin@123'),
      role: 'admin',
      profile: {
        firstName: 'System',
        lastName: 'Admin',
        avatar: '',
        bio: 'TicTacToang Platform Administrator',
        country: 'VN',
      },
      isActive: true,
      isEmailVerified: true,
    });

    // Player A — Premium
    const playerA = await User.create({
      username: 'alice_pro',
      email: 'alice@tictactoang.com',
      password: await passwordHash('Alice@123'),
      role: 'user',
      profile: {
        firstName: 'Alice',
        lastName: 'Nguyen',
        avatar: '',
        bio: 'Competitive TicTacToe player ',
        country: 'VN',
      },
      isActive: true,
      isEmailVerified: true,
    });

    // Player B — Standard (free)
    const playerB = await User.create({
      username: 'bob_standard',
      email: 'bob@tictactoang.com',
      password: await passwordHash('Bob@1234'),
      role: 'user',
      profile: {
        firstName: 'Bob',
        lastName: 'Tran',
        avatar: '',
        bio: 'Just here for fun!',
        country: 'VN',
      },
      isActive: true,
      isEmailVerified: true,
    });

    // Extra deactivated player (for admin demo: req 6.2.1)
    const playerDeactivated = await User.create({
      username: 'charlie_inactive',
      email: 'charlie@tictactoang.com',
      password: await passwordHash('Charlie@123'),
      role: 'user',
      profile: {
        firstName: 'Charlie',
        lastName: 'Le',
        avatar: '',
        bio: '',
        country: 'US',
      },
      isActive: false, // Deactivated account for demo
      isEmailVerified: true,
    });

    console.log('   Created 4 users (admin, playerA premium, playerB standard, 1 deactivated)');

    // ─── 3. Premium Subscription for Player A ──────────────────────
    console.log(' Assigning Premium subscription to Player A...');
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const aliceSub = await UserSubscription.create({
      user: playerA._id,
      subscription: premiumPlan._id,
      status: 'active',
      startDate: now,
      endDate: nextMonth,
      autoRenew: true,
      paymentMethod: 'wallet',
      transactionId: `TXN-ALICE-${Date.now()}`,
    });

    // Link subscription back to user
    await User.findByIdAndUpdate(playerA._id, {
      currentSubscription: aliceSub._id,
    });
    console.log('   Premium subscription active for alice_pro');

    // ─── 4. Seed Game Sessions ──────────────────────────────────────
    console.log(' Seeding game sessions...');

    // Helper to build a completed board (simplified — not a real game sequence)
    const emptyBoard = (size: number) =>
      Array(size).fill(null).map(() => Array(size).fill(null));

    // Game 1: Alice vs Bob (local, Alice wins)
    const game1 = await Game.create({
      gameMode: 'local',
      gridSize: 10,
      players: { playerX: playerA._id, playerO: playerB._id },
      currentTurn: 'O',
      boardState: emptyBoard(10),
      status: 'completed',
      winner: playerA._id,
      result: 'X',
      startedAt: new Date(Date.now() - 3600_000 * 24 * 5), // 5 days ago
      completedAt: new Date(Date.now() - 3600_000 * 24 * 5 + 900_000),
      isRanked: false,
      moves: [
        { player: playerA._id, position: { row: 0, col: 0 }, symbol: 'X', timestamp: new Date() },
        { player: playerB._id, position: { row: 1, col: 1 }, symbol: 'O', timestamp: new Date() },
      ],
    });

    // Game 2: Bob vs AI bot (bot mode, Bob loses)
    const game2 = await Game.create({
      gameMode: 'bot',
      gridSize: 10,
      players: { playerX: playerB._id, playerO: null }, // null = AI
      currentTurn: 'X',
      boardState: emptyBoard(10),
      status: 'completed',
      winner: null,
      result: 'O', // AI wins
      startedAt: new Date(Date.now() - 3600_000 * 24 * 3),
      completedAt: new Date(Date.now() - 3600_000 * 24 * 3 + 600_000),
      isRanked: false,
      moves: [],
    });

    // Game 3: Alice vs Bob (online, draw/abandoned)
    const game3 = await Game.create({
      gameMode: 'online',
      gridSize: 10,
      players: { playerX: playerA._id, playerO: playerB._id },
      currentTurn: 'X',
      boardState: emptyBoard(10),
      status: 'abandoned',
      winner: null,
      result: null,
      roomCode: 'ROOM-DEMO-001',
      startedAt: new Date(Date.now() - 3600_000 * 24 * 2),
      completedAt: new Date(Date.now() - 3600_000 * 24 * 2 + 300_000),
      isRanked: false,
      moves: [],
    });

    // Game 4: Alice vs Bob (local, Bob wins)
    const game4 = await Game.create({
      gameMode: 'local',
      gridSize: 15,
      players: { playerX: playerA._id, playerO: playerB._id },
      currentTurn: 'X',
      boardState: emptyBoard(15),
      status: 'completed',
      winner: playerB._id,
      result: 'O',
      startedAt: new Date(Date.now() - 3600_000 * 24 * 1),
      completedAt: new Date(Date.now() - 3600_000 * 24 * 1 + 1200_000),
      isRanked: false,
      moves: [],
    });

    console.log(`   Created 4 game sessions`);

    // ─── 5. Seed Player Stats ───────────────────────────────────────
    console.log(' Seeding player stats...');

    await PlayerStats.create({
      user: admin._id,
      totalGames: 0,
      wins: 0, losses: 0, draws: 0, winRate: 0,
      stats: {
        local: { games: 0, wins: 0, losses: 0, draws: 0 },
        online: { games: 0, wins: 0, losses: 0, draws: 0, ranking: 0 },
        bot: { games: 0, wins: 0, losses: 0, draws: 0 },
      },
      currentWinStreak: 0, bestWinStreak: 0, currentLossStreak: 0,
      lastPlayed: null,
    });

    await PlayerStats.create({
      user: playerA._id,
      totalGames: 3,
      wins: 1, losses: 1, draws: 1, winRate: 33.33,
      stats: {
        local: { games: 2, wins: 1, losses: 1, draws: 0 },
        online: { games: 1, wins: 0, losses: 0, draws: 1, ranking: 1200 },
        bot: { games: 0, wins: 0, losses: 0, draws: 0 },
      },
      currentWinStreak: 0, bestWinStreak: 1, currentLossStreak: 1,
      favoriteGridSize: 10,
      totalPlayTime: 35,
      lastPlayed: game4.completedAt,
    });

    await PlayerStats.create({
      user: playerB._id,
      totalGames: 4,
      wins: 2, losses: 1, draws: 1, winRate: 50,
      stats: {
        local: { games: 2, wins: 1, losses: 1, draws: 0 },
        online: { games: 1, wins: 0, losses: 0, draws: 1, ranking: 1050 },
        bot: { games: 1, wins: 0, losses: 1, draws: 0 },
      },
      currentWinStreak: 1, bestWinStreak: 1, currentLossStreak: 0,
      favoriteGridSize: 10,
      totalPlayTime: 42,
      lastPlayed: game4.completedAt,
    });

    await PlayerStats.create({
      user: playerDeactivated._id,
      totalGames: 0,
      wins: 0, losses: 0, draws: 0, winRate: 0,
      stats: {
        local: { games: 0, wins: 0, losses: 0, draws: 0 },
        online: { games: 0, wins: 0, losses: 0, draws: 0, ranking: 0 },
        bot: { games: 0, wins: 0, losses: 0, draws: 0 },
      },
      currentWinStreak: 0, bestWinStreak: 0, currentLossStreak: 0,
      lastPlayed: null,
    });

    console.log('  Created player stats for all users');

    // ─── Summary ────────────────────────────────────────────────────
    console.log('\n Database seeding completed!');
    console.log('─────────────────────────────────────────');
    console.log(' DEMO ACCOUNTS:');
    console.log('  Admin    → admin@tictactoang.com     / Admin@123');
    console.log('  Player A → alice@tictactoang.com     / Alice@123  (Premium )');
    console.log('  Player B → bob@tictactoang.com       / Bob@1234   (Free)');
    console.log('  Inactive → charlie@tictactoang.com   / Charlie@123 (Deactivated)');
    console.log('─────────────────────────────────────────');
    console.log(' Game sessions: 4 (1 abandoned, 2 local, 1 bot)');
    console.log(' Subscriptions: Free ($0/yr) + Premium ($10/mo)');
    console.log('─────────────────────────────────────────');

    await mongoose.disconnect();
    console.log(' Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error(' Error seeding database:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();