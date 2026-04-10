const router = require('express').Router();
const { getMarketplace, filterMarketplace, getQrTrace } = require('../controllers/marketplaceController');

router.get('/',              getMarketplace);
router.post('/filter',       filterMarketplace);
router.get('/qr/:produceId', getQrTrace);

module.exports = router;
