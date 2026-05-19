import { Request, Response } from 'express';
import gameService, { AlgebraicMove } from '../services/game.service';

type IdParams = { id: string };
type GameIdParams = { gameId: string };

class GameController {


  async create(req: Request, res: Response): Promise<void> {
    try {
      const game = await gameService.createGame(req.body);
      res.status(201).json({ success: true, message: 'Game created successfully', data: game });
    } catch (error) {
      res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'An error occurred' });
    }
  }

  async getById(req: Request<IdParams>, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const game = await gameService.getGameById(id);
      res.status(200).json({
        success: true,
        data: game,
      });
    } catch (error) {
      res.status(404).json({ success: false, message: error instanceof Error ? error.message : 'An error occurred' });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const games = await gameService.getAllGames();
      res.status(200).json({ success: true, data: games });
    } catch (error) {
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'An error occurred' });
    }
  }

  async update(req: Request<IdParams>, res: Response): Promise<void> {
    try {
      // TODO: Add input validation
      const id = String(req.params.id);
      const gameData = req.body;
      const game = await gameService.updateGame(id, gameData);
      res.status(200).json({
        success: true,
        message: 'Bot game moves recorded successfully',
        data: game,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  // Delete game
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const game = await gameService.deleteGame(id);
      res.status(200).json({
        success: true,
        message: 'Game deleted successfully',
        data: game,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  
}

export default new GameController();
