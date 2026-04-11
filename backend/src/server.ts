import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import userRoutes from './routes/user.routes';
import subscriptionRoutes from './routes/subscription.routes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Database connection
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;