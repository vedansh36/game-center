# 🎮 Game Centre

A full-stack, production-ready gaming platform where users can sign up, play browser games, earn points, and compete on a leaderboard.

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcryptjs

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas URI)
- npm or yarn

---

### 1. Clone / Extract
```bash
unzip game-centre.zip
cd game-centre
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env      # Fill in your values
npm run dev               # Runs on http://localhost:5000
```

### 3. Seed Games into DB (one-time)
```bash
# In a second terminal, while backend is running:
cd server
node utils/seedGames.js
```

### 4. Frontend Setup
```bash
cd ../client
npm install
cp .env.example .env      # Set VITE_API_URL if needed
npm run dev               # Runs on http://localhost:5173
```

---

## 📁 Project Structure
```
game-centre/
├── server/               # Express API
│   ├── config/           # DB connection
│   ├── controllers/      # Auth, Games, Points
│   ├── middleware/       # JWT auth guard
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   └── utils/            # Seed script
└── client/               # React + Vite
    └── src/
        ├── components/   # Navbar, Footer, GameCard, Modal…
        ├── context/      # AuthContext
        ├── games/        # 12 browser games
        ├── hooks/        # useGamePoints
        ├── pages/        # Home, Login, Signup, Games…
        └── services/     # Axios API client
```

## 🎮 Games & Points
| Game              | Points |
|-------------------|--------|
| Tic Tac Toe       | 50     |
| Snake             | 10/food|
| Memory Game       | 100    |
| Number Guessing   | 10–100 |
| Rock Paper Scissors| 15/win|
| Whack-a-Mole      | 10/mole|
| Word Scramble     | 20/word|
| Math Quiz         | 10/Q   |
| Simon Says        | 15/rnd |
| 2048              | 50–200 |
| Breakout          | 5/brick|
| Color Match       | 15/hit |

## 🔐 Environment Variables

### server/.env
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/gamecentre
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:5173
```

### client/.env
```
VITE_API_URL=http://localhost:5000/api
```
