// controllers/bookingController.js
const Booking = require('../models/booking');
const Show = require('../models/Show');
const asyncHandler = require('../middleware/asynchandler');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res) => {
  const { showId, seats, paymentMethod } = req.body;
  const userId = req.user._id;

  const show = await Show.findById(showId).populate('movie theater');
  if (!show) {
    return res.status(404).json({
      success: false,
      message: 'Show not found'
    });
  }

  const bookedSeatNumbers = show.bookedSeats.map(seat => seat.seatNumber);
  const requestedSeats = seats.map(seat => seat.seatNumber);

  const unavailableSeats = requestedSeats.filter(seat =>
    bookedSeatNumbers.includes(seat)
  );

  if (unavailableSeats.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Seats ${unavailableSeats.join(', ')} are already booked`
    });
  }

  const totalAmount = seats.reduce((total, seat) => {
    const price = show.price[seat.category.toLowerCase()] || 0;
    return total + price;
  }, 0);

  const booking = await Booking.create({
    user: userId,
    show: showId,
    seats: seats.map(seat => ({
      ...seat,
      price: show.price[seat.category.toLowerCase()]
    })),
    totalAmount,
    paymentMethod,
    paymentStatus: 'completed'
  });

  show.bookedSeats.push(...seats);
  await show.save();

  const populatedBooking = await Booking.findById(booking._id)
    .populate({
      path: 'show',
      populate: {
        path: 'movie theater'
      }
    })
    .populate('user', 'name email phone');

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: populatedBooking
  });
});

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate({
      path: 'show',
      populate: {
        path: 'movie theater'
      }
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate({
      path: 'show',
      populate: {
        path: 'movie theater'
      }
    })
    .populate('user', 'name email phone');

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this booking'
    });
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to cancel this booking'
    });
  }

  const show = await Show.findById(booking.show);
  const showDateTime = new Date(`${show.date.toDateString()} ${show.startTime}`);
  const currentTime = new Date();
  const timeDifference = showDateTime - currentTime;
  const hoursUntilShow = timeDifference / (1000 * 60 * 60);

  if (hoursUntilShow < 2) {
    return res.status(400).json({
      success: false,
      message: 'Cannot cancel booking within 2 hours of show time'
    });
  }

  booking.bookingStatus = 'cancelled';
  booking.paymentStatus = 'refunded';
  await booking.save();

  const seatNumbers = booking.seats.map(seat => seat.seatNumber);
  show.bookedSeats = show.bookedSeats.filter(
    seat => !seatNumbers.includes(seat.seatNumber)
  );
  await show.save();

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    data: booking
  });
});

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  let query = {};
  if (status) {
    query.bookingStatus = status;
  }

  const bookings = await Booking.find(query)
    .populate({
      path: 'show',
      populate: {
        path: 'movie theater'
      }
    })
    .populate('user', 'name email phone')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await Booking.countDocuments(query);

  res.status(200).json({
    success: true,
    count: bookings.length,
    total,
    data: bookings
  });
});
