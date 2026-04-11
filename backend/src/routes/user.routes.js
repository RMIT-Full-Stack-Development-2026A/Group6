const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');


router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.put('/password', authMiddleware, userController.updatePassword);
router.get('/', authMiddleware, roleMiddleware('admin'), userController.getAllUsers);
router.get('/:id', authMiddleware, roleMiddleware('admin'), userController.getUserById);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), userController.deleteUser);
router.put('/:id/subscription', authMiddleware, roleMiddleware('admin'), userController.assignSubscription);

module.exports = router;