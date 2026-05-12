import { Request, Response } from 'express';
import gameService from '../services/game.service';

// reusable type
type IdParams = {
  id: string;
};

class GameController {
  // Create game
  async create(req: Request, res: Response): Promise<void> {
    try {
      const gameData = req.body;
      const game = await gameService.createGame(gameData);
      res.status(201).json({
        success: true,
        message: 'Game created successfully',
        data: game,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  // Get game by ID
  async getById(req: Request<IdParams>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const game = await gameService.getGameById(id);
      res.status(200).json({
        success: true,
        data: game,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  // Get all games
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const games = await gameService.getAllGames();
      res.status(200).json({
        success: true,
        data: games,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  // Update game
  async update(req: Request<IdParams>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const gameData = req.body;
      const game = await gameService.updateGame(id, gameData);
      res.status(200).json({
        success: true,
        message: 'Game updated successfully',
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
  async delete(req: Request<IdParams>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
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
  async submitBotGameMoves(req: Request, res: Response): Promise<void> {
  try {
    const { gameId } = req.params;
    const { playerMoves, botMoves, last_move } = req.body;
    
    const game = await gameService.recordBotGameMoves(
      gameId,
      playerMoves,
      botMoves,
      last_move
    );
    
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

export default new GameController();