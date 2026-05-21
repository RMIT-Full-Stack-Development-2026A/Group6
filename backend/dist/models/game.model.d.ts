import mongoose, { Document } from 'mongoose';
export type GameMode = 'local' | 'online' | 'bot';
export type GameStatus = 'waiting' | 'in-progress' | 'completed' | 'abandoned';
export type CellValue = 'X' | 'O' | null;
export interface IMove {
    player: mongoose.Types.ObjectId;
    position: {
        row: number;
        col: number;
        algebraic: string;
    };
    symbol: 'X' | 'O';
    timestamp: Date;
}
export interface IGame extends Document {
    gameMode: GameMode;
    gridSize: number;
    players: {
        playerX: mongoose.Types.ObjectId | null;
        playerO: mongoose.Types.ObjectId | null;
        player2Name?: string;
    };
    customization: {
        boardStyle: 'classic' | 'mint' | 'dark';
        markerX: string;
        markerO: string;
    };
    aiDifficulty?: 'easy' | 'medium' | 'hard';
    currentTurn: 'X' | 'O';
    boardState: CellValue[][];
    status: GameStatus;
    winner: mongoose.Types.ObjectId | 'AI' | null;
    result: 'X' | 'O' | 'draw' | null;
    moves: IMove[];
    startedAt: Date | null;
    completedAt: Date | null;
    roomCode?: string;
    isRanked: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const Game: mongoose.Model<IGame, {}, {}, {}, mongoose.Document<unknown, {}, IGame, {}, mongoose.DefaultSchemaOptions> & IGame & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IGame>;
export default Game;
