import { IGame, IMove } from '../models/game.model';
export interface GameHistoryQuery {
    userId: string;
    page: number;
    limit: number;
    search?: string;
    result?: 'win' | 'lose' | 'draw' | 'aborted';
    gameMode?: 'local' | 'bot' | 'online' | 'all';
    dateFrom?: string;
    dateTo?: string;
    sortDir?: 'asc' | 'desc';
}
declare class GameRepository {
    create(gameData: Partial<IGame>): Promise<IGame>;
    findById(id: string): Promise<IGame | null>;
    findByIdWithMoves(id: string): Promise<IGame | null>;
    findAll(): Promise<IGame[]>;
    findByPlayer(userId: string): Promise<IGame[]>;
    findByPlayerPaginated(userId: string, page: number, limit: number): Promise<{
        games: IGame[];
        total: number;
    }>;
    findByPlayerWithFilters(query: GameHistoryQuery): Promise<{
        games: IGame[];
        total: number;
    }>;
    findByStatus(status: IGame['status']): Promise<IGame[]>;
    findByRoomCode(roomCode: string): Promise<IGame | null>;
    update(id: string, gameData: Partial<IGame>): Promise<IGame | null>;
    delete(id: string): Promise<IGame | null>;
    submitBotMoves(id: string, moves: IMove[], status: IGame['status'], result: IGame['result'], winner: IGame['winner'], boardState: IGame['boardState'], completedAt: Date): Promise<IGame | null>;
}
declare const _default: GameRepository;
export default _default;
