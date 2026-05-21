import { Request, Response } from "express";
import botsService from "../services/bots.service";

class BotsController {
  async getMove(req: Request, res: Response): Promise<void> {
    try {
      const difficulty = String(req.params.difficulty || "medium");

      // Accept body for GET (some clients may send JSON in GET), but also allow query
      const payload = req.body && Object.keys(req.body).length ? req.body : {
        state: req.query.state ? JSON.parse(String(req.query.state)) : undefined,
        latestMove: req.query.latestMove as string | undefined,
        tableSize: req.query.tableSize ? Number(req.query.tableSize) : undefined,
      };

      const move = await botsService.computeMove(difficulty, payload);

      res.status(200).json({ success: true, data: { move } });
    } catch (error) {
      res.status(400).json({ success: false, message: error instanceof Error ? error.message : "An error occurred" });
    }
  }
}

export default new BotsController();
