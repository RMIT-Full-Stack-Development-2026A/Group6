import Game, { IGame } from '../models/game.model';

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
}

export default new GameRepository();