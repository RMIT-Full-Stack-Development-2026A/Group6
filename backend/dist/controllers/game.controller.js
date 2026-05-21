"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const game_service_1 = __importDefault(require("../services/game.service"));
const game_repository_1 = __importDefault(require("../repositories/game.repository"));
const game_model_1 = __importDefault(require("../models/game.model"));
class GameController {
    async getMyGames(req, res) {
        try {
            const userId = req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || undefined;
            const result = req.query.result || undefined;
            const gameMode = req.query.gameMode || undefined;
            const dateFrom = req.query.dateFrom || undefined;
            const dateTo = req.query.dateTo || undefined;
            const sortDir = req.query.sortDir || 'desc';
            const hasFilters = search || result || gameMode || dateFrom || dateTo || sortDir !== 'desc';
            let data;
            if (hasFilters) {
                data = await game_repository_1.default.findByPlayerWithFilters({
                    userId,
                    page,
                    limit,
                    search,
                    result: result,
                    gameMode: gameMode,
                    dateFrom,
                    dateTo,
                    sortDir,
                });
            }
            else {
                data = await game_service_1.default.getGamesByPlayer(userId, page, limit);
            }
            res.status(200).json({ success: true, data: data.games, total: data.total });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getMyStats(req, res) {
        try {
            const userId = req.user.id;
            const oid = new mongoose_1.default.Types.ObjectId(userId);
            const completedGames = await game_model_1.default.find({
                $or: [{ 'players.playerX': oid }, { 'players.playerO': oid }],
                status: 'completed',
            }).lean();
            const modeKeys = ['local', 'online', 'bot'];
            const modeCounts = {
                local: { games: 0, wins: 0, losses: 0, draws: 0 },
                online: { games: 0, wins: 0, losses: 0, draws: 0 },
                bot: { games: 0, wins: 0, losses: 0, draws: 0 },
            };
            let totalWins = 0, totalLosses = 0, totalDraws = 0;
            let currentWinStreak = 0, bestWinStreak = 0, currentLossStreak = 0;
            const gridSizeFreq = {};
            const sorted = [...completedGames].sort((a, b) => {
                const ta = a.completedAt ? new Date(a.completedAt).getTime() : 0;
                const tb = b.completedAt ? new Date(b.completedAt).getTime() : 0;
                return ta - tb;
            });
            for (const game of sorted) {
                const mode = (game.gameMode ?? 'local');
                if (!modeCounts[mode])
                    continue;
                const isPlayerX = game.players?.playerX?.toString() === userId;
                const isPlayerO = game.players?.playerO?.toString() === userId;
                if (!isPlayerX && !isPlayerO)
                    continue;
                const playerSymbol = isPlayerX ? 'X' : 'O';
                modeCounts[mode].games += 1;
                const gs = game.gridSize ?? 10;
                gridSizeFreq[gs] = (gridSizeFreq[gs] ?? 0) + 1;
                if (game.result === 'draw') {
                    totalDraws += 1;
                    modeCounts[mode].draws += 1;
                    currentWinStreak = 0;
                    currentLossStreak = 0;
                }
                else if (game.result === playerSymbol) {
                    totalWins += 1;
                    modeCounts[mode].wins += 1;
                    currentWinStreak += 1;
                    currentLossStreak = 0;
                    if (currentWinStreak > bestWinStreak)
                        bestWinStreak = currentWinStreak;
                }
                else {
                    totalLosses += 1;
                    modeCounts[mode].losses += 1;
                    currentLossStreak += 1;
                    currentWinStreak = 0;
                }
            }
            const totalGames = totalWins + totalLosses + totalDraws;
            const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;
            const favoriteGridSize = Object.keys(gridSizeFreq).length > 0
                ? parseInt(Object.entries(gridSizeFreq).sort((a, b) => b[1] - a[1])[0][0])
                : null;
            res.status(200).json({
                success: true,
                data: {
                    totalGames, wins: totalWins, losses: totalLosses, draws: totalDraws,
                    winRate: parseFloat(winRate.toFixed(2)),
                    currentWinStreak, bestWinStreak, currentLossStreak,
                    totalPlayTime: 0,
                    favoriteGridSize,
                    stats: {
                        local: modeCounts.local,
                        online: { ...modeCounts.online, ranking: 0 },
                        bot: modeCounts.bot,
                    },
                },
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async create(req, res) {
        try {
            const userId = req.user.id;
            const game = await game_service_1.default.createGame(userId, req.body);
            res.status(201).json({ success: true, data: game });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getAll(req, res) {
        try {
            const games = await game_service_1.default.getAllGames();
            res.status(200).json({ success: true, data: games });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getById(req, res) {
        try {
            const game = await game_service_1.default.getGameById(req.params.id);
            if (!game) {
                res.status(404).json({ success: false, message: 'Game not found' });
                return;
            }
            res.status(200).json({ success: true, data: game });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Returns the ordered moves list for premium only game
    async getGameMoves(req, res) {
        try {
            const userId = req.user.id;
            const raw = await game_model_1.default.findById(req.params.id).select('players').lean();
            if (!raw) {
                res.status(404).json({ success: false, message: 'Game not found' });
                return;
            }
            const xId = raw.players?.playerX?.toString() ?? null;
            const oId = raw.players?.playerO?.toString() ?? null;
            const isParticipant = xId === userId || oId === userId;
            if (!isParticipant) {
                res.status(403).json({ success: false, message: 'You are not a participant of this game.' });
                return;
            }
            const game = await game_repository_1.default.findByIdWithMoves(req.params.id);
            if (!game) {
                res.status(404).json({ success: false, message: 'Game not found' });
                return;
            }
            res.status(200).json({
                success: true,
                data: {
                    gameId: game._id,
                    gridSize: game.gridSize,
                    players: game.players,
                    customization: game.customization,
                    result: game.result,
                    status: game.status,
                    moves: game.moves,
                },
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async update(req, res) {
        try {
            const game = await game_service_1.default.updateGame(req.params.id, req.body);
            res.status(200).json({ success: true, data: game });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async delete(req, res) {
        try {
            await game_service_1.default.deleteGame(req.params.id);
            res.status(200).json({ success: true, message: 'Game deleted' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async submitBotGameMoves(req, res) {
        try {
            const { gameId } = req.params;
            const userId = req.user.id;
            const { playerMoves, botMoves, last_move, outcome } = req.body;
            const result = await game_service_1.default.saveBotGame(gameId, userId, playerMoves, botMoves, last_move, outcome);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.default = new GameController();
//# sourceMappingURL=game.controller.js.map