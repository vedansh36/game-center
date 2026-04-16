import { useState, useEffect } from 'react';
import GameCard from '../components/GameCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';

export default function Games() {
  const [games,   setGames]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [search,  setSearch]  = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    api.get('/games').then(r => setGames(r.data)).catch(() => setError('Failed to load games')).finally(() => setLoading(false));
  }, []);

  const cats = ['all', 'arcade', 'puzzle', 'strategy', 'trivia'];

  const filtered = games.filter(g => {
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase());
    const matchCat    = category === 'all' || g.category === category;
    return matchSearch && matchCat;
  });

  if (loading) return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  if (error)   return <div className="text-center text-red-400 py-20">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">Game Hall</h1>
        <p className="text-gray-500">{games.length} games available — earn points and top the leaderboard</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text" placeholder="Search games…"
          className="input-field sm:max-w-xs text-sm"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          {cats.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                category === c
                  ? 'bg-purple-600 border-purple-600 text-white'
                  : 'border-dark-500 text-gray-400 hover:border-purple-500 hover:text-purple-400'
              }`}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-20">No games found</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(g => <GameCard key={g._id} game={g} />)}
        </div>
      )}
    </div>
  );
}
