"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomMove = getRandomMove;
const toNotation_1 = require("./toNotation");
function getRandomMove(size) {
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    return (0, toNotation_1.toNotation)(r, c);
}
//# sourceMappingURL=getRandomMove.js.map