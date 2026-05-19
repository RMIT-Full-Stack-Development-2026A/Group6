import { directions } from "./directions";
import { countLine } from "./countLine";
import { inBounds } from "./inBounds";
import { Player, Cell } from "./types";

export function countOpenThrees(
    board: Cell[][],
    r: number,
    c: number,
    player: Player,
    size: number
): number {
    let openThrees = 0;

    for (const [dr, dc] of directions) {
        const forward = countLine(board, r, c, dr, dc, player, size);
        const backward = countLine(board, r, c, -dr, -dc, player, size);
        const total = forward + backward + 1;

        if (total === 3) {
            const end1r = r + dr * (forward + 1);
            const end1c = c + dc * (forward + 1);
            const end2r = r - dr * (backward + 1);
            const end2c = c - dc * (backward + 1);

            if (
                inBounds(end1r, end1c, size) &&
                inBounds(end2r, end2c, size) &&
                board[end1r][end1c] === null &&
                board[end2r][end2c] === null
            ) {
                openThrees++;
            }
        }
    }

    return openThrees;
}
