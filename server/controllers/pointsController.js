const Score = require('../models/Score');
const User  = require('../models/User');
const Game  = require('../models/Game');

// @POST /api/points/submit
const submitScore = async (req, res) => {
  try {
    const { gameSlug, points, won } = req.body;
    if (points === undefined || !gameSlug)
      return res.status(400).json({ message: 'gameSlug and points are required' });

    const game = await Game.findOne({ slug: gameSlug });
    if (!game) return res.status(404).json({ message: 'Game not found' });

    // Save individual score record
    await Score.create({ user: req.user._id, game: game._id, gameSlug, points, won: !!won });

    // Update user totals
    const update = {
      $inc: { totalPoints: points, gamesPlayed: 1 }
    };
    if (won) update.$inc.gamesWon = 1;

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });
    res.json({ message: 'Score saved', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/points/leaderboard
const getLeaderboard = async (_req, res) => {
  try {
    const leaders = await User.find({}, 'name totalPoints gamesPlayed gamesWon')
      .sort({ totalPoints: -1 })
      .limit(20);
    res.json(leaders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/points/my-scores
const getMyScores = async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/points/my-scores/:slug  — best score for a game
const getBestScore = async (req, res) => {
  try {
    const best = await Score.findOne({ user: req.user._id, gameSlug: req.params.slug })
      .sort({ points: -1 });
    res.json(best || { points: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { submitScore, getLeaderboard, getMyScores, getBestScore };
