import { directions } from "./directions";
import { countLine } from "./countLine";
import { Player, Cell } from "./types";
import { WIN_LENGTH } from "./types";

export function isWinningMove(
    board: Cell[][],
    r: number,
    c: number,
    player: Player,
    size: number
): boolean {
    for (const [dr, dc] of directions) {
        const total =
            1 +
            countLine(board, r, c, dr, dc, player, size) +
            countLine(board, r, c, -dr, -dc, player, size);

        if (total >= WIN_LENGTH) return true;
    }
    return false;
}
