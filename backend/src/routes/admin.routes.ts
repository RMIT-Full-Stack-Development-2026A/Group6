import { Router, Request, Response } from 'express';
import adminController from '../controllers/admin.controller';
import { isAdmin, permissionMiddleware } from '../middleware/authorization.middleware';
import { Permission } from '../types/roles';

const router = Router();

// All admin routes require admin role
// TODO: Add authMiddleware to verify JWT token before these routes

router.get(
  '/',
  isAdmin,
  permissionMiddleware([Permission.READ_ADMIN]),
  (req: Request, res: Response) => adminController.getAll(req, res)
);

router.get(
  '/:id',
  isAdmin,
  permissionMiddleware([Permission.READ_ADMIN]),
  (req: Request, res: Response) => adminController.getById(req, res)
);

router.post(
  '/',
  isAdmin,
  permissionMiddleware([Permission.CREATE_ADMIN]),
  (req: Request, res: Response) => adminController.create(req, res)
);

router.put(
  '/:id',
  isAdmin,
  permissionMiddleware([Permission.UPDATE_ADMIN]),
  (req: Request, res: Response) => adminController.update(req, res)
);

router.delete(
  '/:id',
  isAdmin,
  permissionMiddleware([Permission.DELETE_ADMIN]),
  (req: Request, res: Response) => adminController.delete(req, res)
);

// TODO: Add route-specific validation (express-validator)

export default router;
