import { Link } from 'react-router-dom';

const diffColors = {
  Easy:   'text-green-400 bg-green-400/10 border-green-400/20',
  Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Hard:   'text-red-400   bg-red-400/10   border-red-400/20',
};

export default function GameCard({ game }) {
  return (
    <div className="bg-dark-700 border border-dark-500 rounded-2xl p-5 card-glow flex flex-col gap-3">
      {/* Icon + badge */}
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-dark-600 border border-dark-500 flex items-center justify-center text-2xl">
          {game.icon}
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${diffColors[game.difficulty] || diffColors.Medium}`}>
          {game.difficulty}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display text-sm font-bold text-white tracking-wide">
        {game.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-400 leading-relaxed flex-1">
        {game.description}
      </p>

      {/* Max points */}
      <div className="flex items-center gap-1 text-xs text-purple-400 font-semibold">
        <span>⭐</span>
        <span>Up to {game.maxPoints} pts</span>
      </div>

      {/* Play button */}
      <Link
        to={`/games/${game.slug}`}
        className="btn-primary text-center text-sm py-2.5 mt-1 block rounded-xl"
      >
        ▶ Play Now
      </Link>
    </div>
  );
}
