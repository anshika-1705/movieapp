// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS middleware - Allow requests from React app
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // React dev server ports
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));//
app.use('/api/movies', require('./routes/movie'));//
app.use('/api/bookings', require('./routes/booking'));//
app.use('/api/shows', require('./routes/shows'));//

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Movie Booking API is running!',
    timestamp: new Date().toISOString()
  });
});

// Global error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Handle 404 routes
app.use('*/path', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;