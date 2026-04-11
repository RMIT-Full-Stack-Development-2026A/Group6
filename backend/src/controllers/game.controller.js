const gameService = require('../services/game.service');

class GameController {
  // Create game
  async create(req, res) {
    try {
      // TODO: Add input validation (express-validator)
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
        message: error.message,
      });
    }
  }

  // Get game by ID
  async getById(req, res) {
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
        message: error.message,
      });
    }
  }

  // Get all games
  async getAll(req, res) {
    try {
      // TODO: Add pagination and filtering
      const games = await gameService.getAllGames();
      res.status(200).json({
        success: true,
        data: games,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update game
  async update(req, res) {
    try {
      // TODO: Add input validation
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
        message: error.message,
      });
    }
  }

  // Delete game
  async delete(req, res) {
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
        message: error.message,
      });
    }
  }

  // TODO: Add custom controller methods
}

module.exports = new GameController();
