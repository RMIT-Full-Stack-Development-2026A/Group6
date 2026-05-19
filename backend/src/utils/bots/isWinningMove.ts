import { directions } from "./directions";
import { countLine } from "./countLine";
import { Player, Cell, getWinLength } from "./types";

export function isWinningMove(
    board: Cell[][],
    r: number,
    c: number,
    player: Player,
    size: number
): boolean {
    const needed = getWinLength(size);
    for (const [dr, dc] of directions) {
        const total =
            1 +
            countLine(board, r, c, dr, dc, player, size) +
            countLine(board, r, c, -dr, -dc, player, size);

        if (total >= needed) return true;
    }
    return false;
}