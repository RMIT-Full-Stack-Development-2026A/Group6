import { Request, Response } from 'express';
type IdParams = {
    id: string;
};
type GameIdParams = {
    gameId: string;
};
declare class GameController {
    getMyGames(req: Request, res: Response): Promise<void>;
    getMyStats(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request<IdParams>, res: Response): Promise<void>;
    getGameMoves(req: Request<IdParams>, res: Response): Promise<void>;
    update(req: Request<IdParams>, res: Response): Promise<void>;
    delete(req: Request<IdParams>, res: Response): Promise<void>;
    submitBotGameMoves(req: Request<GameIdParams>, res: Response): Promise<void>;
}
declare const _default: GameController;
export default _default;
