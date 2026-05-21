import { Router, Request, Response } from 'express';
import gameController from '../controllers/game.controller';
import authMiddleware from '../middleware/auth.middleware';
import premiumMiddleware from '../middleware/premium.middleware';

const router: ReturnType<typeof Router> = Router();

router.get('/my', authMiddleware, (req: Request, res: Response) =>
  gameController.getMyGames(req, res)
);
router.get('/my/stats', authMiddleware, (req: Request, res: Response) =>
  gameController.getMyStats(req, res)
);
router.post('/', authMiddleware, (req: Request, res: Response) =>
  gameController.create(req, res)
);
router.get('/', authMiddleware, (req: Request, res: Response) =>
  gameController.getAll(req, res)
);
router.get('/:id', authMiddleware, (req: Request, res: Response) =>
  gameController.getById(req as Request<{ id: string }>, res)
);

// Premium-only: fetch full move list for replay
router.get('/:id/moves', authMiddleware, premiumMiddleware, (req: Request, res: Response) =>
  gameController.getGameMoves(req as Request<{ id: string }>, res)
);

router.put('/:id', authMiddleware, (req: Request, res: Response) =>
  gameController.update(req as Request<{ id: string }>, res)
);
router.delete('/:id', authMiddleware, (req: Request, res: Response) =>
  gameController.delete(req as Request<{ id: string }>, res)
);

router.post('/:gameId/bot-moves', authMiddleware, (req: Request, res: Response) =>
  gameController.submitBotGameMoves(req as Request<{ gameId: string }>, res)
);

export default router;