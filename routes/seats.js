const express = require('express');
const { getSeatAvailability, bookSeats, cancelSeats } = require('../controllers/seatController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/availability', authMiddleware, getSeatAvailability);
router.post('/reserve', authMiddleware, bookSeats);
router.delete('/cancel', authMiddleware, cancelSeats);

module.exports = router;