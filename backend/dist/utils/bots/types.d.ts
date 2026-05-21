export type Player = "bot" | "player";
export type Cell = Player | null;
export interface BoardState {
    player: string[];
    bot: string[];
}
export declare const WIN_LENGTH = 5;
export declare function getWinLength(tableSize: number): number;
