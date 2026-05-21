"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBotMove = getBotMove;
const buildBoard_1 = require("./buildBoard");
const countOpenThrees_1 = require("./countOpenThrees");
const evaluateMove_1 = require("./evaluateMove");
const getRandomMove_1 = require("./getRandomMove");
const isWinningMove_1 = require("./isWinningMove");
const toNotation_1 = require("./toNotation");
const generateHeatmap_1 = require("./generateHeatmap");
//import { printHeatmap } from "./printHeatmap";
function getBotMove(state, latestMove, tableSize) {
    // empty board → random
    if (state.player.length === 0 && state.bot.length === 0) {
        const move = (0, getRandomMove_1.getRandomMove)(tableSize);
        console.log("Random opening move:", move);
        return move;
    }
    const board = (0, buildBoard_1.buildBoard)(state, tableSize);
    const heatmap = (0, generateHeatmap_1.generateHeatmap)(state, tableSize);
    //printHeatmap(heatmap, state, tableSize);
    const emptyCells = [];
    for (let r = 0; r < tableSize; r++) {
        for (let c = 0; c < tableSize; c++) {
            if (board[r][c] === null) {
                emptyCells.push([r, c]);
            }
        }
    }
    // 1. Win
    for (const [r, c] of emptyCells) {
        board[r][c] = "bot";
        if ((0, isWinningMove_1.isWinningMove)(board, r, c, "bot", tableSize)) {
            board[r][c] = null;
            return (0, toNotation_1.toNotation)(r, c);
        }
        board[r][c] = null;
    }
    // 2. Block
    for (const [r, c] of emptyCells) {
        board[r][c] = "player";
        if ((0, isWinningMove_1.isWinningMove)(board, r, c, "player", tableSize)) {
            board[r][c] = null;
            return (0, toNotation_1.toNotation)(r, c);
        }
        board[r][c] = null;
    }
    // 3. Fork
    for (const [r, c] of emptyCells) {
        board[r][c] = "bot";
        const forks = (0, countOpenThrees_1.countOpenThrees)(board, r, c, "bot", tableSize);
        board[r][c] = null;
        if (forks >= 2)
            return (0, toNotation_1.toNotation)(r, c);
    }
    // 4. Block fork
    for (const [r, c] of emptyCells) {
        board[r][c] = "player";
        const forks = (0, countOpenThrees_1.countOpenThrees)(board, r, c, "player", tableSize);
        board[r][c] = null;
        if (forks >= 2)
            return (0, toNotation_1.toNotation)(r, c);
    }
    // 5. Heuristic
    let bestScore = -Infinity;
    let bestMove = null;
    for (const [r, c] of emptyCells) {
        board[r][c] = "bot";
        const attack = (0, evaluateMove_1.evaluateMove)(board, r, c, "bot", tableSize);
        board[r][c] = "player";
        const defend = (0, evaluateMove_1.evaluateMove)(board, r, c, "player", tableSize);
        board[r][c] = null;
        const score = attack + defend * 0.8;
        if (score > bestScore) {
            bestScore = score;
            bestMove = [r, c];
        }
    }
    return bestMove ? (0, toNotation_1.toNotation)(bestMove[0], bestMove[1]) : null;
}
// --- TEST CALL ---
/*console.log(
    getBotMove(
        {
            player: [
                "F6",
                "G8",
                "K12",
                "J9",
                "I7",
                "I12",
                "K11",
                "F11",
                "H12",
                "H7",
            ],
            bot: [
                "H8",
                "H10",
                "G11",
                "H11",
                "I11",
                "I8",
                "I9",
                "I10",
                "H9",
                "J11",
            ],
        },
        "",
        15
    )
);
*/ 
//# sourceMappingURL=hard.js.map