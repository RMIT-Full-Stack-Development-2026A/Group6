import { Router, Request, Response } from 'express';
import gameController from '../controllers/game.controller';
import { isAuthenticated, isAdmin, permissionMiddleware } from '../middleware/authorization.middleware';
import { Permission } from '../types/roles';

const router = Router();

// Public routes (no authentication required)
router.get('/', (req: Request, res: Response) => gameController.getAll(req, res));
router.get('/:id', (req: Request, res: Response) => gameController.getById(req, res));

// Protected routes (authentication required)
// TODO: Add authMiddleware to verify JWT token before these routes
router.post(
  '/',
  isAuthenticated,
  permissionMiddleware([Permission.CREATE_GAME]),
  (req: Request, res: Response) => gameController.create(req, res)
);

router.put(
  '/:id',
  isAuthenticated,
  permissionMiddleware([Permission.UPDATE_GAME]),
  (req: Request, res: Response) => gameController.update(req, res)
);

router.delete(
  '/:id',
  isAdmin,
  permissionMiddleware([Permission.DELETE_GAME]),
  (req: Request, res: Response) => gameController.delete(req, res)
);

// TODO: Add route-specific validation (express-validator)

export default router;
