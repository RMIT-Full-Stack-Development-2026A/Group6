"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WIN_LENGTH = void 0;
exports.getWinLength = getWinLength;
exports.WIN_LENGTH = 5;
function getWinLength(tableSize) {
    return Math.min(exports.WIN_LENGTH, tableSize);
}
//# sourceMappingURL=types.js.map