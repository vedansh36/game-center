/**
 * Seed the 12 games into MongoDB.
 * Run: node utils/seedGames.js
 */
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Game     = require('../models/Game');

const games = [
  {
    slug:'tic-tac-toe', title:'Tic Tac Toe', icon:'❌',
    category:'strategy', difficulty:'Easy', maxPoints:50,
    description:'Classic 3×3 grid battle against a minimax AI. Can you outwit the machine?',
    rules:['Play on a 3×3 grid','You are X, AI is O','Take turns placing your mark','Get 3 in a row to win'],
    winCondition:'Get three of your marks in a row — horizontally, vertically, or diagonally.'
  },
  {
    slug:'snake', title:'Snake', icon:'🐍',
    category:'arcade', difficulty:'Medium', maxPoints:500,
    description:'Guide the snake to eat food and grow. Avoid walls and your own tail!',
    rules:['Use arrow keys to move','Eat food to grow and earn points','Avoid hitting walls or yourself','Game ends on collision'],
    winCondition:'Score as many points as possible. Each food = 10 pts.'
  },
  {
    slug:'memory-game', title:'Memory Game', icon:'🃏',
    category:'puzzle', difficulty:'Medium', maxPoints:100,
    description:'Flip cards to find matching pairs. Test your memory and speed.',
    rules:['Flip two cards per turn','Match all 8 pairs to win','Fewer attempts = more points'],
    winCondition:'Match all 8 pairs in as few attempts as possible.'
  },
  {
    slug:'number-guessing', title:'Number Guessing', icon:'🔢',
    category:'puzzle', difficulty:'Easy', maxPoints:100,
    description:'A number is hidden between 1 and 100. Guess it with hints!',
    rules:['Guess a number between 1 and 100','Get "Higher" or "Lower" hints','You have 10 attempts'],
    winCondition:'Guess the number in as few attempts as possible.'
  },
  {
    slug:'rock-paper-scissors', title:'Rock Paper Scissors', icon:'✂️',
    category:'strategy', difficulty:'Easy', maxPoints:75,
    description:'Classic hand game versus the computer. Best of 5 rounds!',
    rules:['Rock beats Scissors','Scissors beats Paper','Paper beats Rock','Best of 5 rounds wins'],
    winCondition:'Win the majority of 5 rounds to earn points.'
  },
  {
    slug:'whack-a-mole', title:'Whack-a-Mole', icon:'🔨',
    category:'arcade', difficulty:'Medium', maxPoints:300,
    description:'Moles pop out of holes — click as fast as you can within 30 seconds!',
    rules:['Click moles as they appear','Each mole = 10 points','30 seconds on the clock','Missed moles score nothing'],
    winCondition:'Hit as many moles as possible in 30 seconds.'
  },
  {
    slug:'word-scramble', title:'Word Scramble', icon:'🔤',
    category:'puzzle', difficulty:'Medium', maxPoints:100,
    description:'Unscramble 5 jumbled words before the timer runs out!',
    rules:['Type the correct word from the scrambled letters','You have 30 seconds per word','Each correct answer = 20 pts','Case-insensitive'],
    winCondition:'Unscramble all 5 words to achieve a perfect score.'
  },
  {
    slug:'math-quiz', title:'Math Quiz', icon:'➕',
    category:'trivia', difficulty:'Medium', maxPoints:100,
    description:'Answer 10 rapid-fire maths questions before time runs out!',
    rules:['Choose the correct answer from 4 options','15 seconds per question','Each correct answer = 10 pts','No penalty for wrong answers'],
    winCondition:'Answer all 10 questions correctly for 100 points.'
  },
  {
    slug:'simon-says', title:'Simon Says', icon:'🟢',
    category:'puzzle', difficulty:'Hard', maxPoints:150,
    description:'Watch the colour pattern and repeat it back. How long can your memory hold?',
    rules:['Watch the colour sequence light up','Repeat the sequence by clicking','Each round adds one more colour','3 lives — wrong click loses a life'],
    winCondition:'Complete as many rounds as possible. Each round = 15 pts.'
  },
  {
    slug:'2048', title:'2048', icon:'🎯',
    category:'strategy', difficulty:'Hard', maxPoints:200,
    description:'Slide and merge tiles to reach the 2048 tile — a true mind bender.',
    rules:['Use arrow keys to slide tiles','Matching tiles merge and double','Build up to 2048','Game ends when no moves remain'],
    winCondition:'Reach the 2048 tile to win big points!'
  },
  {
    slug:'breakout', title:'Breakout', icon:'🧱',
    category:'arcade', difficulty:'Medium', maxPoints:250,
    description:'Classic brick-breaking arcade action. Bounce the ball to smash all bricks!',
    rules:['Move paddle with arrow keys or mouse','Bounce the ball to break bricks','Each brick = 5 pts','3 lives — don't let the ball fall!'],
    winCondition:'Clear all bricks to win the stage.'
  },
  {
    slug:'color-match', title:'Color Match', icon:'🎨',
    category:'trivia', difficulty:'Medium', maxPoints:150,
    description:'The word "RED" might be printed in blue ink — match the INK colour, not the word!',
    rules:['Choose the colour of the text's INK (not what it says)','30 seconds on the clock','Each correct = 15 pts','Streak bonus applies'],
    winCondition:'Build the highest streak in 30 seconds.'
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gamecentre');
    await Game.deleteMany({});
    const inserted = await Game.insertMany(games);
    console.log(`✅  Seeded ${inserted.length} games`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
