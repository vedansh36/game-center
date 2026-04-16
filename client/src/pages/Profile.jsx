import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Profile() {
  const { user }       = useAuth();
  const [scores, setScores]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/points/my-scores')
      .then(r => setScores(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  const wr = user.gamesPlayed > 0
    ? Math.round((user.gamesWon / user.gamesPlayed) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header card */}
      <div className="bg-dark-800 border border-dark-500 rounded-2xl p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-3xl font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="font-display text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-gray-400 text-sm mt-1">{user.email}</p>
            <p className="text-xs text-gray-600 mt-1">
              Member since {new Date(user.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long' })}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-dark-500">
          {[
            { v: user.totalPoints, l:'Total Points', c:'text-yellow-400' },
            { v: user.gamesPlayed, l:'Games Played', c:'text-blue-400' },
            { v: `${wr}%`,         l:'Win Rate',     c:'text-green-400' },
          ].map(s => (
            <div key={s.l} className="text-center">
              <div className={`font-display text-2xl sm:text-3xl font-bold ${s.c}`}>{s.v}</div>
              <div className="text-xs text-gray-500 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent scores */}
      <div className="bg-dark-800 border border-dark-500 rounded-2xl p-6">
        <h2 className="font-display text-lg font-bold text-white mb-6">Recent Games</h2>
        {loading ? (
          <div className="flex justify-center py-8"><LoadingSpinner /></div>
        ) : scores.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No games played yet. Go earn some points!</p>
        ) : (
          <div className="space-y-3">
            {scores.map(s => (
              <div key={s._id} className="flex items-center justify-between bg-dark-700 rounded-xl px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-white capitalize">
                    {s.gameSlug.replace(/-/g, ' ')}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {s.won && <span className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">Won</span>}
                  <span className="font-display text-sm font-bold text-purple-400">+{s.points} pts</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
