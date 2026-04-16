const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    slug:        { type: String, required: true, unique: true },
    title:       { type: String, required: true },
    description: { type: String, required: true },
    icon:        { type: String, default: '🎮' },
    category:    { type: String, enum: ['puzzle','arcade','strategy','trivia'], default: 'arcade' },
    difficulty:  { type: String, enum: ['Easy','Medium','Hard'], default: 'Medium' },
    maxPoints:   { type: Number, default: 100 },
    rules:       [String],
    winCondition:{ type: String, default: '' },
    timeLimitSec:{ type: Number, default: 0 }, // 0 = unlimited
    plays:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Game', gameSchema);
