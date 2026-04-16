import { useState, useEffect, useCallback, useRef } from 'react';

const COLORS = [
  { id:0, name:'Red',    on:'bg-red-500    shadow-red-500/60',    off:'bg-red-900/40    border-red-800' },
  { id:1, name:'Green',  on:'bg-green-500  shadow-green-500/60',  off:'bg-green-900/40  border-green-800' },
  { id:2, name:'Blue',   on:'bg-blue-500   shadow-blue-500/60',   off:'bg-blue-900/40   border-blue-800' },
  { id:3, name:'Yellow', on:'bg-yellow-400 shadow-yellow-400/60', off:'bg-yellow-900/40 border-yellow-800' },
];

export default function SimonSays({ onGameEnd }) {
  const [sequence,  setSequence]  = useState([]);
  const [input,     setInput]     = useState([]);
  const [lit,       setLit]       = useState(null);
  const [phase,     setPhase]     = useState('idle'); // idle|showing|player|gameover|won
  const [round,     setRound]     = useState(0);
  const [lives,     setLives]     = useState(3);
  const playingRef  = useRef(false);

  const showSequence = useCallback(async (seq) => {
    setPhase('showing');
    await new Promise(r => setTimeout(r, 600));
    for (const id of seq) {
      setLit(id);
      await new Promise(r => setTimeout(r, 550));
      setLit(null);
      await new Promise(r => setTimeout(r, 250));
    }
    setPhase('player');
    setInput([]);
  }, []);

  const startRound = useCallback((seq) => {
    const ns = [...seq, Math.floor(Math.random()*4)];
    setSequence(ns);
    setRound(ns.length);
    showSequence(ns);
  }, [showSequence]);

  const start = () => {
    if (playingRef.current) return;
    playingRef.current = true;
    setLives(3); setRound(0); setSequence([]); setInput([]);
    startRound([]);
  };

  const handleClick = useCallback((id) => {
    if (phase !== 'player') return;
    const ni = [...input, id];
    setInput(ni);

    const pos = ni.length - 1;
    if (ni[pos] !== sequence[pos]) {
      // Wrong
      const nl = lives - 1;
      setLives(nl);
      if (nl <= 0) {
        setPhase('gameover');
        onGameEnd((round-1) * 15, false);
        playingRef.current = false;
      } else {
        setTimeout(() => showSequence(sequence), 800);
      }
      setInput([]);
      return;
    }

    if (ni.length === sequence.length) {
      // Completed round
      if (round >= 10) {
        setPhase('won');
        onGameEnd(round * 15, true);
        playingRef.current = false;
      } else {
        setTimeout(() => startRound(sequence), 600);
      }
    }
  }, [phase, input, sequence, round, lives, showSequence, startRound, onGameEnd]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-6">
        <h2 className="font-display text-xl font-bold text-white">Simon Says</h2>
        {round>0 && <span className="text-sm text-gray-400">Round <span className="text-cyan-400 font-bold">{round}</span></span>}
        {round>0 && <span className="text-sm">{Array.from({length:3}).map((_,i) => i<lives?'❤️':'🖤').join('')}</span>}
      </div>

      <p className="text-sm text-gray-400 h-5">
        {phase==='idle'   && 'Press start and watch the pattern!'}
        {phase==='showing'&& '👀 Watch carefully…'}
        {phase==='player' && '🖱️ Repeat the sequence!'}
        {phase==='gameover'&&'💀 Game Over!'}
        {phase==='won'     &&'🏆 You beat all 10 rounds!'}
      </p>

      <div className="grid grid-cols-2 gap-4">
        {COLORS.map(c => (
          <button key={c.id}
            onClick={() => handleClick(c.id)}
            disabled={phase!=='player'}
            className={`w-28 h-28 rounded-2xl border-2 shadow-lg transition-all duration-100
              ${lit===c.id ? `${c.on} shadow-xl scale-105` : `${c.off}`}
              ${phase==='player' ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'}`}
          />
        ))}
      </div>

      {(phase==='idle'||phase==='gameover'||phase==='won') && (
        <button onClick={start} className="btn-primary px-8 py-2.5">
          {phase==='idle' ? '▶ Start' : 'Play Again'}
        </button>
      )}
      {(phase==='gameover'||phase==='won') && (
        <p className="text-gray-400 text-sm">Score: <span className="text-yellow-400 font-bold">{Math.max(0,round-1)*15} pts</span></p>
      )}
      <p className="text-xs text-gray-600">Watch the flash pattern and repeat · 15 pts/round</p>
    </div>
  );
}
