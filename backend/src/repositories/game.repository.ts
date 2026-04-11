import Game, { IGame } from '../models/game.model';

class GameRepository {
  // Create a new game
  async create(gameData: Partial<IGame>): Promise<IGame> {
    try {
      const game = await Game.create(gameData);
      return game;
    } catch (error) {
      throw error;
    }
  }

  // Find game by ID
  async findById(id: string): Promise<IGame | null> {
    try {
      const game = await Game.findById(id);
      return game;
    } catch (error) {
      throw error;
    }
  }

  // Find all games
  async findAll(): Promise<IGame[]> {
    try {
      const games = await Game.find();
      return games;
    } catch (error) {
      throw error;
    }
  }

  // Update game by ID
  async update(id: string, gameData: Partial<IGame>): Promise<IGame | null> {
    try {
      const game = await Game.findByIdAndUpdate(id, gameData, { new: true });
      return game;
    } catch (error) {
      throw error;
    }
  }

  // Delete game by ID
  async delete(id: string): Promise<IGame | null> {
    try {
      const game = await Game.findByIdAndDelete(id);
      return game;
    } catch (error) {
      throw error;
    }
  }

  // TODO: Add custom queries as per requirements
}

export default new GameRepository();
