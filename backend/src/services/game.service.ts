import mongoose from 'mongoose';
import gameRepository from '../repositories/game.repository';
import { IGame, IMove, CellValue } from '../models/game.model';



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



/**
 * Converts a zero-based column index to a letter string.
 * col 0 → "a", col 25 → "z", col 26 → "aa", etc.
 */
export function colToAlpha(col: number): string {
  let result = '';
  let n = col;
  do {
    result = String.fromCharCode(97 + (n % 26)) + result;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return result;
}

/**
 * Converts algebraic notation back to { row, col } (zero-based).
 * "a1" → { col: 0, row: gridSize - 1 } (row 1 = bottom row).
 */
export function algebraicToCoords(
  notation: string,
  gridSize: number
): { row: number; col: number } {
  const match = notation.match(/^([a-z]+)(\d+)$/i);
  if (!match) throw new Error(`Invalid algebraic notation: "${notation}"`);

  const letters = match[1].toLowerCase();
  const number = parseInt(match[2], 10);


  let col = 0;
  for (let i = 0; i < letters.length; i++) {
    col = col * 26 + (letters.charCodeAt(i) - 96);
  }
  col -= 1; 


  const row = gridSize - number;

  return { row, col };
}

/**
 * Merges player + bot moves into a single time-ordered IMove array.
 * The AI is represented by the sentinel ObjectId stored on the game.
 */
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


  async createGame(gameData: Partial<IGame>): Promise<IGame> {
    try {
      return await gameRepository.create(gameData);
    } catch (error) {
      throw error;
    }
  }

  async getGameById(id: string): Promise<IGame> {
    try {
      const game = await gameRepository.findById(id);
      if (!game) throw new Error('Game not found');
      return game;
    } catch (error) {
      throw error;
    }
  }

  async getAllGames(): Promise<IGame[]> {
    try {
      return await gameRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async updateGame(id: string, gameData: Partial<IGame>): Promise<IGame> {
    try {
      const game = await gameRepository.update(id, gameData);
      if (!game) throw new Error('Game not found');
      return game;
    } catch (error) {
      throw error;
    }
  }

  async deleteGame(id: string): Promise<IGame> {
    try {
      const game = await gameRepository.delete(id);
      if (!game) throw new Error('Game not found');
      return game;
    } catch (error) {
      throw error;
    }
  }

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

    
    const playerSymbol: 'X' | 'O' =
      game.players.playerX ? 'X' : 'O';
    const botSymbol: 'X' | 'O' = playerSymbol === 'X' ? 'O' : 'X';

    const playerId = game.players.playerX ?? game.players.playerO;
    if (!playerId) throw new Error('No player found on game');

    // Sentinel ObjectId for the AI (stored as winner when bot wins)
    const BOT_OID = new mongoose.Types.ObjectId('000000000000000000000001');


    const moves = buildMoveList(
      playerMoves,
      botMoves,
      playerSymbol,
      botSymbol,
      playerId as mongoose.Types.ObjectId,
      BOT_OID,
      gridSize
    );

  
    const boardState = buildBoardState(
      gridSize,
      playerMoves,
      botMoves,
      playerSymbol,
      botSymbol
    );

    
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
