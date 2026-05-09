import { BoardState, Cell } from "./types";
import { toCoord } from "./toCoord";

export function buildBoard(state: BoardState, size: number): Cell[][] {
    const board: Cell[][] = Array.from({ length: size }, () =>
        Array(size).fill(null)
    );

    for (const move of state.player) {
        const [r, c] = toCoord(move);
        if (r < size && c < size) board[r][c] = "player";
    }

    for (const move of state.bot) {
        const [r, c] = toCoord(move);
        if (r < size && c < size) board[r][c] = "bot";
    }

    return board;
}
