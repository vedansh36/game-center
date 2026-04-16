import { useState, useEffect, useCallback, useRef } from 'react';

const COLORS = [
  { name:'RED',    color:'#ef4444' },
  { name:'BLUE',   color:'#3b82f6' },
  { name:'GREEN',  color:'#22c55e' },
  { name:'YELLOW', color:'#eab308' },
  { name:'PURPLE', color:'#a855f7' },
  { name:'ORANGE', color:'#f97316' },
];

function makeRound() {
  const textColor  = COLORS[Math.floor(Math.random()*COLORS.length)];
  let   inkColor   = COLORS[Math.floor(Math.random()*COLORS.length)];
  // Ensure text != ink 70% of time for variety
  if (Math.random() < 0.4) inkColor = textColor;
  return { textColor, inkColor };
}

const DURATION = 30;

export default function ColorMatch({ onGameEnd }) {
  const [round,    setRound]    = useState(null);
  const [score,    setScore]    = useState(0);
  const [streak,   setStreak]   = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [running,  setRunning]  = useState(false);
  const [feedback, setFeedback] = useState(null);
  const scoreRef  = useRef(0);

  const next = useCallback(() => setRound(makeRound()), []);

  const start = () => {
    scoreRef.current = 0;
    setScore(0); setStreak(0); setTimeLeft(DURATION);
    setFeedback(null); setRunning(true);
    next();
  };

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) {
          clearInterval(t);
          setRunning(false);
          onGameEnd(scoreRef.current, false);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, onGameEnd]);

  const pick = useCallback((colorName) => {
    if (!running || !round) return;
    const correct = colorName === round.inkColor.name;
    let pts = scoreRef.current;
    if (correct) {
      pts += 15;
      scoreRef.current = pts;
      setScore(pts);
      setStreak(s => s+1);
      setFeedback('✅');
    } else {
      setStreak(0);
      setFeedback('❌');
    }
    setTimeout(() => { setFeedback(null); next(); }, 400);
  }, [running, round, next]);

  return (
    <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
      <div className="flex items-center gap-5">
        <h2 className="font-display text-xl font-bold text-white">Color Match</h2>
        <span className="text-yellow-400 font-bold">{score} pts</span>
        {streak>1 && <span className="text-orange-400 text-sm font-bold">🔥 ×{streak}</span>}
        <span className={`font-display font-bold ${timeLeft<=10?'text-red-400':'text-cyan-400'}`}>{timeLeft}s</span>
      </div>

      {!running ? (
        <div className="text-center space-y-4">
          <div className="bg-dark-700 border border-dark-500 rounded-2xl p-6">
            <p className="text-white mb-2 font-semibold">How to play:</p>
            <p className="text-gray-400 text-sm">The word <span style={{color:'#3b82f6',fontWeight:'bold'}}>RED</span> is shown — what colour is the <em>ink</em>?</p>
            <p className="text-sm text-gray-400 mt-2">Pick the <strong className="text-white">ink colour</strong>, NOT what the word says!</p>
          </div>
          <button onClick={start} className="btn-primary px-8 py-2.5">▶ Start</button>
        </div>
      ) : (
        <>
          <div className="bg-dark-700 border border-dark-500 rounded-2xl p-10 w-full text-center relative min-h-[120px] flex items-center justify-center">
            {feedback && (
              <div className="absolute inset-0 flex items-center justify-center text-5xl bg-dark-800/80 rounded-2xl">
                {feedback}
              </div>
            )}
            {round && (
              <span className="font-display font-black text-5xl" style={{ color: round.inkColor.color }}>
                {round.textColor.name}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-400">What colour is the <strong className="text-white">ink</strong>?</p>

          <div className="grid grid-cols-3 gap-2 w-full">
            {COLORS.map(c => (
              <button key={c.name} onClick={() => pick(c.name)}
                className="py-3 rounded-xl font-display font-bold text-sm border-2 border-transparent transition-all hover:scale-105 active:scale-95 text-white"
                style={{ backgroundColor: c.color }}>
                {c.name}
              </button>
            ))}
          </div>
        </>
      )}
      {!running && score > 0 && (
        <p className="text-gray-400 text-sm">Final: <span className="text-yellow-400 font-bold">{score} pts</span></p>
      )}
      <p className="text-xs text-gray-600">Match ink colour · 15 pts each · 30 seconds</p>
    </div>
  );
}
