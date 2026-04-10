const router = require('express').Router();
const { priceTrends, cropDemand, heatmap, farmerIncome } = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/price-trends',       authMiddleware, priceTrends);
router.get('/crop-demand',        authMiddleware, cropDemand);
router.get('/heatmap',            authMiddleware, heatmap);
router.get('/income/:farmerId',   authMiddleware, farmerIncome);

module.exports = router;
