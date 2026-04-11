const express = require('express');
const gameController = require('../controllers/game.controller');
// TODO: Import middleware (auth, validation, etc.)

const router = express.Router();

// Game routes
router.post('/', (req, res) => gameController.create(req, res));
router.get('/', (req, res) => gameController.getAll(req, res));
router.get('/:id', (req, res) => gameController.getById(req, res));
router.put('/:id', (req, res) => gameController.update(req, res));
router.delete('/:id', (req, res) => gameController.delete(req, res));

// TODO: Add middleware for protected routes
// TODO: Add route-specific validation

module.exports = router;
