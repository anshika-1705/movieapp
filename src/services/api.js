// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Auth API calls
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Movies API calls
export const moviesAPI = {
  getAllMovies: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/movies?${queryString}`);
    return response.json();
  },

  getMovie: async (id) => {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`);
    return response.json();
  },

  getNowShowing: async () => {
    const response = await fetch(`${API_BASE_URL}/movies/now-showing`);
    return response.json();
  },

  getUpcoming: async () => {
    const response = await fetch(`${API_BASE_URL}/movies/upcoming`);
    return response.json();
  }
};

// Shows API calls
export const showsAPI = {
  getShowsByMovie: async (movieId, date = null) => {
    const params = date ? `?date=${date}` : '';
    const response = await fetch(`${API_BASE_URL}/shows/movie/${movieId}${params}`);
    return response.json();
  },

  getAvailableSeats: async (showId) => {
    const response = await fetch(`${API_BASE_URL}/shows/${showId}/seats`);
    return response.json();
  }
};

// Bookings API calls
export const bookingsAPI = {
  createBooking: async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });
    return response.json();
  },

  getMyBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getBooking: async (id) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  cancelBooking: async (id) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};