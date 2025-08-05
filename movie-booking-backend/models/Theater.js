const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide theater name'],
    trim: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  },
  screens: [{
    screenNumber: {
      type: Number,
      required: true
    },
    screenName: {
      type: String,
      required: true
    },
    totalSeats: {
      type: Number,
      required: true
    },
    seatLayout: {
      rows: Number,
      seatsPerRow: Number,
      categories: [{
        name: String, // Premium, Gold, Silver
        price: Number,
        rows: [String] // ['A', 'B', 'C']
      }]
    }
  }],
  facilities: [String], // ['Parking', 'Food Court', 'AC']
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Theater', theaterSchema);