export type Player = "bot" | "player";
export type Cell = Player | null;

export interface BoardState {
    player: string[];
    bot: string[];
}

export const WIN_LENGTH = 5;

export function getWinLength(tableSize: number): number {
    return Math.min(WIN_LENGTH, tableSize);
}