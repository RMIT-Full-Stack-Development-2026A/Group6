import { buildBoard } from "./buildBoard";

export function printHeatmap(
    heatmap: number[][],
    state: any,
    tableSize: number
) {
    const board = buildBoard(state, tableSize);

    let header = "   ";
    for (let c = 0; c < tableSize; c++) {
        header += String.fromCharCode(65 + c).padStart(6, " ");
    }
    console.log(header);

    for (let r = 0; r < tableSize; r++) {
        let rowStr = (r + 1).toString().padStart(3, " ");

        for (let c = 0; c < tableSize; c++) {
            if (board[r][c] === "bot") {
                rowStr += "  BOT ";
            } else if (board[r][c] === "player") {
                rowStr += "  YOU ";
            } else {
                rowStr += heatmap[r][c].toString().padStart(6, " ");
            }
        }

        console.log(rowStr);
    }
}
