import { Router, Request, Response } from 'express';
import gameController from '../controllers/game.controller';
// TODO: Import middleware (auth, validation, etc.)

const router = Router();

// Game routes
router.post('/', (req: Request, res: Response) => gameController.create(req, res));
router.get('/', (req: Request, res: Response) => gameController.getAll(req, res));
router.get('/:id', gameController.getById);
router.put('/:id', gameController.update);
router.delete('/:id', gameController.delete);

// TODO: Add middleware for protected routes
// TODO: Add route-specific validation

export default router;
