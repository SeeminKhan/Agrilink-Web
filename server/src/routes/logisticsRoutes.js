const router = require('express').Router();
const { getVehicles, getMyBookings, createBooking, advanceStatus } = require('../controllers/logisticsController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/vehicles',     getVehicles);
router.get('/my',           authMiddleware, roleMiddleware('farmer'), getMyBookings);
router.post('/',            authMiddleware, roleMiddleware('farmer'), createBooking);
router.patch('/:id/advance',authMiddleware, roleMiddleware('farmer'), advanceStatus);

module.exports = router;
