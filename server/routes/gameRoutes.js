const express    = require('express');
const router     = express.Router();
const { getGames, getGame, recordPlay } = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',           getGames);
router.get('/:slug',      getGame);
router.patch('/:slug/play', protect, recordPlay);

module.exports = router;
