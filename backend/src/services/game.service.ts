import mongoose from 'mongoose';
import gameRepository from '../repositories/game.repository';
import { IGame, IMove, CellValue } from '../models/game.model';

// Represents a single move in algebraic notation (e.g. "a1") with optional pre-parsed coords
export interface AlgebraicMove {
  notation: string;
  row: number;
  col: number;
}

export interface BotGamePayload {
  playerMoves: AlgebraicMove[];
  botMoves: AlgebraicMove[];
  last_move: string;
}

// Converts a zero-based column index to a spreadsheet-style letter string (0 -> "a", 26 -> "aa")
export function colToAlpha(col: number): string {
  let result = '';
  let n = col;
  do {
    result = String.fromCharCode(97 + (n % 26)) + result;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return result;
}

// Parses algebraic notation into row/col coordinates relative to the given grid size
export function algebraicToCoords(
  notation: string,
  gridSize: number
): { row: number; col: number } {
  const normalized = notation.toLowerCase();
  const match = normalized.match(/^([a-z]+)(\d+)$/);
  if (!match) throw new Error(`Invalid algebraic notation: "${notation}"`);

  const letters = match[1];
  const number = parseInt(match[2], 10);

  let col = 0;
  for (let i = 0; i < letters.length; i++) {
    col = col * 26 + (letters.charCodeAt(i) - 96);
  }
  col -= 1;

  // Row numbering is bottom-up, so row 1 maps to the last row index
  const row = gridSize - number;

  return { row, col };
}

// Merges player and bot move arrays into a single chronologically ordered IMove list
function buildMoveList(
  playerMoves: AlgebraicMove[],
  botMoves: AlgebraicMove[],
  playerSymbol: 'X' | 'O',
  botSymbol: 'X' | 'O',
  playerId: mongoose.Types.ObjectId,
  botId: mongoose.Types.ObjectId,
  gridSize: number
): IMove[] {
  const toIMove = (
    m: AlgebraicMove,
    symbol: 'X' | 'O',
    player: mongoose.Types.ObjectId,
    idx: number,
    isBot: boolean
  ): IMove => ({
    player,
    position: {
      row: m.row ?? algebraicToCoords(m.notation, gridSize).row,
      col: m.col ?? algebraicToCoords(m.notation, gridSize).col,
      algebraic: m.notation,
    },
    symbol,
    // Stagger timestamps by 500ms to preserve move order in the DB
    timestamp: new Date(Date.now() + idx * 500),
  } as IMove);

  const playerList: Array<{ move: IMove; order: number }> = playerMoves.map(
    (m, i) => ({ move: toIMove(m, playerSymbol, playerId, i * 2, false), order: i * 2 })
  );
  const botList: Array<{ move: IMove; order: number }> = botMoves.map(
    (m, i) => ({ move: toIMove(m, botSymbol, botId, i * 2 + 1, true), order: i * 2 + 1 })
  );

  return [...playerList, ...botList]
    .sort((a, b) => a.order - b.order)
    .map((x) => x.move);
}

// Reconstructs the final board state from the two move lists
function buildBoardState(
  gridSize: number,
  playerMoves: AlgebraicMove[],
  botMoves: AlgebraicMove[],
  playerSymbol: 'X' | 'O',
  botSymbol: 'X' | 'O'
): CellValue[][] {
  const board: CellValue[][] = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(null)
  );

  const apply = (moves: AlgebraicMove[], symbol: CellValue) => {
    for (const m of moves) {
      const row = m.row ?? algebraicToCoords(m.notation, gridSize).row;
      const col = m.col ?? algebraicToCoords(m.notation, gridSize).col;
      if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        board[row][col] = symbol;
      }
    }
  };

  apply(playerMoves, playerSymbol);
  apply(botMoves, botSymbol);
  return board;
}


class GameService {

  // Creates a new game document with the calling user set as the owner
  async createGame(userId: string, gameData: Partial<IGame>): Promise<IGame> {
    try {
      const oid = new mongoose.Types.ObjectId(userId);
      const players = {
        playerX: oid,
        playerO: gameData.players?.playerO ?? null,
        player2Name: gameData.players?.player2Name ?? '',
      };
      return await gameRepository.create({
        ...gameData,
        players,
        startedAt: new Date(),
      });
    } catch (error) {
      throw error;
    }
  }

  // Fetches a single game or throws if it does not exist
  async getGameById(id: string): Promise<IGame> {
    try {
      const game = await gameRepository.findById(id);
      if (!game) throw new Error('Game not found');
      return game;
    } catch (error) {
      throw error;
    }
  }

  // Returns every game in the collection, intended for admin use
  async getAllGames(): Promise<IGame[]> {
    try {
      return await gameRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  // Returns paginated games for a specific player
  async getGamesByPlayer(userId: string, page: number, limit: number): Promise<{ games: IGame[]; total: number }> {
    try {
      return await gameRepository.findByPlayerPaginated(userId, page, limit);
    } catch (error) {
      throw error;
    }
  }

  // Applies a partial update to a game document
  async updateGame(id: string, gameData: Partial<IGame>): Promise<IGame> {
    try {
      const game = await gameRepository.update(id, gameData);
      if (!game) throw new Error('Game not found');
      return game;
    } catch (error) {
      throw error;
    }
  }

  // Permanently removes a game document
  async deleteGame(id: string): Promise<IGame> {
    try {
      const game = await gameRepository.delete(id);
      if (!game) throw new Error('Game not found');
      return game;
    } catch (error) {
      throw error;
    }
  }

  // Entry point for persisting a finished bot game, delegates to recordBotGameMoves
  async saveBotGame(
    gameId: string,
    userId: string,
    playerMoves: AlgebraicMove[],
    botMoves: AlgebraicMove[],
    last_move: string,
    outcome: 'player' | 'bot' | 'draw' | 'abandoned'
  ): Promise<IGame> {
    return this.recordBotGameMoves(gameId, playerMoves, botMoves, last_move, outcome);
  }

  // Validates the game state then writes moves, board, result and status in one update
  async recordBotGameMoves(
    gameId: string,
    playerMoves: AlgebraicMove[],
    botMoves: AlgebraicMove[],
    last_move: string,
    outcome: 'player' | 'bot' | 'draw' | 'abandoned'
  ): Promise<IGame> {
   
    const game = await gameRepository.findById(gameId);
    if (!game) throw new Error('Game not found');
    if (game.gameMode !== 'bot') throw new Error('Game is not a bot game');
    if (game.status === 'completed' || game.status === 'abandoned') {
      throw new Error('Game has already ended');
    }

    const gridSize = game.gridSize;

    // The human player always takes the side that is set on the game document
    const playerSymbol: 'X' | 'O' =
      game.players.playerX ? 'X' : 'O';
    const botSymbol: 'X' | 'O' = playerSymbol === 'X' ? 'O' : 'X';

    const playerId = game.players.playerX ?? game.players.playerO;
    if (!playerId) throw new Error('No player found on game');

    // Fixed sentinel ObjectId used to identify the AI in the moves list
    const BOT_OID = new mongoose.Types.ObjectId('000000000000000000000001');

    // Normalize notation to lowercase before processing
    const normalizedPlayerMoves = playerMoves.map((m) => ({
      ...m,
      notation: m.notation.toLowerCase(),
    }));
    const normalizedBotMoves = botMoves.map((m) => ({
      ...m,
      notation: m.notation.toLowerCase(),
    }));

    const moves = buildMoveList(
      normalizedPlayerMoves,
      normalizedBotMoves,
      playerSymbol,
      botSymbol,
      playerId as mongoose.Types.ObjectId,
      BOT_OID,
      gridSize
    );

    const boardState = buildBoardState(
      gridSize,
      normalizedPlayerMoves,
      normalizedBotMoves,
      playerSymbol,
      botSymbol
    );

    // Map outcome string to the status/result/winner fields expected by the model
    let status: IGame['status'];
    let result: IGame['result'];
    let winner: IGame['winner'];

    switch (outcome) {
      case 'player':
        status = 'completed';
        result = playerSymbol;
        winner = playerId as mongoose.Types.ObjectId;
        break;
      case 'bot':
        status = 'completed';
        result = botSymbol;
        winner = 'AI';
        break;
      case 'draw':
        status = 'completed';
        result = 'draw';
        winner = null;
        break;
      case 'abandoned':
      default:
        status = 'abandoned';
        result = null;
        winner = null;
        break;
    }

    const updated = await gameRepository.submitBotMoves(
      gameId,
      moves,
      status,
      result,
      winner,
      boardState,
      new Date()
    );

    if (!updated) throw new Error('Failed to update game');
    return updated;
  }
}

export default new GameService();