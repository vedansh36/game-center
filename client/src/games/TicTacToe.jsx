import { useState, useCallback } from 'react';

const WIN_LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function checkWinner(b) {
  for (const [a,c,d] of WIN_LINES) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  }
  return b.every(Boolean) ? 'draw' : null;
}

function minimax(board, depth, isMax) {
  const w = checkWinner(board);
  if (w === 'O') return 10 - depth;
  if (w === 'X') return depth - 10;
  if (w === 'draw') return 0;
  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X';
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = null;
      }
    }
    return best;
  }
}

function bestMove(board) {
  let best = -Infinity, move = -1;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O';
      const val = minimax(board, 0, false);
      board[i] = null;
      if (val > best) { best = val; move = i; }
    }
  }
  return move;
}

export default function TicTacToe({ onGameEnd }) {
  const [board,    setBoard]    = useState(Array(9).fill(null));
  const [gameOver, setGameOver] = useState(false);
  const [status,   setStatus]   = useState('Your turn — you are X');

  const handleClick = useCallback((i) => {
    if (board[i] || gameOver) return;
    const nb = [...board];
    nb[i] = 'X';
    const w = checkWinner(nb);
    if (w) {
      setBoard(nb); setGameOver(true);
      if (w === 'X') { setStatus('🎉 You win!'); onGameEnd(50, true); }
      else            { setStatus("It's a draw!"); onGameEnd(10, false); }
      return;
    }
    // AI move
    const ai = bestMove(nb);
    if (ai !== -1) {
      nb[ai] = 'O';
      const w2 = checkWinner(nb);
      if (w2) {
        setBoard(nb); setGameOver(true);
        if (w2 === 'O') { setStatus('AI wins! Better luck next time.'); onGameEnd(0, false); }
        else             { setStatus("It's a draw!"); onGameEnd(10, false); }
        return;
      }
    }
    setBoard(nb);
    setStatus('Your turn — you are X');
  }, [board, gameOver, onGameEnd]);

  const reset = () => { setBoard(Array(9).fill(null)); setGameOver(false); setStatus('Your turn — you are X'); };

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="font-display text-xl font-bold text-white">Tic Tac Toe</h2>
      <p className="text-sm text-gray-400">{status}</p>
      <div className="grid grid-cols-3 gap-2 w-fit">
        {board.map((cell, i) => (
          <button key={i} onClick={() => handleClick(i)}
            className={`w-20 h-20 rounded-xl border-2 text-3xl font-bold transition-all
              ${!cell && !gameOver ? 'border-dark-500 hover:border-purple-500 hover:bg-purple-500/10 cursor-pointer' : 'cursor-default border-dark-500'}
              ${cell === 'X' ? 'text-purple-400' : 'text-cyan-400'}`}
          >
            {cell}
          </button>
        ))}
      </div>
      {gameOver && (
        <button onClick={reset} className="btn-primary px-8 py-2">Play Again</button>
      )}
      <p className="text-xs text-gray-600">Win = 50 pts · Draw = 10 pts · Loss = 0 pts</p>
    </div>
  );
}
