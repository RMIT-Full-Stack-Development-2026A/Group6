"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWinningMove = isWinningMove;
const directions_1 = require("./directions");
const countLine_1 = require("./countLine");
const types_1 = require("./types");
function isWinningMove(board, r, c, player, size) {
    const needed = (0, types_1.getWinLength)(size);
    for (const [dr, dc] of directions_1.directions) {
        const total = 1 +
            (0, countLine_1.countLine)(board, r, c, dr, dc, player, size) +
            (0, countLine_1.countLine)(board, r, c, -dr, -dc, player, size);
        if (total >= needed)
            return true;
    }
    return false;
}
//# sourceMappingURL=isWinningMove.js.map