// controllers/showController.js
const Show = require('../models/Show');
const Movie = require('../models/movie');
const asyncHandler = require('../middleware/asynchandler');

// @desc    Get shows for a specific movie
// @route   GET /api/shows/movie/:movieId
// @access  Public
exports.getShowsByMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const { date } = req.query;

  let query = { movie: movieId, isActive: true };
  
  if (date) {
    const searchDate = new Date(date);
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    query.date = {
      $gte: searchDate,
      $lt: nextDay
    };
  }

  const shows = await Show.find(query)
    .populate('theater', 'name location')
    .populate('movie', 'title duration')
    .sort({ date: 1, startTime: 1 });

  res.status(200).json({
    success: true,
    count: shows.length,
    data: shows
  });
});

// @desc    Get available seats for a show
// @route   GET /api/shows/:id/seats
// @access  Public
exports.getAvailableSeats = asyncHandler(async (req, res) => {
  const show = await Show.findById(req.params.id)
    .populate('theater')
    .populate('movie', 'title');

  if (!show) {
    return res.status(404).json({
      success: false,
      message: 'Show not found'
    });
  }

  const bookedSeatNumbers = show.bookedSeats.map(seat => seat.seatNumber);
  const totalSeats = 20; // Match your frontend
  const availableSeats = [];
  
  for (let i = 1; i <= totalSeats; i++) {
    availableSeats.push({
      seatNumber: i.toString(),
      isAvailable: !bookedSeatNumbers.includes(i.toString())
    });
  }

  res.status(200).json({
    success: true,
    data: {
      show: show,
      seats: availableSeats,
      bookedSeats: bookedSeatNumbers
    }
  });
});

// @desc    Create new show
// @route   POST /api/shows
// @access  Private/Admin
exports.createShow = asyncHandler(async (req, res) => {
  const show = await Show.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Show created successfully',
    data: show
  });
});

// @desc    Get all shows
// @route   GET /api/shows
// @access  Public
exports.getShows = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, date, theater } = req.query;
  
  let query = { isActive: true };
  
  if (date) {
    const searchDate = new Date(date);
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    query.date = {
      $gte: searchDate,
      $lt: nextDay
    };
  }
  
  if (theater) {
    query.theater = theater;
  }

  const shows = await Show.find(query)
    .populate('movie', 'title poster duration rating')
    .populate('theater', 'name location')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ date: 1, startTime: 1 });

  const total = await Show.countDocuments(query);

  res.status(200).json({
    success: true,
    count: shows.length,
    total,
    data: shows
  });
});