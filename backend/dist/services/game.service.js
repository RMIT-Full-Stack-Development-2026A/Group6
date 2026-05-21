"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.colToAlpha = colToAlpha;
exports.algebraicToCoords = algebraicToCoords;
const mongoose_1 = __importDefault(require("mongoose"));
const game_repository_1 = __importDefault(require("../repositories/game.repository"));
function colToAlpha(col) {
    let result = '';
    let n = col;
    do {
        result = String.fromCharCode(97 + (n % 26)) + result;
        n = Math.floor(n / 26) - 1;
    } while (n >= 0);
    return result;
}
function algebraicToCoords(notation, gridSize) {
    const normalized = notation.toLowerCase();
    const match = normalized.match(/^([a-z]+)(\d+)$/);
    if (!match)
        throw new Error(`Invalid algebraic notation: "${notation}"`);
    const letters = match[1];
    const number = parseInt(match[2], 10);
    let col = 0;
    for (let i = 0; i < letters.length; i++) {
        col = col * 26 + (letters.charCodeAt(i) - 96);
    }
    col -= 1;
    const row = gridSize - number;
    return { row, col };
}
function buildMoveList(playerMoves, botMoves, playerSymbol, botSymbol, playerId, botId, gridSize) {
    const toIMove = (m, symbol, player, idx, isBot) => ({
        player,
        position: {
            row: m.row ?? algebraicToCoords(m.notation, gridSize).row,
            col: m.col ?? algebraicToCoords(m.notation, gridSize).col,
            algebraic: m.notation,
        },
        symbol,
        timestamp: new Date(Date.now() + idx * 500),
    });
    const playerList = playerMoves.map((m, i) => ({ move: toIMove(m, playerSymbol, playerId, i * 2, false), order: i * 2 }));
    const botList = botMoves.map((m, i) => ({ move: toIMove(m, botSymbol, botId, i * 2 + 1, true), order: i * 2 + 1 }));
    return [...playerList, ...botList]
        .sort((a, b) => a.order - b.order)
        .map((x) => x.move);
}
function buildBoardState(gridSize, playerMoves, botMoves, playerSymbol, botSymbol) {
    const board = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
    const apply = (moves, symbol) => {
        for (const m of moves) {
            const row = m.row ?? algebraicToCoords(m.notation, gridSize).row;
            const col = m.col ?? algebraicToCoords(m.notation, gridSize).col;
            if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
                board[row][col] = symbol;
            }
        }
    };
    apply(playerMoves, playerSymbol);
    apply(botMoves, botSymbol);
    return board;
}
class GameService {
    async createGame(userId, gameData) {
        try {
            const oid = new mongoose_1.default.Types.ObjectId(userId);
            const players = {
                playerX: oid,
                playerO: gameData.players?.playerO ?? null,
                player2Name: gameData.players?.player2Name ?? '',
            };
            return await game_repository_1.default.create({
                ...gameData,
                players,
                startedAt: new Date(),
            });
        }
        catch (error) {
            throw error;
        }
    }
    async getGameById(id) {
        try {
            const game = await game_repository_1.default.findById(id);
            if (!game)
                throw new Error('Game not found');
            return game;
        }
        catch (error) {
            throw error;
        }
    }
    async getAllGames() {
        try {
            return await game_repository_1.default.findAll();
        }
        catch (error) {
            throw error;
        }
    }
    async getGamesByPlayer(userId, page, limit) {
        try {
            return await game_repository_1.default.findByPlayerPaginated(userId, page, limit);
        }
        catch (error) {
            throw error;
        }
    }
    async updateGame(id, gameData) {
        try {
            const game = await game_repository_1.default.update(id, gameData);
            if (!game)
                throw new Error('Game not found');
            return game;
        }
        catch (error) {
            throw error;
        }
    }
    async deleteGame(id) {
        try {
            const game = await game_repository_1.default.delete(id);
            if (!game)
                throw new Error('Game not found');
            return game;
        }
        catch (error) {
            throw error;
        }
    }
    async saveBotGame(gameId, userId, playerMoves, botMoves, last_move, outcome) {
        return this.recordBotGameMoves(gameId, playerMoves, botMoves, last_move, outcome);
    }
    async recordBotGameMoves(gameId, playerMoves, botMoves, last_move, outcome) {
        const game = await game_repository_1.default.findById(gameId);
        if (!game)
            throw new Error('Game not found');
        if (game.gameMode !== 'bot')
            throw new Error('Game is not a bot game');
        if (game.status === 'completed' || game.status === 'abandoned') {
            throw new Error('Game has already ended');
        }
        const gridSize = game.gridSize;
        const playerSymbol = game.players.playerX ? 'X' : 'O';
        const botSymbol = playerSymbol === 'X' ? 'O' : 'X';
        const playerId = game.players.playerX ?? game.players.playerO;
        if (!playerId)
            throw new Error('No player found on game');
        const BOT_OID = new mongoose_1.default.Types.ObjectId('000000000000000000000001');
        const normalizedPlayerMoves = playerMoves.map((m) => ({
            ...m,
            notation: m.notation.toLowerCase(),
        }));
        const normalizedBotMoves = botMoves.map((m) => ({
            ...m,
            notation: m.notation.toLowerCase(),
        }));
        const moves = buildMoveList(normalizedPlayerMoves, normalizedBotMoves, playerSymbol, botSymbol, playerId, BOT_OID, gridSize);
        const boardState = buildBoardState(gridSize, normalizedPlayerMoves, normalizedBotMoves, playerSymbol, botSymbol);
        let status;
        let result;
        let winner;
        switch (outcome) {
            case 'player':
                status = 'completed';
                result = playerSymbol;
                winner = playerId;
                break;
            case 'bot':
                status = 'completed';
                result = botSymbol;
                winner = 'AI';
                break;
            case 'draw':
                status = 'completed';
                result = 'draw';
                winner = null;
                break;
            case 'abandoned':
            default:
                status = 'abandoned';
                result = null;
                winner = null;
                break;
        }
        const updated = await game_repository_1.default.submitBotMoves(gameId, moves, status, result, winner, boardState, new Date());
        if (!updated)
            throw new Error('Failed to update game');
        return updated;
    }
}
exports.default = new GameService();
//# sourceMappingURL=game.service.js.map