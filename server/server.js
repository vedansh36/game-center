const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');

dotenv.config();

const connectDB    = require('./config/db');
const authRoutes   = require('./routes/authRoutes');
const gameRoutes   = require('./routes/gameRoutes');
const pointsRoutes = require('./routes/pointsRoutes');

const app = express();

// ── DB ──────────────────────────────────────
connectDB();

// ── Middleware ───────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ───────────────────────────────────
app.use('/api/auth',   authRoutes);
app.use('/api/games',  gameRoutes);
app.use('/api/points', pointsRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'OK', message: 'Game Centre API running' }));

// ── Global error handler ─────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀  Server running → http://localhost:${PORT}`));
