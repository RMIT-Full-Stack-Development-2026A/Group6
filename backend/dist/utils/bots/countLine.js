"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countLine = countLine;
const inBounds_1 = require("./inBounds");
function countLine(board, r, c, dr, dc, player, size) {
    let count = 0;
    let nr = r + dr;
    let nc = c + dc;
    while ((0, inBounds_1.inBounds)(nr, nc, size) && board[nr][nc] === player) {
        count++;
        nr += dr;
        nc += dc;
    }
    return count;
}
//# sourceMappingURL=countLine.js.map