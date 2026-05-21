"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const game_model_1 = __importDefault(require("../models/game.model"));
const mongoose_1 = __importDefault(require("mongoose"));
class GameRepository {
    async create(gameData) {
        return await game_model_1.default.create(gameData);
    }
    async findById(id) {
        return await game_model_1.default.findById(id)
            .populate('players.playerX', 'username profile.avatar')
            .populate('players.playerO', 'username profile.avatar');
    }
    // used for replay
    async findByIdWithMoves(id) {
        return await game_model_1.default.findById(id)
            .populate('players.playerX', 'username profile.avatar')
            .populate('players.playerO', 'username profile.avatar')
            .populate('moves.player', 'username');
    }
    async findAll() {
        return await game_model_1.default.find()
            .populate('players.playerX', 'username')
            .populate('players.playerO', 'username')
            .sort({ createdAt: -1 });
    }
    async findByPlayer(userId) {
        return await game_model_1.default.find({
            $or: [{ 'players.playerX': userId }, { 'players.playerO': userId }],
        })
            .populate('players.playerX', 'username profile.avatar')
            .populate('players.playerO', 'username profile.avatar')
            .sort({ createdAt: -1 });
    }
    async findByPlayerPaginated(userId, page, limit) {
        const skip = (page - 1) * limit;
        const filter = {
            $or: [{ 'players.playerX': userId }, { 'players.playerO': userId }],
        };
        const [games, total] = await Promise.all([
            game_model_1.default.find(filter)
                .populate('players.playerX', 'username profile.avatar')
                .populate('players.playerO', 'username profile.avatar')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            game_model_1.default.countDocuments(filter),
        ]);
        return { games, total };
    }
    async findByPlayerWithFilters(query) {
        const { userId, page, limit, search, result, gameMode, dateFrom, dateTo, sortDir = 'desc' } = query;
        const skip = (page - 1) * limit;
        const oid = new mongoose_1.default.Types.ObjectId(userId);
        const filter = {
            $or: [{ 'players.playerX': oid }, { 'players.playerO': oid }],
        };
        if (search && search.trim()) {
            const pattern = new RegExp(search.trim(), 'i');
            filter.$and = [
                {
                    $or: [
                        { roomCode: pattern },
                        { 'players.player2Name': pattern },
                    ],
                },
            ];
        }
        if (gameMode && gameMode !== 'all') {
            filter.gameMode = gameMode;
        }
        if (result && result !== 'all') {
            if (result === 'aborted') {
                filter.status = 'abandoned';
            }
            else if (result === 'draw') {
                filter.result = 'draw';
                filter.status = 'completed';
            }
            else if (result === 'win') {
                filter.status = 'completed';
                filter.$or = [
                    { 'players.playerX': oid, result: 'X' },
                    { 'players.playerO': oid, result: 'O' },
                ];
            }
            else if (result === 'lose') {
                filter.status = 'completed';
                filter.$or = [
                    { 'players.playerX': oid, result: 'O' },
                    { 'players.playerO': oid, result: 'X' },
                ];
            }
        }
        if (dateFrom || dateTo) {
            const dateFilter = {};
            if (dateFrom)
                dateFilter.$gte = new Date(dateFrom);
            if (dateTo) {
                const end = new Date(dateTo);
                end.setDate(end.getDate() + 1);
                dateFilter.$lte = end;
            }
            filter.startedAt = dateFilter;
        }
        const sortOrder = sortDir === 'asc' ? 1 : -1;
        const [games, total] = await Promise.all([
            game_model_1.default.find(filter)
                .populate('players.playerX', 'username profile.avatar')
                .populate('players.playerO', 'username profile.avatar')
                .sort({ startedAt: sortOrder })
                .skip(skip)
                .limit(limit),
            game_model_1.default.countDocuments(filter),
        ]);
        return { games, total };
    }
    async findByStatus(status) {
        return await game_model_1.default.find({ status })
            .populate('players.playerX', 'username')
            .populate('players.playerO', 'username');
    }
    async findByRoomCode(roomCode) {
        return await game_model_1.default.findOne({ roomCode });
    }
    async update(id, gameData) {
        return await game_model_1.default.findByIdAndUpdate(id, gameData, { new: true });
    }
    async delete(id) {
        return await game_model_1.default.findByIdAndDelete(id);
    }
    async submitBotMoves(id, moves, status, result, winner, boardState, completedAt) {
        return await game_model_1.default.findByIdAndUpdate(id, {
            $set: { moves, status, result, winner, boardState, completedAt },
        }, { new: true })
            .populate('players.playerX', 'username profile.avatar')
            .populate('players.playerO', 'username profile.avatar');
    }
}
exports.default = new GameRepository();
//# sourceMappingURL=game.repository.js.map