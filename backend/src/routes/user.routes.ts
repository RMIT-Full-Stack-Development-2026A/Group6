import { Router } from 'express';
import userController from '../controllers/user.controller';
import authMiddleware from '../middleware/auth.middleware';
import roleMiddleware from '../middleware/role.middleware';

const router = Router();

router.get('/profile', authMiddleware, (req, res) => userController.getProfile(req, res));
router.put('/profile', authMiddleware, (req, res) => userController.updateProfile(req, res));
router.put('/password', authMiddleware, (req, res) => userController.updatePassword(req, res));
router.get('/', authMiddleware, roleMiddleware('admin'), (req, res) => userController.getAllUsers(req, res));
router.get('/:id', authMiddleware, roleMiddleware('admin'), (req, res) => userController.getUserById(req, res));
router.delete('/:id', authMiddleware, roleMiddleware('admin'), (req, res) => userController.deleteUser(req, res));
router.put('/:id/subscription', authMiddleware, roleMiddleware('admin'), (req, res) => userController.assignSubscription(req, res));

export default router;