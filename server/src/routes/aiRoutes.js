const router = require('express').Router();
const { qualityCheck } = require('../controllers/aiController');
const upload = require('../middleware/uploadMiddleware');

router.post('/quality-check', upload.single('image'), qualityCheck);

module.exports = router;
