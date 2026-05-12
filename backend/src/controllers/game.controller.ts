import { Request, Response } from 'express';
import gameService, { AlgebraicMove } from '../services/game.service';

type IdParams = { id: string };
type GameIdParams = { gameId: string };

class GameController {
  // ── Generic CRUD ────────────────────────────────────────────────────────────

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
      const game = await gameService.getGameById(req.params.id);
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
      const game = await gameService.updateGame(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Game updated successfully', data: game });
    } catch (error) {
      res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'An error occurred' });
    }
  }

  async delete(req: Request<IdParams>, res: Response): Promise<void> {
    try {
      const game = await gameService.deleteGame(req.params.id);
      res.status(200).json({ success: true, message: 'Game deleted successfully', data: game });
    } catch (error) {
      res.status(404).json({ success: false, message: error instanceof Error ? error.message : 'An error occurred' });
    }
  }

  // ── Bot-game move submission ─────────────────────────────────────────────────

  /**
   * POST /api/games/:gameId/bot-moves
   *
   * Body:
   * {
   *   playerMoves : [{ notation: "c2", row: 7, col: 2 }, ...],
   *   botMoves    : [{ notation: "d3", row: 6, col: 3 }, ...],
   *   last_move   : "c2",
   *   outcome     : "player" | "bot" | "draw" | "abandoned"
   * }
   *
   * `row` and `col` are optional — the service will derive them from `notation`
   * if they are omitted. Including them avoids re-parsing on the server.
   *
   * Algebraic notation follows the chess-king convention used in the SRS:
   *   - Columns: a, b, c … z, aa, ab … (left → right)
   *   - Rows   : 1, 2, 3 …             (bottom → top)
   * So cell (row=9, col=2) on a 10×10 board → "c1" (bottom row).
   */
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

      // Basic payload validation
      if (!Array.isArray(playerMoves) || !Array.isArray(botMoves)) {
        res.status(400).json({
          success: false,
          message: 'playerMoves and botMoves must be arrays',
        });
        return;
      }
      if (!last_move || typeof last_move !== 'string') {
        res.status(400).json({ success: false, message: 'last_move is required' });
        return;
      }

      const game = await gameService.recordBotGameMoves(
        gameId,
        playerMoves,
        botMoves,
        last_move,
        outcome
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
}

export default new GameController();
