const express = require('express');
const adminController = require('../controllers/admin.controller');
// TODO: Import middleware (auth, validation, etc.)

const router = express.Router();

// Admin routes
router.post('/', (req, res) => adminController.create(req, res));
router.get('/', (req, res) => adminController.getAll(req, res));
router.get('/:id', (req, res) => adminController.getById(req, res));
router.put('/:id', (req, res) => adminController.update(req, res));
router.delete('/:id', (req, res) => adminController.delete(req, res));

// TODO: Add middleware for protected routes
// TODO: Add route-specific validation

module.exports = router;
