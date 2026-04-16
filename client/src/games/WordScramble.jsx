import { useState, useCallback } from 'react';

const WORDS = ['PYTHON','REACT','DRAGON','PLANET','FOREST','CASTLE','BRIDGE','SILVER','GOLDEN','WINTER',
               'SUMMER','GARDEN','ROCKET','BUTTON','CAMERA','PUZZLE','SPIDER','JUNGLE','CANDLE','MIRROR'];

function scramble(w) {
  const a = w.split('');
  for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  const r = a.join('');
  return r === w ? scramble(w) : r;
}

function pickWords() {
  const pool = [...WORDS].sort(() => Math.random()-0.5).slice(0,5);
  return pool.map(w => ({ word:w, scrambled:scramble(w) }));
}

export default function WordScramble({ onGameEnd }) {
  const [words,   setWords]   = useState(() => pickWords());
  const [index,   setIndex]   = useState(0);
  const [input,   setInput]   = useState('');
  const [score,   setScore]   = useState(0);
  const [msg,     setMsg]     = useState('');
  const [done,    setDone]    = useState(false);

  const submit = useCallback(() => {
    if (!input.trim()) return;
    const correct = input.trim().toUpperCase() === words[index].word;
    let pts = score;
    if (correct) { pts += 20; setScore(pts); setMsg('✅ Correct!'); }
    else          { setMsg(`❌ The word was: ${words[index].word}`); }
    setTimeout(() => {
      const ni = index + 1;
      if (ni >= words.length) {
        setDone(true);
        onGameEnd(pts, pts === 100);
      } else {
        setIndex(ni); setInput(''); setMsg('');
      }
    }, 1200);
  }, [input, words, index, score, onGameEnd]);

  const reset = () => { setWords(pickWords()); setIndex(0); setInput(''); setScore(0); setMsg(''); setDone(false); };

  return (
    <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
      <div className="flex items-center gap-6">
        <h2 className="font-display text-xl font-bold text-white">Word Scramble</h2>
        <span className="text-sm text-gray-400">{score}/100 pts</span>
        <span className="text-sm text-gray-400">{Math.min(index+1,5)}/5</span>
      </div>

      {!done ? (
        <>
          <div className="bg-dark-700 border border-dark-500 rounded-2xl p-8 w-full text-center">
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-widest">Unscramble this word</p>
            <p className="font-display text-4xl font-bold text-purple-400 tracking-[0.3em]">
              {words[index].scrambled}
            </p>
          </div>

          {msg && (
            <div className={`w-full text-center py-2 rounded-xl text-sm font-semibold
              ${msg.startsWith('✅') ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
              {msg}
            </div>
          )}

          <div className="flex gap-2 w-full">
            <input
              type="text" placeholder="Type the word…" className="input-field flex-1"
              value={input} onChange={e => setInput(e.target.value.toUpperCase())}
              onKeyDown={e => e.key==='Enter' && submit()} autoFocus
            />
            <button onClick={submit} className="btn-primary px-5">→</button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="font-display text-4xl font-bold text-yellow-400 mb-2">{score} pts</p>
          <p className="text-gray-400 mb-4">{score===100 ? 'Perfect score! 🎉' : 'Nice effort!'}</p>
          <button onClick={reset} className="btn-primary px-8 py-2">Play Again</button>
        </div>
      )}
      <p className="text-xs text-gray-600">5 words · Each correct = 20 pts</p>
    </div>
  );
}
