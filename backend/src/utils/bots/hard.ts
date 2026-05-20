import { BoardState } from "./types";
import { buildBoard } from "./buildBoard";
import { countOpenThrees } from "./countOpenThrees";
import { evaluateMove } from "./evaluateMove";
import { getRandomMove } from "./getRandomMove";
import { isWinningMove } from "./isWinningMove";
import { toNotation } from "./toNotation";
import { generateHeatmap } from "./generateHeatmap";
//import { printHeatmap } from "./printHeatmap";

export function getBotMove(
    state: BoardState,
    latestMove: string,
    tableSize: number
): string | null {
    // empty board → random
    if (state.player.length === 0 && state.bot.length === 0) {
        const move = getRandomMove(tableSize);
        console.log("Random opening move:", move);
        return move;
    }

    const board = buildBoard(state, tableSize);

    const heatmap = generateHeatmap(state, tableSize);
    //printHeatmap(heatmap, state, tableSize);

    const emptyCells: [number, number][] = [];

    for (let r = 0; r < tableSize; r++) {
        for (let c = 0; c < tableSize; c++) {
            if (board[r][c] === null) {
                emptyCells.push([r, c]);
            }
        }
    }

    // 1. Win
    for (const [r, c] of emptyCells) {
        board[r][c] = "bot";
        if (isWinningMove(board, r, c, "bot", tableSize)) {
            board[r][c] = null;
            return toNotation(r, c);
        }
        board[r][c] = null;
    }

    // 2. Block
    for (const [r, c] of emptyCells) {
        board[r][c] = "player";
        if (isWinningMove(board, r, c, "player", tableSize)) {
            board[r][c] = null;
            return toNotation(r, c);
        }
        board[r][c] = null;
    }

    // 3. Fork
    for (const [r, c] of emptyCells) {
        board[r][c] = "bot";
        const forks = countOpenThrees(board, r, c, "bot", tableSize);
        board[r][c] = null;

        if (forks >= 2) return toNotation(r, c);
    }

    // 4. Block fork
    for (const [r, c] of emptyCells) {
        board[r][c] = "player";
        const forks = countOpenThrees(board, r, c, "player", tableSize);
        board[r][c] = null;

        if (forks >= 2) return toNotation(r, c);
    }

    // 5. Heuristic
    let bestScore = -Infinity;
    let bestMove: [number, number] | null = null;

    for (const [r, c] of emptyCells) {
        board[r][c] = "bot";
        const attack = evaluateMove(board, r, c, "bot", tableSize);

        board[r][c] = "player";
        const defend = evaluateMove(board, r, c, "player", tableSize);

        board[r][c] = null;

        const score = attack + defend * 0.8;

        if (score > bestScore) {
            bestScore = score;
            bestMove = [r, c];
        }
    }

    return bestMove ? toNotation(bestMove[0], bestMove[1]) : null;
}

// --- TEST CALL ---
/*console.log(
    getBotMove(
        {
            player: [
                "F6",
                "G8",
                "K12",
                "J9",
                "I7",
                "I12",
                "K11",
                "F11",
                "H12",
                "H7",
            ],
            bot: [
                "H8",
                "H10",
                "G11",
                "H11",
                "I11",
                "I8",
                "I9",
                "I10",
                "H9",
                "J11",
            ],
        },
        "",
        15
    )
);
*/