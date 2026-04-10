const router = require('express').Router();
const {
  createProduce, getAllProduce, getMyProduce, getOfflineCache,
  getProduceById, updateProduce, deleteProduce,
} = require('../controllers/produceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/offline-cache',  getOfflineCache);
router.get('/',               getAllProduce);
router.get('/my',             authMiddleware, roleMiddleware('farmer'), getMyProduce);
router.get('/:id',            getProduceById);
router.post('/',              authMiddleware, roleMiddleware('farmer'), upload.array('images', 5), createProduce);
router.put('/:id',            authMiddleware, roleMiddleware('farmer'), upload.array('images', 5), updateProduce);
router.delete('/:id',         authMiddleware, roleMiddleware('farmer', 'admin'), deleteProduce);

module.exports = router;
