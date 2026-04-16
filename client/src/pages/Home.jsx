import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FEATURED = [
  { icon:'❌', name:'Tic Tac Toe', pts:50,  slug:'tic-tac-toe'     },
  { icon:'🐍', name:'Snake',       pts:500, slug:'snake'           },
  { icon:'🃏', name:'Memory Game', pts:100, slug:'memory-game'     },
  { icon:'🎯', name:'2048',        pts:200, slug:'2048'            },
  { icon:'🧱', name:'Breakout',    pts:250, slug:'breakout'        },
  { icon:'🟢', name:'Simon Says',  pts:150, slug:'simon-says'      },
];

export default function Home() {
  const { user } = useAuth();
  return (
    <div>
      {/* ── Hero ─────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl animate-pulse-slow" style={{animationDelay:'1.5s'}} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-cyan-600/5 blur-3xl" />
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-5"
          style={{backgroundImage:'linear-gradient(#a855f7 1px,transparent 1px),linear-gradient(90deg,#a855f7 1px,transparent 1px)',backgroundSize:'80px 80px'}}
        />

        <div className="relative text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-xs text-purple-400 font-semibold tracking-widest mb-8 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
            Mutiple Games · Real-time Points · Global Leaderboard
          </div>

          <h1 className="font-display font-black text-5xl sm:text-7xl leading-none tracking-tighter mb-6">
            <span className="block text-white">PLAY.</span>
            <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-glow">
              COMPETE.
            </span>
            <span className="block text-white">WIN.</span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            A cutting-edge gaming hub with browser-based games.
            Earn points, climb the leaderboard, and become the champion.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            {user ? (
              <Link to="/games" className="btn-primary text-base px-8 py-3 rounded-xl">
                🎮 Enter Game Hall
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn-primary text-base px-8 py-3 rounded-xl">
                  🚀 Get Started Free
                </Link>
                <Link to="/login" className="btn-outline text-base px-8 py-3 rounded-xl">
                  Login
                </Link>
              </>
            )}
            <Link to="/leaderboard" className="btn-outline text-base px-8 py-3 rounded-xl">
              🏆 Leaderboard
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-sm mx-auto">
            {[['12', 'Games'], ['∞', 'Points'], ['🏆', 'Glory']].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="font-display text-2xl font-bold text-purple-400">{v}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Games ───────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Featured Games
          </h2>
          <p className="text-gray-500">Jump in and start earning points</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {FEATURED.map(g => (
            <Link
              key={g.slug}
              to={user ? `/games/${g.slug}` : '/signup'}
              className="bg-dark-700 border border-dark-500 rounded-2xl p-5 card-glow flex flex-col gap-3 group"
            >
              <div className="text-4xl">{g.icon}</div>
              <div>
                <h3 className="font-display text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                  {g.name}
                </h3>
                <p className="text-xs text-purple-400 mt-1">⭐ Up to {g.pts} pts</p>
              </div>
            </Link>
          ))}
        </div>

        {!user && (
          <div className="text-center mt-10">
            <Link to="/signup" className="btn-primary px-10 py-3 text-base rounded-xl">
              Create Free Account to Play All Games →
            </Link>
          </div>
        )}
      </section>

      {/* ── Features ─────────────────────────── */}
      <section className="border-t border-white/5 py-20 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            { icon:'🔐', t:'Secured Points',   d:'Fully-secured fair point system' },
            { icon:'🏆', t:'Live Leaderboard', d:'Real-time global rankings updated after every game' },
            { icon:'📱', t:'Fully Compatible', d:'Play on any device — phone, tablet, or desktop' },
          ].map(f => (
            <div key={f.t} className="bg-dark-700/50 border border-dark-500 rounded-2xl p-7">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-display text-sm font-bold text-white mb-2">{f.t}</h3>
              <p className="text-sm text-gray-500">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
