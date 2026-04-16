import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useGamePoints } from '../hooks/useGamePoints';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

// ── game components map ───────────────────────
import TicTacToe       from '../games/TicTacToe';
import SnakeGame        from '../games/Snake';
import MemoryGame       from '../games/MemoryGame';
import NumberGuessing   from '../games/NumberGuessing';
import RockPaperScissors from '../games/RockPaperScissors';
import WhackAMole       from '../games/WhackAMole';
import WordScramble     from '../games/WordScramble';
import MathQuiz         from '../games/MathQuiz';
import SimonSays        from '../games/SimonSays';
import Game2048         from '../games/Game2048';
import Breakout         from '../games/Breakout';
import ColorMatch       from '../games/ColorMatch';

const GAME_MAP = {
  'tic-tac-toe':       TicTacToe,
  'snake':             SnakeGame,
  'memory-game':       MemoryGame,
  'number-guessing':   NumberGuessing,
  'rock-paper-scissors': RockPaperScissors,
  'whack-a-mole':      WhackAMole,
  'word-scramble':     WordScramble,
  'math-quiz':         MathQuiz,
  'simon-says':        SimonSays,
  '2048':              Game2048,
  'breakout':          Breakout,
  'color-match':       ColorMatch,
};

export default function GamePlay() {
  const { slug } = useParams();
  const [game,       setGame]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [showRules,  setShowRules]  = useState(true);
  const [playing,    setPlaying]    = useState(false);
  const [result,     setResult]     = useState(null); // { points, won }
  const { submitScore, submitting } = useGamePoints();

  useEffect(() => {
    api.get(`/games/${slug}`)
      .then(r => setGame(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const startGame = () => {
    setShowRules(false);
    setPlaying(true);
    setResult(null);
    // record play
    api.patch(`/games/${slug}/play`).catch(() => {});
  };

  const handleGameEnd = async (points, won = false) => {
    setPlaying(false);
    setResult({ points, won });
    await submitScore(slug, points, won);
  };

  const playAgain = () => {
    setResult(null);
    setShowRules(true);
  };

  if (loading) return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  if (!game)   return <div className="text-center text-gray-400 py-20">Game not found. <Link to="/games" className="text-purple-400">Back to games</Link></div>;

  const GameComponent = GAME_MAP[slug];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/games" className="hover:text-purple-400 transition-colors">Games</Link>
        <span>/</span>
        <span className="text-white">{game.title}</span>
      </div>

      {/* Game header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-dark-700 border border-dark-500 flex items-center justify-center text-3xl">
          {game.icon}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{game.title}</h1>
          <p className="text-gray-400 text-sm">{game.description}</p>
        </div>
      </div>

      {/* Rules modal */}
      <Modal isOpen={showRules} onClose={() => {}} title={`How to Play: ${game.title}`} size="md">
        <div className="space-y-4">
          <ul className="space-y-2">
            {game.rules.map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="text-purple-400 font-bold mt-0.5">{i + 1}.</span>
                {r}
              </li>
            ))}
          </ul>
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-sm text-green-400">
            <strong>Win condition:</strong> {game.winCondition}
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-sm text-purple-300">
            🏆 Max points: <strong>{game.maxPoints} pts</strong>
          </div>
          <button onClick={startGame} className="btn-primary w-full py-3 text-base mt-2">
            ▶ Start Game
          </button>
        </div>
      </Modal>

      {/* Result modal */}
      {result && (
        <Modal isOpen={true} onClose={() => {}} title={result.won ? '🏆 You Won!' : '🎮 Game Over'} size="sm">
          <div className="text-center space-y-4">
            <div className="text-6xl">{result.won ? '🏆' : '💀'}</div>
            <p className={`font-display text-3xl font-bold ${result.won ? 'text-yellow-400' : 'text-blue-400'}`}>
              +{result.points} pts
            </p>
            <p className="text-gray-400 text-sm">
              {submitting ? 'Saving score…' : 'Score saved to your profile!'}
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={playAgain} className="btn-primary flex-1 py-2.5">Play Again</button>
              <Link to="/games" className="btn-outline flex-1 py-2.5 text-center">All Games</Link>
            </div>
          </div>
        </Modal>
      )}

      {/* Game area */}
      {playing && GameComponent && (
        <div className="bg-dark-800 border border-dark-500 rounded-2xl p-4 sm:p-8">
          <GameComponent onGameEnd={handleGameEnd} />
        </div>
      )}
    </div>
  );
}
