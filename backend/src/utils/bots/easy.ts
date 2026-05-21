// easy bot: plays randomly near the last move, no threat detection
import { BoardState, Cell } from "./types";
import { buildBoard } from "./buildBoard";
import { toCoord } from "./toCoord";
import { toNotation } from "./toNotation";
import { inBounds } from "./inBounds";
import { getRandomMove } from "./getRandomMove";

export function getBotMove(
    state: BoardState,
    latestMove: string,
    tableSize: number
): string | null {
    // empty board → random
    if (state.player.length === 0 && state.bot.length === 0) {
        return getRandomMove(tableSize);
    }

    const board: Cell[][] = buildBoard(state, tableSize);

    if (!latestMove) {
        // no latest move — pick any random empty cell
        const empties: [number, number][] = [];
        for (let r = 0; r < tableSize; r++) {
            for (let c = 0; c < tableSize; c++) {
                if (board[r][c] === null) empties.push([r, c]);
            }
        }
        if (empties.length === 0) return null;
        const pick = empties[Math.floor(Math.random() * empties.length)];
        return toNotation(pick[0], pick[1]);
    }

    const [lr, lc] = toCoord(latestMove);

    const candidates: [number, number][] = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = lr + dr;
            const nc = lc + dc;
            if (inBounds(nr, nc, tableSize) && board[nr][nc] === null) {
                candidates.push([nr, nc]);
            }
        }
    }

    if (candidates.length > 0) {
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        return toNotation(pick[0], pick[1]);
    }

    // fallback: pick any empty cell
    const empties: [number, number][] = [];
    for (let r = 0; r < tableSize; r++) {
        for (let c = 0; c < tableSize; c++) {
            if (board[r][c] === null) empties.push([r, c]);
        }
    }
    if (empties.length === 0) return null;
    const pick = empties[Math.floor(Math.random() * empties.length)];
    return toNotation(pick[0], pick[1]);
}