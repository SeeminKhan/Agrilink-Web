const router = require('express').Router();
const { getTrace, addTraceLog } = require('../controllers/traceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/:produceId',  getTrace);
router.post('/log',        authMiddleware, roleMiddleware('farmer', 'admin'), addTraceLog);

module.exports = router;
