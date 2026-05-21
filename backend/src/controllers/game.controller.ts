import { Request, Response } from 'express';
import mongoose from 'mongoose';
import gameService, { AlgebraicMove } from '../services/game.service';
import gameRepository from '../repositories/game.repository';
import Game from '../models/game.model';

type IdParams = { id: string };
type GameIdParams = { gameId: string };

class GameController {

  async getMyGames(req: Request, res: Response): Promise<void> {
    try {
      const userId   = req.user!.id;
      const page     = parseInt(req.query.page  as string) || 1;
      const limit    = parseInt(req.query.limit as string) || 10;
      const search   = (req.query.search   as string | undefined) || undefined;
      const result   = (req.query.result   as string | undefined) || undefined;
      const gameMode = (req.query.gameMode as string | undefined) || undefined;
      const dateFrom = (req.query.dateFrom as string | undefined) || undefined;
      const dateTo   = (req.query.dateTo   as string | undefined) || undefined;
      const sortDir  = (req.query.sortDir  as 'asc' | 'desc' | undefined) || 'desc';

      const hasFilters = search || result || gameMode || dateFrom || dateTo || sortDir !== 'desc';

      let data: { games: any[]; total: number };

      if (hasFilters) {
        data = await gameRepository.findByPlayerWithFilters({
          userId,
          page,
          limit,
          search,
          result: result as any,
          gameMode: gameMode as any,
          dateFrom,
          dateTo,
          sortDir,
        });
      } else {
        data = await gameService.getGamesByPlayer(userId, page, limit);
      }

      res.status(200).json({ success: true, data: data.games, total: data.total });
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

      let totalWins = 0, totalLosses = 0, totalDraws = 0;
      let currentWinStreak = 0, bestWinStreak = 0, currentLossStreak = 0;
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
          totalDraws += 1; modeCounts[mode].draws += 1;
          currentWinStreak = 0; currentLossStreak = 0;
        } else if (game.result === playerSymbol) {
          totalWins += 1; modeCounts[mode].wins += 1;
          currentWinStreak += 1; currentLossStreak = 0;
          if (currentWinStreak > bestWinStreak) bestWinStreak = currentWinStreak;
        } else {
          totalLosses += 1; modeCounts[mode].losses += 1;
          currentLossStreak += 1; currentWinStreak = 0;
        }
      }

      const totalGames = totalWins + totalLosses + totalDraws;
      const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;
      const favoriteGridSize = Object.keys(gridSizeFreq).length > 0
        ? parseInt(Object.entries(gridSizeFreq).sort((a, b) => b[1] - a[1])[0][0])
        : null;

      res.status(200).json({
        success: true,
        data: {
          totalGames, wins: totalWins, losses: totalLosses, draws: totalDraws,
          winRate: parseFloat(winRate.toFixed(2)),
          currentWinStreak, bestWinStreak, currentLossStreak,
          totalPlayTime: 0,
          favoriteGridSize,
          stats: {
            local:  modeCounts.local,
            online: { ...modeCounts.online, ranking: 0 },
            bot:    modeCounts.bot,
          },
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const game = await gameService.createGame(userId, req.body);
      res.status(201).json({ success: true, data: game });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const games = await gameService.getAllGames();
      res.status(200).json({ success: true, data: games });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async getById(req: Request<IdParams>, res: Response): Promise<void> {
    try {
      const game = await gameService.getGameById(req.params.id);
      if (!game) { res.status(404).json({ success: false, message: 'Game not found' }); return; }
      res.status(200).json({ success: true, data: game });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async update(req: Request<IdParams>, res: Response): Promise<void> {
    try {
      const game = await gameService.updateGame(req.params.id, req.body);
      res.status(200).json({ success: true, data: game });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async delete(req: Request<IdParams>, res: Response): Promise<void> {
    try {
      await gameService.deleteGame(req.params.id);
      res.status(200).json({ success: true, message: 'Game deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async submitBotGameMoves(req: Request<GameIdParams>, res: Response): Promise<void> {
    try {
      const { gameId } = req.params;
      const userId = req.user!.id;
      const { playerMoves, botMoves, last_move, outcome } = req.body;
      
      const result = await gameService.saveBotGame(
        gameId,
        userId,
        playerMoves as AlgebraicMove[],
        botMoves    as AlgebraicMove[],
        last_move,
        outcome
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }
}

export default new GameController();