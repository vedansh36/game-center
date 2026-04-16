const express = require('express');
const router  = express.Router();
const { submitScore, getLeaderboard, getMyScores, getBestScore } = require('../controllers/pointsController');
const { protect } = require('../middleware/authMiddleware');

router.post('/submit',          protect, submitScore);
router.get('/leaderboard',      getLeaderboard);
router.get('/my-scores',        protect, getMyScores);
router.get('/my-scores/:slug',  protect, getBestScore);

module.exports = router;
