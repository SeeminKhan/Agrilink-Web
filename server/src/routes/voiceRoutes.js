const router = require('express').Router();
const { voiceIntent } = require('../controllers/voiceController');

router.post('/intent', voiceIntent);

module.exports = router;
