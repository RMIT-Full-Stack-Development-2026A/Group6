// medium bot: wins, blocks, and prevents forks before falling back to easy logic
import { BoardState, Cell, Player } from "./types";
import { buildBoard } from "./buildBoard";
import { toNotation } from "./toNotation";
import { isWinningMove } from "./isWinningMove";
import { countOpenThrees } from "./countOpenThrees";
import { inBounds } from "./inBounds";
import { directions } from "./directions";
import { getBotMove as easyGetBotMove } from "./easy";
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

    const emptyCells: [number, number][] = [];
    for (let r = 0; r < tableSize; r++) {
        for (let c = 0; c < tableSize; c++) {
            if (board[r][c] === null) emptyCells.push([r, c]);
        }
    }

    // 1. Win if possible
    for (const [r, c] of emptyCells) {
        board[r][c] = "bot";
        if (isWinningMove(board, r, c, "bot", tableSize)) {
            board[r][c] = null;
            return toNotation(r, c);
        }
        board[r][c] = null;
    }

    // 2. Block immediate win
    for (const [r, c] of emptyCells) {
        board[r][c] = "player";
        if (isWinningMove(board, r, c, "player", tableSize)) {
            board[r][c] = null;
            return toNotation(r, c);
        }
        board[r][c] = null;
    }

    // 3. Block 3-sequence open on both sides (open threes)
    for (const [r, c] of emptyCells) {
        board[r][c] = "player";
        const openThrees = countOpenThrees(board, r, c, "player", tableSize);
        board[r][c] = null;
        if (openThrees > 0) return toNotation(r, c);
    }

    // 4. Block 4-sequence open on 1 side (semi-open four)
    for (const [r, c] of emptyCells) {
        board[r][c] = "player";
        let foundSemiOpenFour = false;

        for (const [dr, dc] of directions) {
            // count contiguous in both directions
            let forward = 0;
            let nr = r + dr;
            let nc = c + dc;
            while (inBounds(nr, nc, tableSize) && board[nr][nc] === "player") {
                forward++;
                nr += dr;
                nc += dc;
            }

            let backward = 0;
            nr = r - dr;
            nc = c - dc;
            while (inBounds(nr, nc, tableSize) && board[nr][nc] === "player") {
                backward++;
                nr -= dr;
                nc -= dc;
            }

            const total = forward + backward + 1;
            if (total === 4) {
                const end1r = r + dr * (forward + 1);
                const end1c = c + dc * (forward + 1);
                const end2r = r - dr * (backward + 1);
                const end2c = c - dc * (backward + 1);

                const end1Open = inBounds(end1r, end1c, tableSize) && board[end1r][end1c] === null;
                const end2Open = inBounds(end2r, end2c, tableSize) && board[end2r][end2c] === null;

                if ((end1Open || end2Open) && !(end1Open && end2Open)) {
                    foundSemiOpenFour = true;
                    break;
                }
            }
        }

        board[r][c] = null;
        if (foundSemiOpenFour) return toNotation(r, c);
    }

    // 5. Block fork (two open threes)
    for (const [r, c] of emptyCells) {
        board[r][c] = "player";
        const forks = countOpenThrees(board, r, c, "player", tableSize);
        board[r][c] = null;
        if (forks >= 2) return toNotation(r, c);
    }

    // fallback to easy logic
    return easyGetBotMove(state, latestMove, tableSize);
}