import { getBotMove as easy } from "../utils/bots/easy";
export type Difficulty = "easy" | "medium" | "hard";
export declare function getBotByDifficulty(difficulty: string): typeof easy;
