

export interface AlgebraicMove {
  notation: string;
  row?: number;
  col?: number;
}

export interface BotGameSubmitPayload {
  /** All cells the human player occupied, in chronological order */
  playerMoves: AlgebraicMove[];
  /** All cells the AI occupied, in chronological order */
  botMoves: AlgebraicMove[];
  last_move: string;

  outcome: 'player' | 'bot' | 'draw' | 'abandoned';
}
