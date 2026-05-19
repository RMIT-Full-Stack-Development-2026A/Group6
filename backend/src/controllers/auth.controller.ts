import { Request, Response } from 'express';
import authService from '../services/auth.service';

class AuthController {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, username, country } = req.body;
      const result = await authService.signup({ email, password, username, country });
      res.status(201).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      res.status(400).json({ message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { usernameOrEmail, identifier, email, username, password } = req.body;
      const loginIdentifier = usernameOrEmail || identifier || email || username;
      const result = await authService.login({ usernameOrEmail: loginIdentifier, password });
      res.status(200).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      res.status(400).json({ message });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

      if (!token) {
        res.status(400).json({ message: 'Authorization header is required for logout' });
        return;
      }

      await authService.logout(token);
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      res.status(400).json({ message });
    }
  }
}

export default new AuthController();
