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
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      res.status(200).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      res.status(400).json({ message });
    }
  }
}

export default new AuthController();
