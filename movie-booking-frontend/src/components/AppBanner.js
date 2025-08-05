// src/components/AppBanner.js
import React from 'react';

const AppBanner = () => {
  return (
    <div
      className="app-banner text-center"
      style={{
        background: 'url("/images/banner.jpg") no-repeat center center/cover',
        padding: '20px 0', // Add any padding you want
      }}
    >
      <h1 className="display-4">CineLuxe</h1>
      <p className="lead">Experience Premium Movie Booking</p>
    </div>
  );
};

export default AppBanner;
