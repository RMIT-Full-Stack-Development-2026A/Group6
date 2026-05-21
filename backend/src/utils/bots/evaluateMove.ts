import { directions } from "./directions";
import { countLine } from "./countLine";
import { Player, Cell } from "./types";

export function evaluateMove(
    board: Cell[][],
    r: number,
    c: number,
    player: Player,
    size: number
): number {
    let score = 0;

    for (const [dr, dc] of directions) {
        const forward = countLine(board, r, c, dr, dc, player, size);
        const backward = countLine(board, r, c, -dr, -dc, player, size);
        const total = forward + backward + 1;

        if (total >= 5) score += 100000;
        else if (total === 4) score += 10000;
        else if (total === 3) score += 1000;
        else if (total === 2) score += 100;
    }

    return score;
}
