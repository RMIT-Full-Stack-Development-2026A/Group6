import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subscription from '../models/subscription.model';
import User from '../models/user.model';
import PlayerStats from '../models/playerStats.model';
import UserSubscription from '../models/userSubscription.model';
import Game from '../models/game.model';

dotenv.config();

const seedDatabase = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI as string;

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    console.log('Seeding subscription plans...');
    const existingFree = await Subscription.findOne({ name: 'Free' });
    const existingPremium = await Subscription.findOne({ name: 'Premium' });

    let freePlan = existingFree;
    let premiumPlan = existingPremium;

    if (!existingFree) {
      freePlan = await Subscription.create({
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
      });
      console.log('   ✓ Created Free plan');
    } else {
      console.log('   ℹ Free plan already exists, skipping');
    }

    if (!existingPremium) {
      premiumPlan = await Subscription.create({
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
      });
      console.log('   ✓ Created Premium plan');
    } else {
      console.log('   ℹ Premium plan already exists, skipping');
    }

    console.log('Seeding demo users...');

    const existingAdmin = await User.findOne({ email: 'admin@tictactoang.com' });
    let admin = existingAdmin;
    if (!existingAdmin) {
      admin = await User.create({
        username: 'admin',
        email: 'admin@tictactoang.com',
        password: 'Admin@123',
        country: 'VN',
        role: 'admin',
        profile: {
          firstName: 'System',
          lastName: 'Admin',
          avatar: '',
          bio: 'TicTacToang Platform Administrator',
        },
        isActive: true,
        isEmailVerified: true,
      });
      console.log('   ✓ Created admin user');
    } else {
      console.log('   ℹ Admin already exists, skipping');
    }

    const existingPlayerA = await User.findOne({ email: 'alice@tictactoang.com' });
    let playerA = existingPlayerA;
    if (!existingPlayerA) {
      playerA = await User.create({
        username: 'alice_pro',
        email: 'alice@tictactoang.com',
        password: 'Alice@123',
        country: 'VN',
        role: 'player',
        profile: {
          firstName: 'Alice',
          lastName: 'Nguyen',
          avatar: '',
          bio: 'Competitive TicTacToe player',
        },
        isActive: true,
        isEmailVerified: true,
      });
      console.log('   ✓ Created alice_pro user');
    } else {
      console.log('   ℹ alice_pro already exists, skipping');
    }

    const existingPlayerB = await User.findOne({ email: 'bob@tictactoang.com' });
    let playerB = existingPlayerB;
    if (!existingPlayerB) {
      playerB = await User.create({
        username: 'bob_standard',
        email: 'bob@tictactoang.com',
        password: 'Bob@1234',
        country: 'VN',
        role: 'player',
        profile: {
          firstName: 'Bob',
          lastName: 'Tran',
          avatar: '',
          bio: 'Just here for fun!',
        },
        isActive: true,
        isEmailVerified: true,
      });
      console.log('   ✓ Created bob_standard user');
    } else {
      console.log('   ℹ bob_standard already exists, skipping');
    }

    const existingPlayerDeactivated = await User.findOne({ email: 'charlie@tictactoang.com' });
    let playerDeactivated = existingPlayerDeactivated;
    if (!existingPlayerDeactivated) {
      playerDeactivated = await User.create({
        username: 'charlie_inactive',
        email: 'charlie@tictactoang.com',
        password: 'Charlie@123',
        country: 'US',
        role: 'player',
        profile: {
          firstName: 'Charlie',
          lastName: 'Le',
          avatar: '',
          bio: '',
        },
        isActive: false,
        isEmailVerified: true,
      });
      console.log('   ✓ Created charlie_inactive user');
    } else {
      console.log('   ℹ charlie_inactive already exists, skipping');
    }

    if (!admin || !playerA || !playerB || !playerDeactivated) {
      throw new Error('Failed to create or find required users');
    }

    console.log('Checking Premium subscription for Player A...');
    const existingSub = await UserSubscription.findOne({ user: playerA._id });
    if (!existingSub && premiumPlan) {
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

      await User.findByIdAndUpdate(playerA._id, { currentSubscription: aliceSub._id });
      console.log('   ✓ Premium subscription created for alice_pro');
    } else {
      console.log('   ℹ alice_pro already has a subscription, skipping');
    }

    console.log('🎮 Checking demo game sessions...');
    const existingGames = await Game.countDocuments({
      $or: [
        { 'players.playerX': playerA._id },
        { 'players.playerO': playerA._id },
        { 'players.playerX': playerB._id },
        { 'players.playerO': playerB._id },
      ],
    });

    if (existingGames === 0) {
      const emptyBoard = (size: number) =>
        Array(size).fill(null).map(() => Array(size).fill(null));

      await Game.create({
        gameMode: 'local',
        gridSize: 10,
        players: { playerX: playerA._id, playerO: playerB._id },
        currentTurn: 'O',
        boardState: emptyBoard(10),
        status: 'completed',
        winner: playerA._id,
        result: 'X',
        startedAt: new Date(Date.now() - 3600_000 * 24 * 5),
        completedAt: new Date(Date.now() - 3600_000 * 24 * 5 + 900_000),
        isRanked: false,
        moves: [
          { player: playerA._id, position: { row: 0, col: 0 }, symbol: 'X', timestamp: new Date() },
          { player: playerB._id, position: { row: 1, col: 1 }, symbol: 'O', timestamp: new Date() },
        ],
      });

      await Game.create({
        gameMode: 'bot',
        gridSize: 10,
        players: { playerX: playerB._id, playerO: null },
        currentTurn: 'X',
        boardState: emptyBoard(10),
        status: 'completed',
        winner: 'AI',
        result: 'O',
        aiDifficulty: 'medium',
        startedAt: new Date(Date.now() - 3600_000 * 24 * 3),
        completedAt: new Date(Date.now() - 3600_000 * 24 * 3 + 600_000),
        isRanked: false,
        moves: [],
      });

      await Game.create({
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

      await Game.create({
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

      console.log('   ✓ Created 4 demo game sessions');
    } else {
      console.log('   ℹ Demo games already exist, skipping');
    }

    console.log('Checking player stats...');

    const existingAdminStats = await PlayerStats.findOne({ user: admin._id });
    if (!existingAdminStats) {
      await PlayerStats.create({
        user: admin._id,
        totalGames: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        stats: {
          local: { games: 0, wins: 0, losses: 0, draws: 0 },
          online: { games: 0, wins: 0, losses: 0, draws: 0, ranking: 0 },
          bot: { games: 0, wins: 0, losses: 0, draws: 0 },
        },
        currentWinStreak: 0,
        bestWinStreak: 0,
        currentLossStreak: 0,
        lastPlayed: null,
      });
      console.log('✓ Created stats for admin');
    }

    const existingPlayerAStats = await PlayerStats.findOne({ user: playerA._id });
    if (!existingPlayerAStats) {
      const game4CompletedAt = await Game.findOne({
        'players.playerX': playerA._id,
        status: 'completed',
      })
        .sort({ completedAt: -1 })
        .select('completedAt')
        .lean();

      await PlayerStats.create({
        user: playerA._id,
        totalGames: 3,
        wins: 1,
        losses: 1,
        draws: 1,
        winRate: 33.33,
        stats: {
          local: { games: 2, wins: 1, losses: 1, draws: 0 },
          online: { games: 1, wins: 0, losses: 0, draws: 1, ranking: 1200 },
          bot: { games: 0, wins: 0, losses: 0, draws: 0 },
        },
        currentWinStreak: 0,
        bestWinStreak: 1,
        currentLossStreak: 1,
        favoriteGridSize: 10,
        totalPlayTime: 35,
        lastPlayed: game4CompletedAt?.completedAt || null,
      });
      console.log('   ✓ Created stats for alice_pro');
    }

    const existingPlayerBStats = await PlayerStats.findOne({ user: playerB._id });
    if (!existingPlayerBStats) {
      const game4CompletedAt = await Game.findOne({
        'players.playerO': playerB._id,
        status: 'completed',
      })
        .sort({ completedAt: -1 })
        .select('completedAt')
        .lean();

      await PlayerStats.create({
        user: playerB._id,
        totalGames: 4,
        wins: 2,
        losses: 1,
        draws: 1,
        winRate: 50,
        stats: {
          local: { games: 2, wins: 1, losses: 1, draws: 0 },
          online: { games: 1, wins: 0, losses: 0, draws: 1, ranking: 1050 },
          bot: { games: 1, wins: 0, losses: 1, draws: 0 },
        },
        currentWinStreak: 1,
        bestWinStreak: 1,
        currentLossStreak: 0,
        favoriteGridSize: 10,
        totalPlayTime: 42,
        lastPlayed: game4CompletedAt?.completedAt || null,
      });
      console.log('   ✓ Created stats for bob_standard');
    }

    const existingPlayerDeactivatedStats = await PlayerStats.findOne({
      user: playerDeactivated._id,
    });
    if (!existingPlayerDeactivatedStats) {
      await PlayerStats.create({
        user: playerDeactivated._id,
        totalGames: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        stats: {
          local: { games: 0, wins: 0, losses: 0, draws: 0 },
          online: { games: 0, wins: 0, losses: 0, draws: 0, ranking: 0 },
          bot: { games: 0, wins: 0, losses: 0, draws: 0 },
        },
        currentWinStreak: 0,
        bestWinStreak: 0,
        currentLossStreak: 0,
        lastPlayed: null,
      });
      console.log('   ✓ Created stats for charlie_inactive');
    }

    console.log('\n✅ Database seeding completed!');
    console.log('─────────────────────────────────────────');
    console.log('DEMO ACCOUNTS:');
    console.log('  Admin    → admin@tictactoang.com     / Admin@123');
    console.log('  Player A → alice@tictactoang.com     / Alice@123  (Premium)');
    console.log('  Player B → bob@tictactoang.com       / Bob@1234   (Free)');
    console.log('  Inactive → charlie@tictactoang.com   / Charlie@123 (Deactivated)');
    console.log('─────────────────────────────────────────');
    console.log('Subscriptions: Free ($0/yr) + Premium ($10/mo)');
    console.log('─────────────────────────────────────────');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();