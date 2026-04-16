import { useState, useEffect, useCallback } from 'react';

function makeQuestion() {
  const ops = ['+','-','*'];
  const op = ops[Math.floor(Math.random()*ops.length)];
  let a, b, ans;
  if (op==='+') { a=Math.floor(Math.random()*50)+1; b=Math.floor(Math.random()*50)+1; ans=a+b; }
  else if (op==='-') { a=Math.floor(Math.random()*50)+10; b=Math.floor(Math.random()*a)+1; ans=a-b; }
  else { a=Math.floor(Math.random()*12)+1; b=Math.floor(Math.random()*12)+1; ans=a*b; }
  // Generate 3 wrong answers
  const wrongs = new Set();
  while (wrongs.size < 3) {
    const w = ans + (Math.floor(Math.random()*11)-5);
    if (w !== ans && w >= 0) wrongs.add(w);
  }
  const opts = [...wrongs, ans].sort(() => Math.random()-0.5);
  return { q:`${a} ${op} ${b}`, answer:ans, options:opts };
}

const TOTAL = 10, TIME_PER_Q = 15;

export default function MathQuiz({ onGameEnd }) {
  const [questions, ] = useState(() => Array.from({length:TOTAL}, makeQuestion));
  const [index,    setIndex]   = useState(0);
  const [score,    setScore]   = useState(0);
  const [timeLeft, setTimeLeft]= useState(TIME_PER_Q);
  const [selected, setSelected]= useState(null);
  const [done,     setDone]    = useState(false);
  const [started,  setStarted] = useState(false);

  const advance = useCallback((pts) => {
    const ni = index + 1;
    if (ni >= TOTAL) {
      setDone(true);
      onGameEnd(pts, pts === 100);
    } else {
      setIndex(ni); setSelected(null); setTimeLeft(TIME_PER_Q);
    }
  }, [index, onGameEnd]);

  useEffect(() => {
    if (!started || done || selected !== null) return;
    if (timeLeft <= 0) { advance(score); return; }
    const t = setTimeout(() => setTimeLeft(p => p-1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, started, done, selected, advance, score]);

  const pick = (opt) => {
    if (selected !== null || done) return;
    setSelected(opt);
    const correct = opt === questions[index].answer;
    const pts = correct ? score + 10 : score;
    if (correct) setScore(pts);
    setTimeout(() => advance(pts), 900);
  };

  const q = questions[index];

  return (
    <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
      <div className="flex items-center gap-6">
        <h2 className="font-display text-xl font-bold text-white">Math Quiz</h2>
        <span className="text-sm text-gray-400">{score} pts</span>
        <span className="text-sm text-gray-400">{Math.min(index+1,TOTAL)}/{TOTAL}</span>
      </div>

      {!started ? (
        <button onClick={() => setStarted(true)} className="btn-primary px-8 py-2.5">▶ Start Quiz</button>
      ) : !done ? (
        <>
          <div className="w-full flex justify-between text-sm text-gray-400 px-1">
            <span>Question {index+1} of {TOTAL}</span>
            <span className={`font-bold ${timeLeft<=5?'text-red-400':'text-cyan-400'}`}>{timeLeft}s</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-dark-600 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 transition-all" style={{width:`${(timeLeft/TIME_PER_Q)*100}%`}} />
          </div>

          <div className="bg-dark-700 border border-dark-500 rounded-2xl p-8 w-full text-center">
            <p className="font-display text-4xl font-bold text-white">{q.q} = ?</p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            {q.options.map(opt => (
              <button key={opt} onClick={() => pick(opt)}
                className={`py-4 rounded-xl font-display font-bold text-xl border-2 transition-all
                  ${selected === null ? 'border-dark-500 bg-dark-700 hover:border-purple-500 hover:bg-purple-500/10' :
                    opt === q.answer  ? 'border-green-500 bg-green-500/20 text-green-400' :
                    opt === selected  ? 'border-red-500   bg-red-500/20   text-red-400'   :
                                        'border-dark-500  bg-dark-800     text-gray-600'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="font-display text-5xl font-bold text-yellow-400 mb-2">{score} pts</p>
          <p className="text-gray-400 mb-4">{score===100?'🎉 Perfect score!':'Keep practicing!'}</p>
          <button onClick={() => window.location.reload()} className="btn-primary px-8 py-2">Play Again</button>
        </div>
      )}
      <p className="text-xs text-gray-600">10 questions · 15s each · 10 pts per correct</p>
    </div>
  );
}
