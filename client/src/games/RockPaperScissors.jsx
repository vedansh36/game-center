import { useState } from 'react';

const CHOICES = ['🪨','📄','✂️'];
const NAMES   = ['Rock','Paper','Scissors'];
function beats(a, b) { return (a===0&&b===2)||(a===1&&b===0)||(a===2&&b===1); }

export default function RockPaperScissors({ onGameEnd }) {
  const [scores, setScores] = useState({ player:0, ai:0 });
  const [round,  setRound]  = useState(1);
  const [result, setResult] = useState(null);
  const [done,   setDone]   = useState(false);
  const MAX = 5;

  const pick = (choice) => {
    if (done) return;
    const ai  = Math.floor(Math.random()*3);
    let outcome;
    if (choice === ai)          outcome = 'draw';
    else if (beats(choice, ai)) outcome = 'win';
    else                        outcome = 'lose';

    const ns = { ...scores };
    if (outcome === 'win')  ns.player++;
    if (outcome === 'lose') ns.ai++;
    setScores(ns);
    setResult({ player: choice, ai, outcome });
    const nr = round + 1;
    setRound(nr);

    if (nr > MAX) {
      setDone(true);
      const pts = ns.player * 15;
      onGameEnd(pts, ns.player > ns.ai);
    }
  };

  const reset = () => { setScores({player:0,ai:0}); setRound(1); setResult(null); setDone(false); };

  return (
    <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
      <h2 className="font-display text-xl font-bold text-white">Rock Paper Scissors</h2>
      <p className="text-sm text-gray-400">Best of {MAX} · Round {Math.min(round, MAX)} of {MAX}</p>

      {/* Score */}
      <div className="flex gap-10 text-center">
        {[['You', scores.player, 'text-purple-400'], ['AI', scores.ai, 'text-cyan-400']].map(([l,v,c]) => (
          <div key={l}>
            <div className={`font-display text-3xl font-bold ${c}`}>{v}</div>
            <div className="text-xs text-gray-500 mt-1">{l}</div>
          </div>
        ))}
      </div>

      {/* Last result */}
      {result && (
        <div className={`w-full text-center py-3 rounded-xl text-sm font-semibold border
          ${result.outcome==='win'  ? 'bg-green-500/20 text-green-400 border-green-500/30' :
            result.outcome==='lose' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                      'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
          {CHOICES[result.player]} You vs AI {CHOICES[result.ai]} — {result.outcome === 'win' ? '✅ You win!' : result.outcome === 'lose' ? '❌ AI wins' : '🤝 Draw'}
        </div>
      )}

      {/* Choices */}
      {!done ? (
        <div className="flex gap-4">
          {CHOICES.map((c, i) => (
            <button key={i} onClick={() => pick(i)}
              className="w-20 h-20 rounded-2xl bg-dark-700 border-2 border-dark-500 text-3xl
                         hover:border-purple-500 hover:bg-purple-500/10 hover:scale-110 transition-all active:scale-95">
              {c}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className={`font-bold mb-3 ${scores.player>scores.ai?'text-green-400':'text-red-400'}`}>
            {scores.player > scores.ai ? '🏆 You won the match!' : scores.player === scores.ai ? "🤝 It's a tie!" : '💀 AI wins the match!'}
          </p>
          <p className="text-sm text-gray-400 mb-4">Points: {scores.player * 15}</p>
          <button onClick={reset} className="btn-primary px-8 py-2">Play Again</button>
        </div>
      )}
      <p className="text-xs text-gray-600">Win rounds = 15 pts each · Max 75 pts</p>
    </div>
  );
}
