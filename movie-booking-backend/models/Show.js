const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  },
  screenNumber: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  price: {
    premium: {
      type: Number,
      default: 0
    },
    gold: {
      type: Number,
      default: 0
    },
    silver: {
      type: Number,
      default: 0
    }
  },
  availableSeats: {
    type: Map,
    of: Boolean,
    default: {}
  },
  bookedSeats: [{
    seatNumber: String,
    category: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Show', showSchema);