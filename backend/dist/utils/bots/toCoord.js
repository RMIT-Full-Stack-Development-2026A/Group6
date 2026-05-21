"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCoord = toCoord;
function toCoord(pos) {
    const col = pos.charCodeAt(0) - 65;
    const row = parseInt(pos.slice(1), 10) - 1;
    return [row, col];
}
//# sourceMappingURL=toCoord.js.map