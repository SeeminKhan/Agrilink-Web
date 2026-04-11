const router = require('express').Router();
const { getFacilities, getMyCrops, bookStorage, updateCropStatus, deleteCrop } = require('../controllers/coldStorageController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/facilities',       getFacilities);
router.get('/my',               authMiddleware, roleMiddleware('farmer'), getMyCrops);
router.post('/',                authMiddleware, roleMiddleware('farmer'), bookStorage);
router.patch('/:id/status',     authMiddleware, roleMiddleware('farmer'), updateCropStatus);
router.delete('/:id',           authMiddleware, roleMiddleware('farmer'), deleteCrop);

module.exports = router;
