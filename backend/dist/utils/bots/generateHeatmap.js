"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHeatmap = generateHeatmap;
const buildBoard_1 = require("./buildBoard");
const evaluateMove_1 = require("./evaluateMove");
function generateHeatmap(state, tableSize) {
    const board = (0, buildBoard_1.buildBoard)(state, tableSize);
    const heatmap = Array.from({ length: tableSize }, () => Array(tableSize).fill(0));
    for (let r = 0; r < tableSize; r++) {
        for (let c = 0; c < tableSize; c++) {
            if (board[r][c] !== null)
                continue;
            board[r][c] = "bot";
            const attack = (0, evaluateMove_1.evaluateMove)(board, r, c, "bot", tableSize);
            board[r][c] = "player";
            const defend = (0, evaluateMove_1.evaluateMove)(board, r, c, "player", tableSize);
            board[r][c] = null;
            heatmap[r][c] = attack + defend * 0.8;
        }
    }
    return heatmap;
}
//# sourceMappingURL=generateHeatmap.js.map