const express = require('express');
const {
  getShows,
  getShowsByMovie,
  getAvailableSeats,
  createShow
} = require('../controllers/showcontroller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getShows)
  .post(protect, authorize('admin'), createShow);

router.get('/movie/:movieId', getShowsByMovie);
router.get('/:id/seats', getAvailableSeats);

module.exports = router;