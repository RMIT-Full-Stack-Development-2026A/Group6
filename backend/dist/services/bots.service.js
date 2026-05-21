"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bots_repository_1 = require("../repositories/bots.repository");
async function computeMove(difficulty, payload) {
    const fn = (0, bots_repository_1.getBotByDifficulty)(difficulty);
    const state = payload.state || { player: [], bot: [] };
    const latestMove = payload.latestMove || "";
    const tableSize = payload.tableSize || 15;
    const move = fn(state, latestMove, tableSize);
    return move;
}
exports.default = { computeMove };
//# sourceMappingURL=bots.service.js.map