const gameRepository = require('../repositories/game.repository');

class GameService {
  // Create game with validation
  async createGame(gameData) {
    try {
      // TODO: Add business logic and validation
      const game = await gameRepository.create(gameData);
      return game;
    } catch (error) {
      throw error;
    }
  }

  // Get game by ID
  async getGameById(id) {
    try {
      // TODO: Add business logic
      const game = await gameRepository.findById(id);
      if (!game) {
        throw new Error('Game not found');
      }
      return game;
    } catch (error) {
      throw error;
    }
  }

  // Get all games
  async getAllGames() {
    try {
      // TODO: Add business logic (filtering, pagination, etc.)
      const games = await gameRepository.findAll();
      return games;
    } catch (error) {
      throw error;
    }
  }

  // Update game
  async updateGame(id, gameData) {
    try {
      // TODO: Add business logic and validation
      const game = await gameRepository.update(id, gameData);
      if (!game) {
        throw new Error('Game not found');
      }
      return game;
    } catch (error) {
      throw error;
    }
  }

  // Delete game
  async deleteGame(id) {
    try {
      // TODO: Add business logic (cascading deletes, etc.)
      const game = await gameRepository.delete(id);
      if (!game) {
        throw new Error('Game not found');
      }
      return game;
    } catch (error) {
      throw error;
    }
  }

  // TODO: Add custom business logic methods
}

module.exports = new GameService();
