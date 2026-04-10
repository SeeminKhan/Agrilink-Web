const router = require('express').Router();
const { syncDrafts } = require('../controllers/syncController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/drafts', authMiddleware, roleMiddleware('farmer'), syncDrafts);

module.exports = router;
