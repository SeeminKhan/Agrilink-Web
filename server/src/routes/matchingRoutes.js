const router = require('express').Router();
const { matchForBuyer, matchForFarmer } = require('../controllers/matchingController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/for-buyer/:buyerId',   authMiddleware, matchForBuyer);
router.get('/for-farmer/:farmerId', authMiddleware, matchForFarmer);

module.exports = router;
