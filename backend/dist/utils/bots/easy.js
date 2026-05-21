"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBotMove = getBotMove;
const buildBoard_1 = require("./buildBoard");
const toCoord_1 = require("./toCoord");
const toNotation_1 = require("./toNotation");
const inBounds_1 = require("./inBounds");
const getRandomMove_1 = require("./getRandomMove");
function getBotMove(state, latestMove, tableSize) {
    // empty board → random
    if (state.player.length === 0 && state.bot.length === 0) {
        return (0, getRandomMove_1.getRandomMove)(tableSize);
    }
    const board = (0, buildBoard_1.buildBoard)(state, tableSize);
    if (!latestMove) {
        // no latest move — pick any random empty cell
        const empties = [];
        for (let r = 0; r < tableSize; r++) {
            for (let c = 0; c < tableSize; c++) {
                if (board[r][c] === null)
                    empties.push([r, c]);
            }
        }
        if (empties.length === 0)
            return null;
        const pick = empties[Math.floor(Math.random() * empties.length)];
        return (0, toNotation_1.toNotation)(pick[0], pick[1]);
    }
    const [lr, lc] = (0, toCoord_1.toCoord)(latestMove);
    const candidates = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0)
                continue;
            const nr = lr + dr;
            const nc = lc + dc;
            if ((0, inBounds_1.inBounds)(nr, nc, tableSize) && board[nr][nc] === null) {
                candidates.push([nr, nc]);
            }
        }
    }
    if (candidates.length > 0) {
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        return (0, toNotation_1.toNotation)(pick[0], pick[1]);
    }
    // fallback: pick any empty cell
    const empties = [];
    for (let r = 0; r < tableSize; r++) {
        for (let c = 0; c < tableSize; c++) {
            if (board[r][c] === null)
                empties.push([r, c]);
        }
    }
    if (empties.length === 0)
        return null;
    const pick = empties[Math.floor(Math.random() * empties.length)];
    return (0, toNotation_1.toNotation)(pick[0], pick[1]);
}
//# sourceMappingURL=easy.js.map