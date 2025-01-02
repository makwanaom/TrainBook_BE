const express = require('express');
const { getSeatAvailability, bookSeats } = require('../controllers/seatController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/availability', authMiddleware, getSeatAvailability);
router.post('/reserve', authMiddleware, bookSeats);


module.exports = router;