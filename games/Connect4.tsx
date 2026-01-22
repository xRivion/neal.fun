import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROWS = 6;
const COLS = 7;
type Player = 1 | 2 | null; // 1 = Red (Human), 2 = Yellow (AI/Human)
type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme';

// Minimax Algorithm Helpers
const cloneBoard = (board: Player[][]) => board.map(row => [...row]);

const getValidLocations = (board: Player[][]) => {
  const locations = [];
  for (let c = 0; c < COLS; c++) {
    if (!board[0][c]) locations.push(c);
  }
  return locations;
};

const checkWin = (board: Player[][], piece: Player) => {
  // Horizontal
  for (let c = 0; c < COLS - 3; c++) {
    for (let r = 0; r < ROWS; r++) {
      if (board[r][c] === piece && board[r][c + 1] === piece && board[r][c + 2] === piece && board[r][c + 3] === piece) return true;
    }
  }
  // Vertical
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS - 3; r++) {
      if (board[r][c] === piece && board[r+1][c] === piece && board[r+2][c] === piece && board[r+3][c] === piece) return true;
    }
  }
  // Pos Diagonal
  for (let c = 0; c < COLS - 3; c++) {
    for (let r = 0; r < ROWS - 3; r++) {
      if (board[r][c] === piece && board[r+1][c+1] === piece && board[r+2][c+2] === piece && board[r+3][c+3] === piece) return true;
    }
  }
  // Neg Diagonal
  for (let c = 0; c < COLS - 3; c++) {
    for (let r = 3; r < ROWS; r++) {
      if (board[r][c] === piece && board[r-1][c+1] === piece && board[r-2][c+2] === piece && board[r-3][c+3] === piece) return true;
    }
  }
  return false;
};

const evaluateWindow = (window: Player[], piece: Player) => {
  let score = 0;
  const oppPiece = piece === 1 ? 2 : 1;
  const countPiece = window.filter(c => c === piece).length;
  const countEmpty = window.filter(c => c === null).length;
  const countOpp = window.filter(c => c === oppPiece).length;

  if (countPiece === 4) score += 100;
  else if (countPiece === 3 && countEmpty === 1) score += 5;
  else if (countPiece === 2 && countEmpty === 2) score += 2;

  if (countOpp === 3 && countEmpty === 1) score -= 4;

  return score;
};

const scorePosition = (board: Player[][], piece: Player) => {
  let score = 0;
  
  // Center column preference
  const centerArray = board.map(row => row[Math.floor(COLS/2)]);
  const centerCount = centerArray.filter(c => c === piece).length;
  score += centerCount * 3;

  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    const rowArray = board[r];
    for (let c = 0; c < COLS - 3; c++) {
      const window = rowArray.slice(c, c + 4);
      score += evaluateWindow(window, piece);
    }
  }

  // Vertical
  for (let c = 0; c < COLS; c++) {
    const colArray = board.map(row => row[c]);
    for (let r = 0; r < ROWS - 3; r++) {
      const window = colArray.slice(r, r + 4);
      score += evaluateWindow(window, piece);
    }
  }

  // Positive Diagonal
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const window = [board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]];
      score += evaluateWindow(window, piece);
    }
  }

  // Negative Diagonal
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const window = [board[r+3][c], board[r+2][c+1], board[r+1][c+2], board[r][c+3]];
      score += evaluateWindow(window, piece);
    }
  }

  return score;
};

const isTerminalNode = (board: Player[][]) => {
  return checkWin(board, 1) || checkWin(board, 2) || getValidLocations(board).length === 0;
};

const minimax = (board: Player[][], depth: number, alpha: number, beta: number, maximizingPlayer: boolean): [number, number] => {
  const validLocations = getValidLocations(board);
  const isTerminal = isTerminalNode(board);

  if (depth === 0 || isTerminal) {
    if (isTerminal) {
      if (checkWin(board, 2)) return [-1, 10000000];
      if (checkWin(board, 1)) return [-1, -10000000];
      return [-1, 0];
    } else {
      return [-1, scorePosition(board, 2)];
    }
  }

  if (maximizingPlayer) {
    let value = -Infinity;
    let column = validLocations[Math.floor(Math.random() * validLocations.length)];
    for (const col of validLocations) {
      const tempBoard = cloneBoard(board);
      // Drop piece
      for (let r = ROWS - 1; r >= 0; r--) {
        if (!tempBoard[r][col]) {
          tempBoard[r][col] = 2;
          break;
        }
      }
      const newScore = minimax(tempBoard, depth - 1, alpha, beta, false)[1];
      if (newScore > value) {
        value = newScore;
        column = col;
      }
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return [column, value];
  } else {
    let value = Infinity;
    let column = validLocations[Math.floor(Math.random() * validLocations.length)];
    for (const col of validLocations) {
      const tempBoard = cloneBoard(board);
      // Drop piece
      for (let r = ROWS - 1; r >= 0; r--) {
        if (!tempBoard[r][col]) {
          tempBoard[r][col] = 1;
          break;
        }
      }
      const newScore = minimax(tempBoard, depth - 1, alpha, beta, true)[1];
      if (newScore < value) {
        value = newScore;
        column = col;
      }
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    return [column, value];
  }
};

export const Connect4: React.FC = () => {
  const [board, setBoard] = useState<Player[][]>(
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [winner, setWinner] = useState<Player | 'draw'>(null);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [gameMode, setGameMode] = useState<'pvp' | 'ai' | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [selectingDifficulty, setSelectingDifficulty] = useState(false);

  const resetGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setCurrentPlayer(1);
    setWinner(null);
    setWinningCells([]);
    setAiThinking(false);
  };

  const getWinningCells = (board: Player[][], player: Player) => {
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c] !== player) continue;
        for (const [dr, dc] of directions) {
            let cells: [number, number][] = [[r,c]];
            for(let i=1; i<4; i++) {
                const nr = r + dr * i;
                const nc = c + dc * i;
                if(nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === player) {
                    cells.push([nr, nc]);
                } else {
                    break;
                }
            }
            if(cells.length === 4) return cells;
        }
      }
    }
    return [];
  };

  const handleDrop = useCallback((colIndex: number) => {
    if (winner || (currentPlayer === 2 && gameMode === 'ai' && !aiThinking && aiThinking)) return;

    let rowIndex = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!board[r][colIndex]) {
        rowIndex = r;
        break;
      }
    }

    if (rowIndex === -1) return;

    const newBoard = board.map(row => [...row]);
    newBoard[rowIndex][colIndex] = currentPlayer;
    setBoard(newBoard);

    if (checkWin(newBoard, currentPlayer)) {
      setWinner(currentPlayer);
      setWinningCells(getWinningCells(newBoard, currentPlayer));
    } else if (newBoard.every(row => row.every(cell => cell !== null))) {
      setWinner('draw');
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  }, [board, currentPlayer, winner, gameMode, aiThinking]);

  // AI Turn Effect
  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 2 && !winner && difficulty) {
      setAiThinking(true);
      const timer = setTimeout(() => {
        let depth = 4; // Default/Hard
        
        switch (difficulty) {
            case 'easy': depth = 2; break;
            case 'medium': depth = 3; break;
            case 'hard': depth = 5; break;
            case 'extreme': depth = 6; break;
        }

        const [bestCol] = minimax(board, depth, -Infinity, Infinity, true);
        if (bestCol !== -1) {
            handleDrop(bestCol);
        }
        setAiThinking(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, winner, board, handleDrop, difficulty]);

  if (!gameMode || (gameMode === 'ai' && !difficulty)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 animate-fade-in">
        <h2 className="text-4xl font-black text-gray-800 text-center">
            {selectingDifficulty ? "Selecciona Dificultad" : "Selecciona Modo de Juego"}
        </h2>
        
        {selectingDifficulty ? (
             <div className="grid grid-cols-2 gap-4 w-full max-w-md px-4">
                <button onClick={() => { setDifficulty('easy'); setGameMode('ai'); }} className="p-6 bg-green-100 text-green-700 rounded-2xl hover:bg-green-200 hover:-translate-y-1 transition-all font-bold text-xl">
                    Fácil
                    <div className="text-sm font-normal opacity-75 mt-1">Nivel principiante</div>
                </button>
                <button onClick={() => { setDifficulty('medium'); setGameMode('ai'); }} className="p-6 bg-yellow-100 text-yellow-700 rounded-2xl hover:bg-yellow-200 hover:-translate-y-1 transition-all font-bold text-xl">
                    Medio
                    <div className="text-sm font-normal opacity-75 mt-1">Nivel estándar</div>
                </button>
                <button onClick={() => { setDifficulty('hard'); setGameMode('ai'); }} className="p-6 bg-orange-100 text-orange-700 rounded-2xl hover:bg-orange-200 hover:-translate-y-1 transition-all font-bold text-xl">
                    Difícil
                    <div className="text-sm font-normal opacity-75 mt-1">Nivel experto</div>
                </button>
                <button onClick={() => { setDifficulty('extreme'); setGameMode('ai'); }} className="p-6 bg-red-100 text-red-700 rounded-2xl hover:bg-red-200 hover:-translate-y-1 transition-all font-bold text-xl relative overflow-hidden">
                    <span className="relative z-10">Extremo</span>
                    <div className="text-sm font-normal opacity-75 mt-1 relative z-10">Imposible</div>
                    <div className="absolute top-0 right-0 p-1">🔥</div>
                </button>
                <button onClick={() => setSelectingDifficulty(false)} className="col-span-2 mt-4 text-gray-400 hover:text-gray-600">
                    ← Volver
                </button>
             </div>
        ) : (
            <div className="flex flex-col md:flex-row gap-6">
            <button 
                onClick={() => setGameMode('pvp')}
                className="group relative flex flex-col items-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all w-64"
            >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">👥</div>
                <h3 className="text-2xl font-bold text-gray-800">2 Jugadores</h3>
                <p className="text-gray-500 mt-2">Juega con un amigo</p>
            </button>

            <button 
                onClick={() => setSelectingDifficulty(true)}
                className="group relative flex flex-col items-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all w-64 border-2 border-transparent hover:border-blue-500"
            >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🤖</div>
                <h3 className="text-2xl font-bold text-gray-800">1 Jugador</h3>
                <p className="text-gray-500 mt-2">Desafía a la IA</p>
            </button>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
            <h2 className="text-3xl font-black text-gray-800">4 en Raya</h2>
            <button onClick={() => { setGameMode(null); setDifficulty(null); setSelectingDifficulty(false); resetGame(); }} className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg transition-colors">
                Cambiar Modo
            </button>
        </div>
        
        {!winner ? (
          <div className="flex flex-col gap-1 items-center">
             <div className="flex items-center gap-2 justify-center text-xl font-bold text-gray-600">
                {aiThinking ? (
                    <span className="flex items-center gap-2">
                    La IA está pensando <span className="animate-pulse">...</span>
                    </span>
                ) : (
                    <>
                        Turno: 
                        <span className={`px-3 py-1 rounded-full text-white shadow-md flex items-center gap-2 ${currentPlayer === 1 ? 'bg-red-500' : 'bg-yellow-500'}`}>
                        {currentPlayer === 1 ? 'Rojo' : 'Amarillo'}
                        {gameMode === 'ai' && currentPlayer === 2 && ' (IA)'}
                        </span>
                    </>
                )}
            </div>
            {gameMode === 'ai' && difficulty && (
                <span className={`text-xs uppercase font-bold tracking-widest px-2 py-0.5 rounded
                    ${difficulty === 'easy' ? 'bg-green-100 text-green-600' : ''}
                    ${difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' : ''}
                    ${difficulty === 'hard' ? 'bg-orange-100 text-orange-600' : ''}
                    ${difficulty === 'extreme' ? 'bg-red-100 text-red-600' : ''}
                `}>
                    Dificultad: {difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Media' : difficulty === 'hard' ? 'Difícil' : 'Extrema'}
                </span>
            )}
          </div>
        ) : (
          <div className="text-2xl font-bold animate-bounce">
            {winner === 'draw' ? (
              <span className="text-gray-600">¡Empate!</span>
            ) : (
              <span className={winner === 1 ? 'text-red-500' : 'text-yellow-600'}>
                ¡Gana {winner === 1 ? 'Rojo' : (gameMode === 'ai' ? 'la IA' : 'Amarillo')}!
              </span>
            )}
          </div>
        )}
      </div>

      <div className="bg-blue-600 p-3 md:p-4 rounded-xl shadow-2xl relative inline-block">
        <div className="grid grid-cols-7 gap-2 md:gap-3">
          {Array(COLS).fill(0).map((_, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-2 md:gap-3 group">
              {/* Invisible Click Area */}
              <button
                className="absolute top-0 bottom-0 w-[14%] z-10 focus:outline-none"
                style={{ left: `${colIndex * 14.28}%` }}
                onClick={() => handleDrop(colIndex)}
                disabled={!!winner || (gameMode === 'ai' && currentPlayer === 2)}
              />
              {/* Hover Highlight */}
              {!winner && (!gameMode || gameMode === 'pvp' || currentPlayer === 1) && (
                 <div className="absolute top-0 bottom-0 w-[12%] bg-white/0 group-hover:bg-white/5 transition-colors pointer-events-none rounded-lg" style={{ left: `${colIndex * 14.28 + 1}%`}}></div>
              )}
              
              {Array(ROWS).fill(0).map((_, rowIndex) => {
                const cellValue = board[rowIndex][colIndex];
                const isWinningPiece = winningCells.some(([r, c]) => r === rowIndex && c === colIndex);
                
                return (
                  <div key={`${rowIndex}-${colIndex}`} className="w-10 h-10 md:w-16 md:h-16 bg-blue-700 rounded-full flex items-center justify-center relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                    {/* The Piece */}
                    <AnimatePresence>
                    {cellValue && (
                      <motion.div
                        initial={{ y: -400, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={`w-full h-full rounded-full shadow-[inset_0_-4px_4px_rgba(0,0,0,0.2),0_4px_4px_rgba(0,0,0,0.3)] z-0 ${
                          cellValue === 1 
                            ? 'bg-gradient-to-br from-red-400 to-red-600' 
                            : 'bg-gradient-to-br from-yellow-300 to-yellow-500'
                        } ${isWinningPiece ? 'ring-4 ring-white animate-pulse' : ''}`}
                      />
                    )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={resetGame}
        className="mt-8 px-8 py-3 bg-gray-800 text-white font-bold rounded-full hover:bg-black transition-colors shadow-lg transform active:scale-95"
      >
        Reiniciar Juego
      </button>
    </div>
  );
};
