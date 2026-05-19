import { Router, Request, Response } from "express";
import botsController from "../controllers/bots.controller";

const router = Router();

// GET /api/bots/:difficulty
router.get("/:difficulty", (req: Request, res: Response) => botsController.getMove(req, res));

export default router;
