// controllers/movieController.js
const Movie = require('../models/movie');
const asyncHandler = require('../middleware/asynchandler');

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
exports.getMovies = asyncHandler(async (req, res) => {
    const { search, genre, language, page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = { isActive: true };
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    if (genre) {
      query.genre = { $in: [genre] };
    }
    
    if (language) {
      query.language = language;
    }

    const movies = await Movie.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Movie.countDocuments(query);

    res.status(200).json({
      success: true,
      count: movies.length,
      total,
      data: movies
    });
  });

// @desc    Get single movie
// @route   GET /api/movies/:id
// @access  Public
exports.getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new movie
// @route   POST /api/movies
// @access  Private/Admin
exports.createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      data: movie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get now showing movies
// @route   GET /api/movies/now-showing
// @access  Public
exports.getNowShowingMovies = async (req, res) => {
  try {
    const currentDate = new Date();
    const movies = await Movie.find({
      isActive: true,
      releaseDate: { $lte: currentDate }
    }).sort({ releaseDate: -1 });

    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get upcoming movies
// @route   GET /api/movies/upcoming
// @access  Public
exports.getUpcomingMovies = async (req, res) => {
  try {
    const currentDate = new Date();
    const movies = await Movie.find({
      isActive: true,
      releaseDate: { $gt: currentDate }
    }).sort({ releaseDate: 1 });

    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};