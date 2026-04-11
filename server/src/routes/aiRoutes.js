const router = require('express').Router();
const { qualityCheck, cropQuality } = require('../controllers/aiController');
const upload = require('../middleware/uploadMiddleware');

// Legacy file-upload quality check
router.post('/quality-check', upload.single('image'), qualityCheck);

// New ML-powered crop quality prediction
router.post('/crop-quality', cropQuality);

module.exports = router;
