"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countOpenThrees = countOpenThrees;
const directions_1 = require("./directions");
const countLine_1 = require("./countLine");
const inBounds_1 = require("./inBounds");
function countOpenThrees(board, r, c, player, size) {
    let openThrees = 0;
    for (const [dr, dc] of directions_1.directions) {
        const forward = (0, countLine_1.countLine)(board, r, c, dr, dc, player, size);
        const backward = (0, countLine_1.countLine)(board, r, c, -dr, -dc, player, size);
        const total = forward + backward + 1;
        if (total === 3) {
            const end1r = r + dr * (forward + 1);
            const end1c = c + dc * (forward + 1);
            const end2r = r - dr * (backward + 1);
            const end2c = c - dc * (backward + 1);
            if ((0, inBounds_1.inBounds)(end1r, end1c, size) &&
                (0, inBounds_1.inBounds)(end2r, end2c, size) &&
                board[end1r][end1c] === null &&
                board[end2r][end2c] === null) {
                openThrees++;
            }
        }
    }
    return openThrees;
}
//# sourceMappingURL=countOpenThrees.js.map