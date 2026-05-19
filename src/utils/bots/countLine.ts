import { inBounds } from "./inBounds";
import { Cell, Player } from "./types";

export function countLine(
    board: Cell[][],
    r: number,
    c: number,
    dr: number,
    dc: number,
    player: Player,
    size: number
): number {
    let count = 0;
    let nr = r + dr;
    let nc = c + dc;

    while (inBounds(nr, nc, size) && board[nr][nc] === player) {
        count++;
        nr += dr;
        nc += dc;
    }

    return count;
}
