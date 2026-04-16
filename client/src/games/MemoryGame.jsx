import { useState, useEffect, useCallback } from 'react';

const EMOJIS = ['🎮','🏆','⭐','🎯','🎲','🎪','🃏','🎸'];

function shuffle(arr) {
  const a = [...arr]; for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a;
}

export default function MemoryGame({ onGameEnd }) {
  const [cards,    setCards]    = useState([]);
  const [flipped,  setFlipped]  = useState([]);
  const [matched,  setMatched]  = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [won,      setWon]      = useState(false);
  const [lock,     setLock]     = useState(false);

  const init = useCallback(() => {
    const deck = shuffle([...EMOJIS, ...EMOJIS].map((e,i) => ({ id:i, emoji:e, flipped:false })));
    setCards(deck); setFlipped([]); setMatched([]); setAttempts(0); setWon(false); setLock(false);
  }, []);

  useEffect(() => { init(); }, [init]);

  const handleFlip = (card) => {
    if (lock || matched.includes(card.id) || flipped.find(c => c.id === card.id)) return;
    const nf = [...flipped, card];
    setFlipped(nf);
    if (nf.length === 2) {
      setAttempts(a => a + 1);
      setLock(true);
      setTimeout(() => {
        if (nf[0].emoji === nf[1].emoji) {
          const nm = [...matched, nf[0].id, nf[1].id];
          setMatched(nm);
          if (nm.length === cards.length) {
            const pts = Math.max(20, 100 - (attempts) * 5);
            setWon(true);
            onGameEnd(pts, true);
          }
        }
        setFlipped([]); setLock(false);
      }, 800);
    }
  };

  const isFlipped = (card) => flipped.find(c => c.id === card.id) || matched.includes(card.id);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-6">
        <h2 className="font-display text-xl font-bold text-white">Memory Game</h2>
        <span className="text-sm text-gray-400">Attempts: <span className="text-cyan-400 font-bold">{attempts}</span></span>
        <span className="text-sm text-gray-400">Matched: <span className="text-green-400 font-bold">{matched.length/2}/{EMOJIS.length}</span></span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {cards.map(card => (
          <button key={card.id} onClick={() => handleFlip(card)}
            className={`w-16 h-16 rounded-xl border-2 text-2xl flex items-center justify-center transition-all duration-300
              ${isFlipped(card)
                ? matched.includes(card.id)
                  ? 'border-green-500 bg-green-500/20 scale-95'
                  : 'border-purple-500 bg-purple-500/20'
                : 'border-dark-500 bg-dark-700 hover:border-purple-500 cursor-pointer'
              }`}
          >
            {isFlipped(card) ? card.emoji : '❓'}
          </button>
        ))}
      </div>
      {won && (
        <div className="text-center">
          <p className="text-green-400 font-bold mb-3">🎉 All matched in {attempts} attempts!</p>
          <button onClick={init} className="btn-primary px-8 py-2">Play Again</button>
        </div>
      )}
      <p className="text-xs text-gray-600">Match all 8 pairs · Fewer attempts = more points</p>
    </div>
  );
}
