const express = require('express');
const {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  getNowShowingMovies,
  getUpcomingMovies
} = require('../controllers/moviecontrollers');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getMovies)
  .post(protect, authorize('admin'), createMovie);

router.get('/now-showing', getNowShowingMovies);
router.get('/upcoming', getUpcomingMovies);

router.route('/:id')
  .get(getMovie)
  .put(protect, authorize('admin'), updateMovie)
  .delete(protect, authorize('admin'), deleteMovie);

module.exports = router;