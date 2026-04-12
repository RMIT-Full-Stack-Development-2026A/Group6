import { Router, Request, Response } from 'express';
import adminController from '../controllers/admin.controller';
// TODO: Import middleware (auth, validation, etc.)

const router = Router();

// Admin routes
router.post('/', (req: Request, res: Response) => adminController.create(req, res));
router.get('/', (req: Request, res: Response) => adminController.getAll(req, res));
router.get('/:id', (req: Request, res: Response) => adminController.getById(req, res));
router.put('/:id', (req: Request, res: Response) => adminController.update(req, res));
router.delete('/:id', (req: Request, res: Response) => adminController.delete(req, res));

// TODO: Add middleware for protected routes
// TODO: Add route-specific validation

export default router;
