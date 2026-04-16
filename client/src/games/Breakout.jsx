import { useEffect, useRef, useState, useCallback } from 'react';

const W=480, H=360, COLS=9, ROWS=5, BW=46, BH=18, BPAD=4;

export default function Breakout({ onGameEnd }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef(null);
  const rafRef    = useRef(null);
  const [score,    setScore]  = useState(0);
  const [lives,    setLives]  = useState(3);
  const [running,  setRunning]= useState(false);
  const [msg,      setMsg]    = useState('');

  const initState = () => {
    const bricks = [];
    for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) {
      bricks.push({ x: c*(BW+BPAD)+28, y: r*(BH+BPAD)+30, active:true });
    }
    return {
      ball:   { x:W/2, y:H-60, vx:3, vy:-3, r:8 },
      paddle: { x:W/2-40, y:H-20, w:80, h:12 },
      bricks, score:0, lives:3, running:true, over:false, won:false
    };
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s   = stateRef.current;
    if (!s) return;

    ctx.fillStyle = '#05050d';
    ctx.fillRect(0,0,W,H);

    // Bricks
    const hues = [0,20,40,60,280];
    s.bricks.forEach((b, i) => {
      if (!b.active) return;
      const row = Math.floor(i / COLS);
      ctx.fillStyle = `hsl(${hues[row]},80%,55%)`;
      ctx.shadowColor = `hsl(${hues[row]},80%,55%)`;
      ctx.shadowBlur  = 6;
      ctx.beginPath();
      ctx.roundRect(b.x,b.y,BW,BH,4);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // Paddle
    ctx.fillStyle = '#a855f7';
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur  = 12;
    ctx.beginPath();
    ctx.roundRect(s.paddle.x, s.paddle.y, s.paddle.w, s.paddle.h, 6);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Ball
    ctx.fillStyle = '#06b6d4';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur  = 15;
    ctx.beginPath();
    ctx.arc(s.ball.x, s.ball.y, s.ball.r, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }, []);

  const loop = useCallback(() => {
    const s = stateRef.current;
    if (!s || !s.running) return;

    const b = s.ball;

    // Move
    b.x += b.vx; b.y += b.vy;

    // Walls
    if (b.x-b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx); }
    if (b.x+b.r > W)  { b.x = W-b.r; b.vx = -Math.abs(b.vx); }
    if (b.y-b.r < 0)  { b.y = b.r; b.vy = Math.abs(b.vy); }

    // Paddle
    const p = s.paddle;
    if (b.y+b.r > p.y && b.y+b.r < p.y+p.h && b.x > p.x && b.x < p.x+p.w) {
      b.vy = -Math.abs(b.vy);
      const rel = (b.x - (p.x+p.w/2)) / (p.w/2);
      b.vx = rel * 4.5;
    }

    // Fell out
    if (b.y > H+20) {
      s.lives--;
      setLives(s.lives);
      if (s.lives <= 0) {
        s.running = false; s.over = true;
        setRunning(false); setMsg('💀 Game Over!');
        onGameEnd(s.score, false);
        return;
      }
      b.x=W/2; b.y=H-80; b.vx=3; b.vy=-3;
    }

    // Bricks
    for (const brick of s.bricks) {
      if (!brick.active) continue;
      if (b.x+b.r > brick.x && b.x-b.r < brick.x+BW && b.y+b.r > brick.y && b.y-b.r < brick.y+BH) {
        brick.active = false;
        b.vy *= -1;
        s.score += 5;
        setScore(s.score);
      }
    }

    // Win
    if (s.bricks.every(b => !b.active)) {
      s.running = false; s.won = true;
      setRunning(false); setMsg('🏆 You cleared all bricks!');
      onGameEnd(s.score, true);
      return;
    }

    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw, onGameEnd]);

  const start = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const s = initState();
    stateRef.current = s;
    setScore(0); setLives(3); setRunning(true); setMsg('');
    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw, loop]);

  useEffect(() => {
    let mouseX = null;
    const onMouse = (e) => {
      const canvas = canvasRef.current;
      if (!canvas || !stateRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      mouseX = (e.clientX - rect.left) * scaleX;
      const p = stateRef.current.paddle;
      p.x = Math.max(0, Math.min(W - p.w, mouseX - p.w/2));
    };
    const onKey = (e) => {
      const s = stateRef.current;
      if (!s) return;
      if (e.key==='ArrowLeft')  s.paddle.x = Math.max(0, s.paddle.x - 20);
      if (e.key==='ArrowRight') s.paddle.x = Math.min(W - s.paddle.w, s.paddle.x + 20);
    };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('keydown', onKey);
    draw();
    return () => {
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('keydown', onKey);
      cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6">
        <h2 className="font-display text-xl font-bold text-white">Breakout</h2>
        <span className="text-orange-400 font-bold">{score} pts</span>
        <span className="text-sm">{Array.from({length:3}).map((_,i)=>i<lives?'❤️':'🖤').join('')}</span>
      </div>
      <canvas ref={canvasRef} width={W} height={H}
        className="rounded-xl border border-dark-500 block cursor-none" style={{maxWidth:'100%'}} />
      {msg && <p className="text-gray-300 font-semibold">{msg}</p>}
      {!running && (
        <button onClick={start} className="btn-primary px-8 py-2.5">
          {msg ? 'Play Again' : '▶ Start'}
        </button>
      )}
      <p className="text-xs text-gray-600">Move mouse or use ← → keys · Each brick = 5 pts</p>
    </div>
  );
}
