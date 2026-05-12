import { Router } from 'express';
import adminController from '../controllers/admin.controller';
import  authenticate  from '../middleware/auth.middleware';
import requireRole  from '../middleware/role.middleware';

const router = Router();

router.use(authenticate, requireRole('admin'));

router.get('/users', adminController.getAllUsers.bind(adminController));
router.get('/users/:id', adminController.getUserById.bind(adminController));
router.patch('/users/:id/deactivate', adminController.deactivateUser.bind(adminController));
router.patch('/users/:id/reactivate', adminController.reactivateUser.bind(adminController));

export default router;