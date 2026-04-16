import { useState, useCallback } from 'react';

export default function NumberGuessing({ onGameEnd }) {
  const [target,   setTarget]   = useState(() => Math.floor(Math.random()*100)+1);
  const [guess,    setGuess]    = useState('');
  const [history,  setHistory]  = useState([]);
  const [done,     setDone]     = useState(false);
  const [msg,      setMsg]      = useState('');
  const MAX = 10;

  const submit = useCallback(() => {
    const n = parseInt(guess, 10);
    if (isNaN(n) || n < 1 || n > 100) { setMsg('Enter a number between 1 and 100'); return; }
    const hint = n < target ? '⬆️ Higher' : n > target ? '⬇️ Lower' : '✅ Correct!';
    const entry = { guess: n, hint };
    const nh = [...history, entry];
    setHistory(nh);
    setGuess('');
    if (n === target) {
      const pts = Math.max(10, 100 - (nh.length - 1) * 10);
      setMsg(`🎉 Correct! You got it in ${nh.length} guess${nh.length>1?'es':''}!`);
      setDone(true);
      onGameEnd(pts, true);
    } else if (nh.length >= MAX) {
      setMsg(`💀 Out of guesses! The number was ${target}.`);
      setDone(true);
      onGameEnd(0, false);
    } else {
      setMsg(hint);
    }
  }, [guess, target, history, onGameEnd]);

  const reset = () => {
    setTarget(Math.floor(Math.random()*100)+1);
    setGuess(''); setHistory([]); setDone(false); setMsg('');
  };

  return (
    <div className="flex flex-col items-center gap-5 max-w-sm mx-auto">
      <h2 className="font-display text-xl font-bold text-white">Number Guessing</h2>
      <p className="text-gray-400 text-sm text-center">I'm thinking of a number between 1 and 100. You have {MAX - history.length} guesses left.</p>

      {msg && (
        <div className={`w-full text-center py-3 px-4 rounded-xl text-sm font-semibold
          ${done && history[history.length-1]?.hint?.includes('Correct')
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : done
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
          {msg}
        </div>
      )}

      {!done && (
        <div className="flex gap-2 w-full">
          <input
            type="number" min="1" max="100" placeholder="1–100"
            className="input-field flex-1 text-center text-lg"
            value={guess} onChange={e => setGuess(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
          />
          <button onClick={submit} className="btn-primary px-5">Guess</button>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="w-full space-y-1 max-h-40 overflow-y-auto">
          {[...history].reverse().map((h, i) => (
            <div key={i} className="flex justify-between text-sm bg-dark-700 rounded-lg px-3 py-2">
              <span className="text-gray-300">Guess: <strong className="text-white">{h.guess}</strong></span>
              <span>{h.hint}</span>
            </div>
          ))}
        </div>
      )}

      {done && <button onClick={reset} className="btn-primary px-8 py-2">Play Again</button>}
      <p className="text-xs text-gray-600">Fewer guesses = more points (max 100)</p>
    </div>
  );
}
