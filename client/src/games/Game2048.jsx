import { useState, useEffect, useCallback } from 'react';

function empty() { return Array.from({length:4}, ()=>Array(4).fill(0)); }

function addTile(g) {
  const empty = [];
  for(let r=0;r<4;r++) for(let c=0;c<4;c++) if(!g[r][c]) empty.push([r,c]);
  if(!empty.length) return;
  const [r,c] = empty[Math.floor(Math.random()*empty.length)];
  g[r][c] = Math.random()<0.9 ? 2 : 4;
}

function slideRow(row) {
  let arr = row.filter(x=>x);
  let pts = 0;
  for(let i=0;i<arr.length-1;i++) {
    if(arr[i]===arr[i+1]){ arr[i]*=2; pts+=arr[i]; arr.splice(i+1,1); }
  }
  while(arr.length<4) arr.push(0);
  return { row:arr, pts };
}

function move(grid, dir) {
  let g = grid.map(r=>[...r]);
  let totalPts = 0;
  let moved = false;

  if(dir==='left'||dir==='right') {
    for(let r=0;r<4;r++) {
      const row = dir==='right' ? [...g[r]].reverse() : [...g[r]];
      const {row:nr,pts} = slideRow(row);
      const final = dir==='right' ? nr.reverse() : nr;
      if(final.join()!==g[r].join()) moved=true;
      g[r]=final; totalPts+=pts;
    }
  } else {
    for(let c=0;c<4;c++) {
      const col = g.map(r=>r[c]);
      const toSlide = dir==='down' ? [...col].reverse() : [...col];
      const {row:nr,pts} = slideRow(toSlide);
      const final = dir==='down' ? nr.reverse() : nr;
      for(let r=0;r<4;r++) { if(final[r]!==g[r][c]) moved=true; g[r][c]=final[r]; }
      totalPts+=pts;
    }
  }
  if(moved) addTile(g);
  return { grid:g, pts:totalPts, moved };
}

function maxTile(g) { return Math.max(...g.flat()); }

function hasMove(g) {
  for(let r=0;r<4;r++) for(let c=0;c<4;c++) {
    if(!g[r][c]) return true;
    if(r<3&&g[r][c]===g[r+1][c]) return true;
    if(c<3&&g[r][c]===g[r][c+1]) return true;
  }
  return false;
}

const TILE_COLORS = {
  0:'bg-dark-600 text-transparent',
  2:'bg-amber-100 text-gray-800',4:'bg-amber-200 text-gray-800',
  8:'bg-orange-300 text-white', 16:'bg-orange-400 text-white',
  32:'bg-orange-500 text-white', 64:'bg-red-500 text-white',
  128:'bg-yellow-400 text-white', 256:'bg-yellow-500 text-white',
  512:'bg-purple-500 text-white', 1024:'bg-blue-500 text-white',
  2048:'bg-gradient-to-br from-yellow-300 to-orange-500 text-white',
};

export default function Game2048({ onGameEnd }) {
  const [grid,  setGrid]  = useState(null);
  const [score, setScore] = useState(0);
  const [done,  setDone]  = useState(false);
  const [won,   setWon]   = useState(false);
  const doneRef = { current: done };

  const init = () => {
    const g = empty();
    addTile(g); addTile(g);
    setGrid(g); setScore(0); setDone(false); setWon(false);
  };

  const handleMove = useCallback((dir) => {
    if (doneRef.current) return;
    setGrid(prev => {
      if (!prev) return prev;
      const { grid:ng, pts, moved } = move(prev, dir);
      if (!moved) return prev;
      setScore(s => {
        const ns = s + pts;
        return ns;
      });
      const mx = maxTile(ng);
      if (mx >= 2048 && !won) {
        setWon(true); setDone(true);
        const award = mx >= 2048 ? 200 : mx >= 1024 ? 100 : 50;
        onGameEnd(award, true);
      } else if (!hasMove(ng)) {
        setDone(true);
        const award = mx >= 512 ? 50 : 20;
        onGameEnd(award, false);
      }
      return ng;
    });
  }, [won, onGameEnd]); // eslint-disable-line

  useEffect(() => { init(); }, []); // eslint-disable-line

  useEffect(() => {
    const onKey = (e) => {
      const map = { ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down' };
      if (map[e.key]) { e.preventDefault(); handleMove(map[e.key]); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleMove]);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-6">
        <h2 className="font-display text-xl font-bold text-white">2048</h2>
        <span className="text-sm text-gray-400">Score: <span className="text-yellow-400 font-bold">{score}</span></span>
        {grid && <span className="text-sm text-gray-400">Best: <span className="text-purple-400 font-bold">{maxTile(grid)}</span></span>}
      </div>

      {grid && (
        <div className="bg-dark-600 p-3 rounded-2xl grid grid-cols-4 gap-2">
          {grid.flat().map((v,i) => (
            <div key={i}
              className={`w-16 h-16 rounded-xl flex items-center justify-center font-display font-black text-lg
                          transition-all duration-100 ${TILE_COLORS[v] || 'bg-purple-500 text-white'}`}>
              {v || ''}
            </div>
          ))}
        </div>
      )}

      {/* Mobile arrows */}
      <div className="flex flex-col items-center gap-1 mt-2">
        <button onClick={() => handleMove('up')}    className="w-10 h-10 bg-dark-700 rounded-lg text-gray-300 hover:bg-dark-600 font-bold">▲</button>
        <div className="flex gap-1">
          <button onClick={() => handleMove('left')} className="w-10 h-10 bg-dark-700 rounded-lg text-gray-300 hover:bg-dark-600 font-bold">◀</button>
          <button onClick={() => handleMove('down')} className="w-10 h-10 bg-dark-700 rounded-lg text-gray-300 hover:bg-dark-600 font-bold">▼</button>
          <button onClick={() => handleMove('right')}className="w-10 h-10 bg-dark-700 rounded-lg text-gray-300 hover:bg-dark-600 font-bold">▶</button>
        </div>
      </div>

      {done && (
        <div className="text-center">
          <p className={`font-bold mb-2 ${won?'text-yellow-400':'text-gray-300'}`}>
            {won ? '🏆 You reached 2048!' : `Game Over! Best tile: ${grid ? maxTile(grid) : 0}`}
          </p>
          <button onClick={init} className="btn-primary px-8 py-2">New Game</button>
        </div>
      )}
      <p className="text-xs text-gray-600">Arrow keys or buttons · Reach 2048 for 200 pts</p>
    </div>
  );
}
