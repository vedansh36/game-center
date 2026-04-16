const Game  = require('../models/Game');

// @GET /api/games
const getGames = async (_req, res) => {
  try {
    const games = await Game.find().sort({ title: 1 });
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/games/:slug
const getGame = async (req, res) => {
  try {
    const game = await Game.findOne({ slug: req.params.slug });
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PATCH /api/games/:slug/play  — increment play counter
const recordPlay = async (req, res) => {
  try {
    const game = await Game.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { plays: 1 } },
      { new: true }
    );
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getGames, getGame, recordPlay };
