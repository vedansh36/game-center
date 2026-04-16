const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema(
  {
    user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    game:      { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    gameSlug:  { type: String, required: true },
    points:    { type: Number, required: true, default: 0 },
    won:       { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Score', scoreSchema);
