import { Request, Response, NextFunction } from 'express';
import userRepository from '../repositories/user.repository';

// Blocks access when user does not hold an active premium subscription
const premiumMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return;
  }

  const user = await userRepository.findById(req.user.id);

  if (!user) {
    res.status(401).json({ success: false, message: 'User not found.' });
    return;
  }

  const isPremium =
    user.subscription === true &&
    user.subscriptionExpires !== null &&
    new Date() < new Date(user.subscriptionExpires);

  if (!isPremium) {
    res.status(403).json({
      success: false,
      message: 'Premium subscription required to access this feature.',
    });
    return;
  }

  next();
};

export default premiumMiddleware;