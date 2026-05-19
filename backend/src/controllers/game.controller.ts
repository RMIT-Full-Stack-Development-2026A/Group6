import { Request, Response } from 'express';
import mongoose from 'mongoose';
import gameService, { AlgebraicMove } from '../services/game.service';
import Game from '../models/game.model';

type IdParams = { id: string };
type GameIdParams = { gameId: string };

class GameController {

  async getMyGames(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await gameService.getGamesByPlayer(userId, page, limit);
      res.status(200).json({ success: true, data: result.games, total: result.total });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async getMyStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const oid = new mongoose.Types.ObjectId(userId);

      const completedGames = await Game.find({
        $or: [{ 'players.playerX': oid }, { 'players.playerO': oid }],
        status: 'completed',
      }).lean();

      const modeKeys = ['local', 'online', 'bot'] as const;
      type ModeKey = typeof modeKeys[number];

      const modeCounts: Record<ModeKey, { games: number; wins: number; losses: number; draws: number }> = {
        local:  { games: 0, wins: 0, losses: 0, draws: 0 },
        online: { games: 0, wins: 0, losses: 0, draws: 0 },
        bot:    { games: 0, wins: 0, losses: 0, draws: 0 },
      };

      let totalWins = 0;
      let totalLosses = 0;
      let totalDraws = 0;
      let currentWinStreak = 0;
      let bestWinStreak = 0;
      let currentLossStreak = 0;
      const gridSizeFreq: Record<number, number> = {};

      const sorted = [...completedGames].sort((a, b) => {
        const ta = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const tb = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return ta - tb;
      });

      for (const game of sorted) {
        const mode = (game.gameMode ?? 'local') as ModeKey;
        if (!modeCounts[mode]) continue;

        const isPlayerX = game.players?.playerX?.toString() === userId;
        const isPlayerO = game.players?.playerO?.toString() === userId;
        if (!isPlayerX && !isPlayerO) continue;

        const playerSymbol = isPlayerX ? 'X' : 'O';
        modeCounts[mode].games += 1;

        const gs = game.gridSize ?? 10;
        gridSizeFreq[gs] = (gridSizeFreq[gs] ?? 0) + 1;

        if (game.result === 'draw') {
          totalDraws += 1;
          modeCounts[mode].draws += 1;
          currentWinStreak = 0;
          currentLossStreak = 0;
        } else if (game.result === playerSymbol) {
          totalWins += 1;
          modeCounts[mode].wins += 1;
          currentWinStreak += 1;
          currentLossStreak = 0;
          if (currentWinStreak > bestWinStreak) bestWinStreak = currentWinStreak;
        } else {
          totalLosses += 1;
          modeCounts[mode].losses += 1;
          currentWinStreak = 0;
          currentLossStreak += 1;
        }
      }

      const totalGames = totalWins + totalLosses + totalDraws;
      const winRate = totalGames > 0 ? Number(((totalWins / totalGames) * 100).toFixed(2)) : 0;

      let favoriteGridSize: number | null = null;
      let maxFreq = 0;
      for (const [gs, freq] of Object.entries(gridSizeFreq)) {
        if (freq > maxFreq) {
          maxFreq = freq;
          favoriteGridSize = Number(gs);
        }
      }

      const stats = {
        totalGames,
        wins: totalWins,
        losses: totalLosses,
        draws: totalDraws,
        winRate,
        currentWinStreak,
        bestWinStreak,
        currentLossStreak,
        favoriteGridSize,
        totalPlayTime: 0,
        stats: {
          local: modeCounts.local,
          online: { ...modeCounts.online, ranking: 0 },
          bot: modeCounts.bot,
        },
      };

      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

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
      if (outcome !== 'abandoned' && (!last_move || typeof last_move !== 'string')) {
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