"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateMove = evaluateMove;
const directions_1 = require("./directions");
const countLine_1 = require("./countLine");
function evaluateMove(board, r, c, player, size) {
    let score = 0;
    for (const [dr, dc] of directions_1.directions) {
        const forward = (0, countLine_1.countLine)(board, r, c, dr, dc, player, size);
        const backward = (0, countLine_1.countLine)(board, r, c, -dr, -dc, player, size);
        const total = forward + backward + 1;
        if (total >= 5)
            score += 100000;
        else if (total === 4)
            score += 10000;
        else if (total === 3)
            score += 1000;
        else if (total === 2)
            score += 100;
    }
    return score;
}
//# sourceMappingURL=evaluateMove.js.map