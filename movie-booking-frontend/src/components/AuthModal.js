import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

function AuthModal({ mode, onClose, onSwitchMode }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match!");
          setLoading(false);
          return;
        }
        if (!formData.name.trim()) {
          setError("Name is required!");
          setLoading(false);
          return;
        }
        if (!formData.phone.trim()) {
          setError("Phone number is required!");
          setLoading(false);
          return;
        }
      }

      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login' 
        ? { email: formData.email, password: formData.password }
        : { 
            name: formData.name, 
            email: formData.email, 
            password: formData.password, 
            phone: formData.phone 
          };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Show success message
        alert(`${mode === 'login' ? 'Login' : 'Registration'} successful! Welcome ${data.user.name}!`);
        
        // Close modal and potentially refresh the app state
        onClose();
        
        // You can also emit a custom event or call a callback to update app state
        window.dispatchEvent(new Event('auth-changed'));
        
      } else {
        setError(data.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header">
            <h5 className="modal-title">{mode === 'login' ? 'Login' : 'Sign Up'}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {mode === 'signup' && (
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                />
              </div>
              {mode === 'signup' && (
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    minLength="6"
                  />
                </div>
              )}
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {mode === 'login' ? 'Logging in...' : 'Signing up...'}
                  </>
                ) : (
                  mode === 'login' ? 'Login' : 'Sign Up'
                )}
              </button>
            </form>
          </div>
          <div className="modal-footer">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button 
                  className="btn btn-link text-white" 
                  onClick={() => onSwitchMode('signup')}
                  disabled={loading}
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button 
                  className="btn btn-link text-white" 
                  onClick={() => onSwitchMode('login')}
                  disabled={loading}
                >
                  Login
                </button>
              </p>
            )}
            <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;