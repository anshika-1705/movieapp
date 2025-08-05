// src/components/TopMoviesCarousel.js
import React, { useEffect } from 'react';
import Carousel from 'bootstrap/js/dist/carousel';

const TopMoviesCarousel = () => {
  // Define top movies using your horizontal images
  const topMovies = [
    { id: 1, title: "Avengers: Endgame", image: "/images/car3.jpg" },
    { id: 2, title: "Inception", image: "/images/car2.jpg" },
    { id: 3, title: "Interstellar", image: "/images/carousel1.jpg" }
  ];

  useEffect(() => {
    const carouselElement = document.getElementById('topMoviesCarousel');
    if (carouselElement) {
      new Carousel(carouselElement, {
        interval: 3000, // auto-slide every 3 seconds
        pause: 'hover'  // pause on hover
      });
    }
  }, []);

  return (
    <div
      id="topMoviesCarousel"
      className="carousel slide mb-4"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        {topMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={`carousel-item ${index === 0 ? 'active' : ''}`}
            style={{ height: '400px' }}
          >
            <img 
              src={movie.image} 
              className="d-block w-100" 
              alt={movie.title}
              style={{
                height: '100%',
                objectFit: 'contain',
                backgroundColor: '#000'
              }}
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>{movie.title}</h5>
            </div>
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#topMoviesCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#topMoviesCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default TopMoviesCarousel;
