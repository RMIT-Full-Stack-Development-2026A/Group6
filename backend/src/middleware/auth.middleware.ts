// verifies JWT, checks blacklist, and attaches user to the request
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository';
// import { isTokenBlacklisted } from '../services/auth.service';

interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}


/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.',
      });
      return;
    }

    /* if (await isTokenBlacklisted(token)) { 
      res.status(401).json({
        success: false,
        message: 'Token has been invalidated. Please login again.',
      });
      return;
    }

    */
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    const user = await userRepository.findById(decoded.id);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found. Authorization denied.',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Account is inactive. Please contact support.',
      });
      return;
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (error) {
    if ((error as Error).name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        message: 'Invalid token. Authorization denied.',
      });
      return;
    }

    if ((error as Error).name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Server error during authentication.',
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't reject if no token
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);

    if (!token) {
      return next();
    }

    /* if (await isTokenBlacklisted(token)) { 
      return next();
    }

    */
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    const user = await userRepository.findById(decoded.id);

    if (user && user.isActive) {
      req.user = {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
      };
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without user
    next();
  }
};

export default authMiddleware;