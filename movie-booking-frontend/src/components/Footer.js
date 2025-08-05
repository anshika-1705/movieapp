// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-4">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} CineLuxe. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
