export default function Footer() {
  return (
    <footer className="border-t border-white/5 glass py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎮</span>
          <span className="font-display text-sm font-bold text-gray-400 tracking-widest">GAMECENTRE</span>
        </div>
        <p className="text-xs text-gray-600">© {new Date().getFullYear()} Game Centre. Play. Compete. Win.</p>
        <div className="flex gap-5 text-xs text-gray-600">
          <span>12 Games</span>
          <span>•</span>
          <span>Real-time Points</span>
          <span>•</span>
          <span>Leaderboard</span>
        </div>
      </div>
    </footer>
  );
}
