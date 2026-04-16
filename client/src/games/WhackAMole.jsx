import { useState, useEffect, useRef, useCallback } from 'react';

const HOLES = 9;
const DURATION = 30;

export default function WhackAMole({ onGameEnd }) {
  const [moles,   setMoles]   = useState(Array(HOLES).fill(false));
  const [score,   setScore]   = useState(0);
  const [timeLeft,setTimeLeft]= useState(DURATION);
  const [running, setRunning] = useState(false);
  const [done,    setDone]    = useState(false);
  const scoreRef  = useRef(0);
  const timersRef = useRef([]);

  const clearTimers = () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };

  const spawnMole = useCallback(() => {
    if (!running) return;
    const idx = Math.floor(Math.random() * HOLES);
    setMoles(m => { const n=[...m]; n[idx]=true; return n; });
    const hide = setTimeout(() => {
      setMoles(m => { const n=[...m]; n[idx]=false; return n; });
    }, 800);
    timersRef.current.push(hide);
    const next = setTimeout(spawnMole, 600 + Math.random()*400);
    timersRef.current.push(next);
  }, [running]);

  const start = () => {
    clearTimers();
    scoreRef.current = 0;
    setScore(0); setMoles(Array(HOLES).fill(false));
    setTimeLeft(DURATION); setDone(false); setRunning(true);
  };

  useEffect(() => {
    if (!running) return;
    spawnMole();
    const countdown = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(countdown);
          clearTimers();
          setRunning(false); setDone(true);
          onGameEnd(scoreRef.current, false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { clearInterval(countdown); clearTimers(); };
  }, [running]); // eslint-disable-line

  const whack = (i) => {
    if (!moles[i] || !running) return;
    setMoles(m => { const n=[...m]; n[i]=false; return n; });
    scoreRef.current += 10;
    setScore(scoreRef.current);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-6">
        <h2 className="font-display text-xl font-bold text-white">Whack-a-Mole</h2>
        <span className="text-orange-400 font-bold">{score} pts</span>
        <span className={`font-display font-bold ${timeLeft<=10?'text-red-400':'text-cyan-400'}`}>{timeLeft}s</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {moles.map((active, i) => (
          <button key={i} onClick={() => whack(i)}
            className={`w-24 h-24 rounded-full border-4 text-4xl transition-all duration-150 relative overflow-hidden
              ${active ? 'border-yellow-400 bg-yellow-400/20 scale-110 cursor-pointer' : 'border-dark-500 bg-dark-700 cursor-default'}`}
          >
            {active ? '🦔' : '⚫'}
          </button>
        ))}
      </div>

      {!running && !done && (
        <button onClick={start} className="btn-primary px-8 py-2.5">▶ Start</button>
      )}
      {done && (
        <div className="text-center">
          <p className="text-gray-300 mb-3">Time's up! Score: <span className="text-orange-400 font-bold">{score}</span></p>
          <button onClick={start} className="btn-primary px-8 py-2">Play Again</button>
        </div>
      )}
      <p className="text-xs text-gray-600">Click moles before they hide · 30 seconds</p>
    </div>
  );
}
