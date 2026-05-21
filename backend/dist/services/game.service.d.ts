import { IGame } from '../models/game.model';
export interface AlgebraicMove {
    notation: string;
    row: number;
    col: number;
}
export interface BotGamePayload {
    playerMoves: AlgebraicMove[];
    botMoves: AlgebraicMove[];
    last_move: string;
}
export declare function colToAlpha(col: number): string;
export declare function algebraicToCoords(notation: string, gridSize: number): {
    row: number;
    col: number;
};
declare class GameService {
    createGame(userId: string, gameData: Partial<IGame>): Promise<IGame>;
    getGameById(id: string): Promise<IGame>;
    getAllGames(): Promise<IGame[]>;
    getGamesByPlayer(userId: string, page: number, limit: number): Promise<{
        games: IGame[];
        total: number;
    }>;
    updateGame(id: string, gameData: Partial<IGame>): Promise<IGame>;
    deleteGame(id: string): Promise<IGame>;
    saveBotGame(gameId: string, userId: string, playerMoves: AlgebraicMove[], botMoves: AlgebraicMove[], last_move: string, outcome: 'player' | 'bot' | 'draw' | 'abandoned'): Promise<IGame>;
    recordBotGameMoves(gameId: string, playerMoves: AlgebraicMove[], botMoves: AlgebraicMove[], last_move: string, outcome: 'player' | 'bot' | 'draw' | 'abandoned'): Promise<IGame>;
}
declare const _default: GameService;
export default _default;
