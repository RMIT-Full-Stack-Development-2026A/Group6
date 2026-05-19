import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/user.routes';
import subscriptionRoutes from './routes/subscription.routes';
import authRoutes from './routes/auth.routes';
import paymentRoutes from './routes/payment.routes';
import botsRoutes from './routes/bots.routes';

import connectDB from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/avatars', express.static(path.join(__dirname, '../public/avatars')));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/bots', botsRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

app.get('/api/db-status', (_req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    database: 'MongoDB',
    connected: isConnected,
    status: isConnected ? 'Connected' : 'Disconnected',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;