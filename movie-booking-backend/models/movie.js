const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide movie title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide movie description']
  },
  genre: [{
    type: String,
    required: true
  }],
  duration: {
    type: Number,
    required: [true, 'Please provide movie duration in minutes']
  },
  language: {
    type: String,
    required: [true, 'Please provide movie language']
  },
  rating: {
    type: String,
    enum: ['U', 'UA', 'A', 'S'],
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  poster: {
    type: String,
    required: [true, 'Please provide movie poster URL']
  },
  image: {
    type: String,
    required: [true, 'Please provide movie image URL']
  },
  trailer: {
    type: String
  },
  cast: [{
    name: String,
    role: String
  }],
  director: {
    type: String,
    required: true
  },
  showTimings: [{
    type: String,
    required: true
  }],
  info: {
    type: String // Additional movie info/description
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);