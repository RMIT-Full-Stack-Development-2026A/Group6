import { Router, Request, Response } from 'express';
import gameController from '../controllers/game.controller';
// TODO: Import middleware (auth, validation, etc.)

const router = Router();

// Game routes
router.post('/', (req: Request, res: Response) => gameController.create(req, res));
router.get('/', (req: Request, res: Response) => gameController.getAll(req, res));
router.get('/:id', (req: Request, res: Response) => gameController.getById(req, res));
router.put('/:id', (req: Request, res: Response) => gameController.update(req, res));
router.delete('/:id', (req: Request, res: Response) => gameController.delete(req, res));

// TODO: Add middleware for protected routes
// TODO: Add route-specific validation

export default router;
