import mongoose, { Document } from 'mongoose';
export interface IPlayerStats extends Document {
    user: mongoose.Types.ObjectId;
    totalGames: number;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
    stats: {
        local: {
            games: number;
            wins: number;
            losses: number;
            draws: number;
        };
        online: {
            games: number;
            wins: number;
            losses: number;
            draws: number;
            ranking: number;
        };
        bot: {
            games: number;
            wins: number;
            losses: number;
            draws: number;
        };
    };
    currentWinStreak: number;
    bestWinStreak: number;
    currentLossStreak: number;
    favoriteGridSize: number | null;
    totalPlayTime: number;
    achievements: string[];
    lastPlayed: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
declare const PlayerStats: mongoose.Model<IPlayerStats, {}, {}, {}, mongoose.Document<unknown, {}, IPlayerStats, {}, mongoose.DefaultSchemaOptions> & IPlayerStats & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IPlayerStats>;
export default PlayerStats;
