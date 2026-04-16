const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Game = require('../models/Game');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const games = [
  {
    title: "Tic Tac Toe",
    slug: "tic-tac-toe",
    description: "Classic 3x3 grid strategy game",
    icon: "❌",
    rules: [
      "Two players take turns",
      "Mark X or O",
      "Get 3 in a row to win"
    ],
    winCondition: "3 in a row",
    maxPoints: 100
  },
  {
    title: "Snake",
    slug: "snake",
    description: "Eat food and grow longer",
    icon: "🐍",
    rules: [
      "Control snake direction",
      "Eat food to grow",
      "Avoid hitting walls"
    ],
    winCondition: "Highest length",
    maxPoints: 150
  },
  {
    title: "Memory Game",
    slug: "memory-game",
    description: "Match pairs of cards",
    icon: "🧠",
    rules: [
      "Flip two cards",
      "Match identical cards",
      "Finish with least attempts"
    ],
    winCondition: "Match all pairs",
    maxPoints: 120
  },
  {
    title: "Number Guessing",
    slug: "number-guessing",
    description: "Guess the hidden number",
    icon: "🔢",
    rules: [
      "Guess between 1–100",
      "Hints will be given",
      "Fewer guesses = more points"
    ],
    winCondition: "Correct guess",
    maxPoints: 80
  },
  {
    title: "Rock Paper Scissors",
    slug: "rock-paper-scissors",
    description: "Classic hand game vs computer",
    icon: "✊",
    rules: [
      "Choose rock, paper, or scissors",
      "Beat the opponent",
      "Win majority rounds"
    ],
    winCondition: "Win more rounds",
    maxPoints: 70
  },
  {
    title: "Whack A Mole",
    slug: "whack-a-mole",
    description: "Hit moles as they appear",
    icon: "🔨",
    rules: [
      "Click moles quickly",
      "Avoid missing",
      "Score as many as possible"
    ],
    winCondition: "Highest score",
    maxPoints: 130
  },
  {
    title: "Word Scramble",
    slug: "word-scramble",
    description: "Unscramble words",
    icon: "🔤",
    rules: [
      "Rearrange letters",
      "Form correct word",
      "Limited time"
    ],
    winCondition: "Correct words",
    maxPoints: 90
  },
  {
    title: "Math Quiz",
    slug: "math-quiz",
    description: "Solve math questions quickly",
    icon: "➗",
    rules: [
      "Answer questions",
      "Time-based scoring",
      "Accuracy matters"
    ],
    winCondition: "Max correct answers",
    maxPoints: 110
  },
  {
    title: "Simon Says",
    slug: "simon-says",
    description: "Repeat the pattern",
    icon: "🎵",
    rules: [
      "Watch sequence",
      "Repeat correctly",
      "Sequence grows"
    ],
    winCondition: "Longest sequence",
    maxPoints: 140
  },
  {
    title: "2048",
    slug: "2048",
    description: "Merge tiles to reach 2048",
    icon: "🔢",
    rules: [
      "Swipe to move tiles",
      "Merge same numbers",
      "Reach 2048 tile"
    ],
    winCondition: "2048 tile",
    maxPoints: 200
  },
  {
    title: "Breakout",
    slug: "breakout",
    description: "Break bricks with ball",
    icon: "🧱",
    rules: [
      "Bounce ball",
      "Break all bricks",
      "Don't miss ball"
    ],
    winCondition: "Clear all bricks",
    maxPoints: 160
  },
  {
    title: "Color Match",
    slug: "color-match",
    description: "Match colors quickly",
    icon: "🎨",
    rules: [
      "Match correct colors",
      "Speed matters",
      "Avoid mistakes"
    ],
    winCondition: "Max correct matches",
    maxPoints: 100
  }
];

const seedGames = async () => {
  try {
    await Game.deleteMany();
    await Game.insertMany(games);

    console.log("✅ All games seeded successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedGames();