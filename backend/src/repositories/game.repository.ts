import Game, { IGame, IMove } from '../models/game.model';

class GameRepository {
  async create(gameData: Partial<IGame>): Promise<IGame> {
    return await Game.create(gameData);
  }

  async findById(id: string): Promise<IGame | null> {
    return await Game.findById(id)
      .populate('players.playerX', 'username profile.avatar')
      .populate('players.playerO', 'username profile.avatar');
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