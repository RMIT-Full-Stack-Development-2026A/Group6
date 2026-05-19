import { getBotMove as easy } from "../utils/bots/easy";
import { getBotMove as medium } from "../utils/bots/medium";
import { getBotMove as hard } from "../utils/bots/hard";

export type Difficulty = "easy" | "medium" | "hard";

export function getBotByDifficulty(difficulty: string) {
  const d = (difficulty || "medium").toLowerCase();
  if (d === "easy") return easy;
  if (d === "hard") return hard;
  return medium;
}
