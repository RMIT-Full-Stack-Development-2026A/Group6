"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBotMove = getBotMove;
const buildBoard_1 = require("./buildBoard");
const toNotation_1 = require("./toNotation");
const isWinningMove_1 = require("./isWinningMove");
const countOpenThrees_1 = require("./countOpenThrees");
const inBounds_1 = require("./inBounds");
const directions_1 = require("./directions");
const easy_1 = require("./easy");
const getRandomMove_1 = require("./getRandomMove");
function getBotMove(state, latestMove, tableSize) {
    // empty board → random
    if (state.player.length === 0 && state.bot.length === 0) {
        return (0, getRandomMove_1.getRandomMove)(tableSize);
    }
    const board = (0, buildBoard_1.buildBoard)(state, tableSize);
    const emptyCells = [];
    for (let r = 0; r < tableSize; r++) {
        for (let c = 0; c < tableSize; c++) {
            if (board[r][c] === null)
                emptyCells.push([r, c]);
        }
    }
    // 1. Win if possible
    for (const [r, c] of emptyCells) {
        board[r][c] = "bot";
        if ((0, isWinningMove_1.isWinningMove)(board, r, c, "bot", tableSize)) {
            board[r][c] = null;
            return (0, toNotation_1.toNotation)(r, c);
        }
        board[r][c] = null;
    }
    // 2. Block immediate win
    for (const [r, c] of emptyCells) {
        board[r][c] = "player";
        if ((0, isWinningMove_1.isWinningMove)(board, r, c, "player", tableSize)) {
            board[r][c] = null;
            return (0, toNotation_1.toNotation)(r, c);
        }
        board[r][c] = null;
    }
    // 3. Block 3-sequence open on both sides (open threes)
    for (const [r, c] of emptyCells) {
        board[r][c] = "player";
        const openThrees = (0, countOpenThrees_1.countOpenThrees)(board, r, c, "player", tableSize);
        board[r][c] = null;
        if (openThrees > 0)
            return (0, toNotation_1.toNotation)(r, c);
    }
    // 4. Block 4-sequence open on 1 side (semi-open four)
    for (const [r, c] of emptyCells) {
        board[r][c] = "player";
        let foundSemiOpenFour = false;
        for (const [dr, dc] of directions_1.directions) {
            // count contiguous in both directions
            let forward = 0;
            let nr = r + dr;
            let nc = c + dc;
            while ((0, inBounds_1.inBounds)(nr, nc, tableSize) && board[nr][nc] === "player") {
                forward++;
                nr += dr;
                nc += dc;
            }
            let backward = 0;
            nr = r - dr;
            nc = c - dc;
            while ((0, inBounds_1.inBounds)(nr, nc, tableSize) && board[nr][nc] === "player") {
                backward++;
                nr -= dr;
                nc -= dc;
            }
            const total = forward + backward + 1;
            if (total === 4) {
                const end1r = r + dr * (forward + 1);
                const end1c = c + dc * (forward + 1);
                const end2r = r - dr * (backward + 1);
                const end2c = c - dc * (backward + 1);
                const end1Open = (0, inBounds_1.inBounds)(end1r, end1c, tableSize) && board[end1r][end1c] === null;
                const end2Open = (0, inBounds_1.inBounds)(end2r, end2c, tableSize) && board[end2r][end2c] === null;
                if ((end1Open || end2Open) && !(end1Open && end2Open)) {
                    foundSemiOpenFour = true;
                    break;
                }
            }
        }
        board[r][c] = null;
        if (foundSemiOpenFour)
            return (0, toNotation_1.toNotation)(r, c);
    }
    // 5. Block fork (two open threes)
    for (const [r, c] of emptyCells) {
        board[r][c] = "player";
        const forks = (0, countOpenThrees_1.countOpenThrees)(board, r, c, "player", tableSize);
        board[r][c] = null;
        if (forks >= 2)
            return (0, toNotation_1.toNotation)(r, c);
    }
    // fallback to easy logic
    return (0, easy_1.getBotMove)(state, latestMove, tableSize);
}
//# sourceMappingURL=medium.js.map