import { getBotByDifficulty } from "../repositories/bots.repository";

interface BotRequest {
  state: { player: string[]; bot: string[] };
  latestMove?: string;
  tableSize?: number;
}

async function computeMove(difficulty: string, payload: BotRequest) {
  const fn = getBotByDifficulty(difficulty);
  const state = payload.state || { player: [], bot: [] };
  const latestMove = payload.latestMove || "";
  const tableSize = payload.tableSize || 15;

  const move = fn(state as any, latestMove, tableSize);
  return move;
}

export default { computeMove };
