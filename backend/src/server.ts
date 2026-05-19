import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import userRoutes from './routes/user.routes';
import subscriptionRoutes from './routes/subscription.routes';
import authRoutes from './routes/auth.routes';
import paymentRoutes from './routes/payment.routes';
import botsRoutes from './routes/bots.routes';
import gameRoutes from './routes/game.routes';

// Database connection
import connectDB from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/avatars', express.static(path.join(__dirname, '../public/avatars')));

// Connect to database
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/bots', botsRoutes);
app.use('/api/games', gameRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Database status check
app.get('/api/db-status', (_req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({ 
    database: 'MongoDB', 
    connected: isConnected, 
    status: isConnected ? 'Connected' : 'Disconnected' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;