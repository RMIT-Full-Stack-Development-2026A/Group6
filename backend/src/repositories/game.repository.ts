import Game, { IGame, IMove } from '../models/game.model';
import mongoose from 'mongoose';

export interface GameHistoryQuery {
  userId: string;
  page: number;
  limit: number;
  search?: string;
  result?: 'win' | 'lose' | 'draw' | 'aborted';
  gameMode?: 'local' | 'bot' | 'online';
  dateFrom?: string;
  dateTo?: string;
  sortDir?: 'asc' | 'desc';
}

class GameRepository {
  async create(gameData: Partial<IGame>): Promise<IGame> {
    return await Game.create(gameData);
  }

  async findById(id: string): Promise<IGame | null> {
    return await Game.findById(id)
      .populate('players.playerX', 'username profile.avatar')
      .populate('players.playerO', 'username profile.avatar');
  }

  // used for replay
  async findByIdWithMoves(id: string): Promise<IGame | null> {
    return await Game.findById(id)
      .populate('players.playerX', 'username profile.avatar')
      .populate('players.playerO', 'username profile.avatar')
      .populate('moves.player', 'username');
  }

  async findAll(): Promise<IGame[]> {
    return await Game.find()
      .populate('players.playerX', 'username')
      .populate('players.playerO', 'username')
      .sort({ createdAt: -1 });
  }

  async findByPlayer(userId: string): Promise<IGame[]> {
    return await Game.find({
      $or: [{ 'players.playerX': userId }, { 'players.playerO': userId }],
    })
      .populate('players.playerX', 'username profile.avatar')
      .populate('players.playerO', 'username profile.avatar')
      .sort({ createdAt: -1 });
  }

  async findByPlayerPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ games: IGame[]; total: number }> {
    const skip = (page - 1) * limit;
    const filter = {
      $or: [{ 'players.playerX': userId }, { 'players.playerO': userId }],
    };
    const [games, total] = await Promise.all([
      Game.find(filter)
        .populate('players.playerX', 'username profile.avatar')
        .populate('players.playerO', 'username profile.avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Game.countDocuments(filter),
    ]);
    return { games, total };
  }

  async findByPlayerWithFilters(query: GameHistoryQuery): Promise<{ games: IGame[]; total: number }> {
    const { userId, page, limit, search, result, gameMode, dateFrom, dateTo, sortDir = 'desc' } = query;
    const skip = (page - 1) * limit;
    const oid = new mongoose.Types.ObjectId(userId);

    const filter: mongoose.FilterQuery<IGame> = {
      $or: [{ 'players.playerX': oid }, { 'players.playerO': oid }],
    };

    if (search && search.trim()) {
      const pattern = new RegExp(search.trim(), 'i');
      filter.$and = [
        {
          $or: [
            { roomCode: pattern },
            { 'players.player2Name': pattern },
          ],
        },
      ];
    }

    if (gameMode && gameMode !== 'all') {
      filter.gameMode = gameMode;
    }

    if (result && result !== 'all' as any) {
      if (result === 'aborted') {
        filter.status = 'abandoned';
      } else if (result === 'draw') {
        filter.result = 'draw';
        filter.status = 'completed';
      } else if (result === 'win') {
        filter.status = 'completed';
        filter.$or = [
          { 'players.playerX': oid, result: 'X' },
          { 'players.playerO': oid, result: 'O' },
        ];
      } else if (result === 'lose') {
        filter.status = 'completed';
        filter.$or = [
          { 'players.playerX': oid, result: 'O' },
          { 'players.playerO': oid, result: 'X' },
        ];
      }
    }

    if (dateFrom || dateTo) {
      const dateFilter: Record<string, Date> = {};
      if (dateFrom) dateFilter.$gte = new Date(dateFrom);
      if (dateTo) {
        const end = new Date(dateTo);
        end.setDate(end.getDate() + 1);
        dateFilter.$lte = end;
      }
      filter.startedAt = dateFilter as any;
    }

    const sortOrder = sortDir === 'asc' ? 1 : -1;

    const [games, total] = await Promise.all([
      Game.find(filter)
        .populate('players.playerX', 'username profile.avatar')
        .populate('players.playerO', 'username profile.avatar')
        .sort({ startedAt: sortOrder })
        .skip(skip)
        .limit(limit),
      Game.countDocuments(filter),
    ]);

    return { games, total };
  }

  async findByStatus(status: IGame['status']): Promise<IGame[]> {
    return await Game.find({ status })
      .populate('players.playerX', 'username')
      .populate('players.playerO', 'username');
  }

  async findByRoomCode(roomCode: string): Promise<IGame | null> {
    return await Game.findOne({ roomCode });
  }

  async update(id: string, gameData: Partial<IGame>): Promise<IGame | null> {
    return await Game.findByIdAndUpdate(id, gameData, { new: true });
  }

  async delete(id: string): Promise<IGame | null> {
    return await Game.findByIdAndDelete(id);
  }

  async submitBotMoves(
    id: string,
    moves: IMove[],
    status: IGame['status'],
    result: IGame['result'],
    winner: IGame['winner'],
    boardState: IGame['boardState'],
    completedAt: Date
  ): Promise<IGame | null> {
    return await Game.findByIdAndUpdate(
      id,
      {
        $push: { moves: { $each: moves } },
        $set: { status, result, winner, boardState, completedAt },
      },
      { new: true }
    )
      .populate('players.playerX', 'username profile.avatar')
      .populate('players.playerO', 'username profile.avatar');
  }
}

export default new GameRepository();