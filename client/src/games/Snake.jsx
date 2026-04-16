import { useEffect, useRef, useState, useCallback } from 'react';

const W = 400, H = 400, CELL = 20, COLS = W/CELL, ROWS = H/CELL;

function randFood(snake) {
  let pos;
  do { pos = { x: Math.floor(Math.random()*COLS), y: Math.floor(Math.random()*ROWS) }; }
  while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

export default function SnakeGame({ onGameEnd }) {
  const canvasRef  = useRef(null);
  const stateRef   = useRef(null);
  const timerRef   = useRef(null);
  const [score,    setScore]    = useState(0);
  const [running,  setRunning]  = useState(false);
  const [over,     setOver]     = useState(false);

  const initState = () => ({
    snake: [{ x: 10, y: 10 }],
    dir:   { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food:  randFood([{ x:10, y:10 }]),
    score: 0,
  });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s   = stateRef.current;
    if (!s) return;

    ctx.fillStyle = '#05050d';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(168,85,247,0.04)';
    ctx.lineWidth = 0.5;
    for (let i=0; i<=COLS; i++) { ctx.beginPath(); ctx.moveTo(i*CELL,0); ctx.lineTo(i*CELL,H); ctx.stroke(); }
    for (let i=0; i<=ROWS; i++) { ctx.beginPath(); ctx.moveTo(0,i*CELL); ctx.lineTo(W,i*CELL); ctx.stroke(); }

    // Food
    ctx.fillStyle = '#f97316';
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur  = 12;
    ctx.beginPath();
    ctx.arc(s.food.x*CELL+CELL/2, s.food.y*CELL+CELL/2, CELL/2-2, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    s.snake.forEach((seg, idx) => {
      const t = idx / s.snake.length;
      ctx.fillStyle = idx === 0 ? '#a855f7' : `hsl(${270-t*80},70%,${60-t*20}%)`;
      ctx.shadowColor = idx === 0 ? '#a855f7' : 'transparent';
      ctx.shadowBlur  = idx === 0 ? 10 : 0;
      ctx.beginPath();
      ctx.roundRect(seg.x*CELL+1, seg.y*CELL+1, CELL-2, CELL-2, 4);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    s.dir = s.nextDir;
    const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

    // Wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      clearInterval(timerRef.current);
      setOver(true); setRunning(false);
      onGameEnd(s.score, false);
      return;
    }
    // Self collision
    if (s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      clearInterval(timerRef.current);
      setOver(true); setRunning(false);
      onGameEnd(s.score, false);
      return;
    }

    const ate = head.x === s.food.x && head.y === s.food.y;
    s.snake = [head, ...s.snake];
    if (!ate) s.snake.pop();
    else {
      s.score += 10;
      s.food   = randFood(s.snake);
      setScore(s.score);
    }
    draw();
  }, [draw, onGameEnd]);

  const start = useCallback(() => {
    stateRef.current = initState();
    setScore(0); setOver(false); setRunning(true);
    draw();
    timerRef.current = setInterval(tick, 140);
  }, [draw, tick]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!stateRef.current) return;
      const d = stateRef.current.dir;
      const map = {
        ArrowUp:    { x:0,  y:-1 },
        ArrowDown:  { x:0,  y:1  },
        ArrowLeft:  { x:-1, y:0  },
        ArrowRight: { x:1,  y:0  },
      };
      const nd = map[e.key];
      if (!nd) return;
      // Prevent reversing
      if (nd.x === -d.x && nd.y === -d.y) return;
      stateRef.current.nextDir = nd;
      e.preventDefault();
    };
    window.addEventListener('keydown', handleKey);
    return () => { window.removeEventListener('keydown', handleKey); clearInterval(timerRef.current); };
  }, []);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6">
        <h2 className="font-display text-xl font-bold text-white">Snake</h2>
        <span className="font-display text-lg text-orange-400 font-bold">{score} pts</span>
      </div>
      <canvas ref={canvasRef} width={W} height={H}
        className="rounded-xl border border-dark-500 block" style={{maxWidth:'100%'}} />
      {!running && !over && (
        <button onClick={start} className="btn-primary px-8 py-2.5">▶ Start</button>
      )}
      {over && (
        <div className="text-center">
          <p className="text-gray-400 mb-3">Game Over! Score: <span className="text-orange-400 font-bold">{score}</span></p>
          <button onClick={start} className="btn-primary px-8 py-2">Play Again</button>
        </div>
      )}
      <p className="text-xs text-gray-600">Arrow keys to move · Each food = 10 pts</p>
    </div>
  );
}
