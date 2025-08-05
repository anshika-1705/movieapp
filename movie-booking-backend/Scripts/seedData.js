  const mongoose = require('mongoose');
  const dotenv = require('dotenv');
  const Movie = require('../models/movie');
  const Theater = require('../models/Theater');
  const Show = require('../models/Show');

  dotenv.config();

  const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Connected');
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };

  const sampleMovies = [
    {
      title: "Avengers: Endgame",
      description: "The epic conclusion to the Infinity Saga",
      genre: ["Action", "Adventure", "Drama"],
      duration: 181,
      language: "English",
      rating: "UA",
      releaseDate: new Date("2019-04-26"),
      poster: "/images/avengers.jpg",
      image: "/images/car3.jpg",
      trailer: "https://youtube.com/watch?v=example",
      cast: [
        { name: "Robert Downey Jr.", role: "Iron Man" },
        { name: "Chris Evans", role: "Captain America" }
      ],
      director: "Anthony Russo, Joe Russo",
      showTimings: ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"],
      info: "Action/Adventure • 3h 1m"
    },
    {
      title: "Inception",
      description: "A thief who steals corporate secrets through dream-sharing technology",
      genre: ["Action", "Sci-Fi", "Thriller"],
      duration: 148,
      language: "English",
      rating: "UA",
      releaseDate: new Date("2010-07-16"),
      poster: "/images/inception.jpg",
      image: "/images/car2.jpg",
      trailer: "https://youtube.com/watch?v=example",
      cast: [
        { name: "Leonardo DiCaprio", role: "Dom Cobb" },
        { name: "Marion Cotillard", role: "Mal" }
      ],
      director: "Christopher Nolan",
      showTimings: ["11:00 AM", "2:30 PM", "6:00 PM", "9:30 PM"],
      info: "Sci-Fi/Thriller • 2h 28m"
    },
    {
      title: "Interstellar",
      description: "A team of explorers travel through a wormhole in space",
      genre: ["Drama", "Sci-Fi"],
      duration: 169,
      language: "English",
      rating: "UA",
      releaseDate: new Date("2014-11-07"),
      poster: "/images/interstellar.jpg",
      image: "/images/carousel1.jpg",
      trailer: "https://youtube.com/watch?v=example",
      cast: [
        { name: "Matthew McConaughey", role: "Cooper" },
        { name: "Anne Hathaway", role: "Brand" }
      ],
      director: "Christopher Nolan",
      showTimings: ["10:30 AM", "2:00 PM", "5:30 PM", "9:00 PM"],
      info: "Sci-Fi/Drama • 2h 49m"
    }
  ];

  const sampleTheaters = [
    {
      name: "CineLuxe Multiplex",
      location: {
        address: "123 Main Street",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001"
      },
      screens: [
        {
          screenNumber: 1,
          screenName: "Screen 1",
          totalSeats: 20,
          seatLayout: {
            rows: 4,
            seatsPerRow: 5,
            categories: [
              { name: "Premium", price: 300, rows: ["A", "B"] },
              { name: "Gold", price: 200, rows: ["C"] },
              { name: "Silver", price: 150, rows: ["D"] }
            ]
          }
        }
      ],
      facilities: ["Parking", "Food Court", "AC", "Dolby Atmos"]
    }
  ];

  const seedData = async () => {
    try {
      await connectDB();

      // Clear existing data
      await Movie.deleteMany({});
      await Theater.deleteMany({});
      await Show.deleteMany({});

      console.log('Data cleared');

      // Insert sample data
      const movies = await Movie.insertMany(sampleMovies);
      const theaters = await Theater.insertMany(sampleTheaters);

      console.log('Sample data inserted');

      // Create shows for next 7 days
      const today = new Date();
      const shows = [];

      for (let i = 0; i < 7; i++) {
        const showDate = new Date(today);
        showDate.setDate(today.getDate() + i);

        movies.forEach(movie => {
          movie.showTimings.forEach(time => {
            shows.push({
              movie: movie._id,
              theater: theaters[0]._id,
              screenNumber: 1,
              date: showDate,
              startTime: time,
              endTime: "11:59 PM", // Calculate based on movie duration
              price: {
                premium: 300,
                gold: 200,
                silver: 150
              },
              availableSeats:{},
              bookedSeats: []
            });
          });
        });
      }

      await Show.insertMany(shows);
      console.log('Sample shows created');

      console.log('Database seeded successfully!');
      process.exit(0);
    } catch (error) {
      console.error('Error seeding data:', error);
      process.exit(1);
    }
  };

  seedData();