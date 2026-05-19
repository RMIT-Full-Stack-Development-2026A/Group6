import { Request, Response } from 'express';
import gameService, { AlgebraicMove } from '../services/game.service';

type IdParams = { id: string };
type GameIdParams = { gameId: string };

class GameController {

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ?? null;
      const gameData = {
        ...req.body,
        players: {
          ...req.body.players,
          playerX: userId,
          playerO: null,
        },
        status: 'in-progress',
        startedAt: new Date(),
      };
      const game = await gameService.createGame(gameData);
      res.status(201).json({ success: true, message: 'Game created successfully', data: game });
    } catch (error) {
      res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'An error occurred' });
    }
  }

  async getById(req: Request<IdParams>, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const game = await gameService.getGameById(id);
      res.status(200).json({ success: true, data: game });
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
      const id = String(req.params.id);
      const gameData = req.body;
      const game = await gameService.updateGame(id, gameData);
      res.status(200).json({ success: true, message: 'Game updated successfully', data: game });
    } catch (error) {
      res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'An error occurred' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const game = await gameService.deleteGame(id);
      res.status(200).json({ success: true, message: 'Game deleted successfully', data: game });
    } catch (error) {
      res.status(404).json({ success: false, message: error instanceof Error ? error.message : 'An error occurred' });
    }
  }

  async submitBotGameMoves(req: Request<GameIdParams>, res: Response): Promise<void> {
    try {
      const { gameId } = req.params;
      const {
        playerMoves,
        botMoves,
        last_move,
        outcome = 'abandoned',
      } = req.body as {
        playerMoves: AlgebraicMove[];
        botMoves: AlgebraicMove[];
        last_move: string;
        outcome?: 'player' | 'bot' | 'draw' | 'abandoned';
      };

      if (!Array.isArray(playerMoves) || !Array.isArray(botMoves)) {
        res.status(400).json({ success: false, message: 'playerMoves and botMoves must be arrays' });
        return;
      }
      if (!last_move || typeof last_move !== 'string') {
        res.status(400).json({ success: false, message: 'last_move is required' });
        return;
      }

      const game = await gameService.recordBotGameMoves(gameId, playerMoves, botMoves, last_move, outcome);
      res.status(200).json({ success: true, message: 'Bot game moves recorded successfully', data: game });
    } catch (error) {
      res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'An error occurred' });
    }
  }
}

export default new GameController();