"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildBoard = buildBoard;
const toCoord_1 = require("./toCoord");
function buildBoard(state, size) {
    const board = Array.from({ length: size }, () => Array(size).fill(null));
    for (const move of state.player) {
        const [r, c] = (0, toCoord_1.toCoord)(move);
        if (r < size && c < size)
            board[r][c] = "player";
    }
    for (const move of state.bot) {
        const [r, c] = (0, toCoord_1.toCoord)(move);
        if (r < size && c < size)
            board[r][c] = "bot";
    }
    return board;
}
//# sourceMappingURL=buildBoard.js.map