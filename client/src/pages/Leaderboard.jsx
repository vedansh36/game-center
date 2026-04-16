import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const MEDALS = ['🥇','🥈','🥉'];

export default function Leaderboard() {
  const { user }          = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/points/leaderboard')
      .then(r => setLeaders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🏆</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">Leaderboard</h1>
        <p className="text-gray-500 mt-2">Top 20 players ranked by total points</p>
      </div>

      <div className="bg-dark-800 border border-dark-500 rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 px-5 py-3 border-b border-dark-500 text-xs font-semibold text-gray-500 uppercase tracking-widest">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Player</div>
          <div className="col-span-2 text-right">Points</div>
          <div className="col-span-2 text-right hidden sm:block">Played</div>
          <div className="col-span-2 text-right hidden sm:block">Wins</div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><LoadingSpinner /></div>
        ) : leaders.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No scores yet. Be the first!</div>
        ) : (
          leaders.map((p, i) => {
            const isMe = user && p._id === user._id;
            return (
              <div
                key={p._id}
                className={`grid grid-cols-12 px-5 py-4 border-b border-dark-600/50 last:border-0 items-center transition-colors
                  ${isMe ? 'bg-purple-500/10' : 'hover:bg-dark-700/50'}`}
              >
                <div className="col-span-1 font-display text-sm font-bold">
                  {i < 3 ? MEDALS[i] : <span className="text-gray-500">{i + 1}</span>}
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                    ${i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                      i === 1 ? 'bg-gray-400/20 text-gray-300' :
                      i === 2 ? 'bg-orange-500/20 text-orange-400' :
                                'bg-dark-600 text-gray-400'}`}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${isMe ? 'text-purple-300' : 'text-white'}`}>
                      {p.name} {isMe && <span className="text-xs text-purple-400">(You)</span>}
                    </div>
                  </div>
                </div>
                <div className="col-span-2 text-right font-display text-sm font-bold text-yellow-400">
                  {p.totalPoints.toLocaleString()}
                </div>
                <div className="col-span-2 text-right text-sm text-gray-500 hidden sm:block">
                  {p.gamesPlayed}
                </div>
                <div className="col-span-2 text-right text-sm text-green-400 hidden sm:block">
                  {p.gamesWon}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
