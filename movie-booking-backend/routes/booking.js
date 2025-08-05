const express = require('express');
const {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  getAllBookings
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, authorize('admin'), getAllBookings);

router.get('/my-bookings', protect, getMyBookings);

router.route('/:id')
  .get(protect, getBooking)
  .put(protect, cancelBooking);

router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;