import { buildBoard } from "./buildBoard";
import { evaluateMove } from "./evaluateMove";
import { BoardState } from "./types";

export function generateHeatmap(
    state: BoardState,
    tableSize: number
): number[][] {
    const board = buildBoard(state, tableSize);
    const heatmap: number[][] = Array.from({ length: tableSize }, () =>
        Array(tableSize).fill(0)
    );

    for (let r = 0; r < tableSize; r++) {
        for (let c = 0; c < tableSize; c++) {
            if (board[r][c] !== null) continue;

            board[r][c] = "bot";
            const attack = evaluateMove(board, r, c, "bot", tableSize);

            board[r][c] = "player";
            const defend = evaluateMove(board, r, c, "player", tableSize);

            board[r][c] = null;

            heatmap[r][c] = attack + defend * 0.8;
        }
    }

    return heatmap;
}
