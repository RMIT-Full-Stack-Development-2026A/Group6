"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBotByDifficulty = getBotByDifficulty;
const easy_1 = require("../utils/bots/easy");
const medium_1 = require("../utils/bots/medium");
const hard_1 = require("../utils/bots/hard");
function getBotByDifficulty(difficulty) {
    const d = (difficulty || "medium").toLowerCase();
    if (d === "easy")
        return easy_1.getBotMove;
    if (d === "hard")
        return hard_1.getBotMove;
    return medium_1.getBotMove;
}
//# sourceMappingURL=bots.repository.js.map