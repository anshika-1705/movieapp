import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: true, 
        user: action.payload.user,
        token: action.payload.token,
        error: null 
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: false, 
        user: null,
        token: null,
        error: action.payload 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        isAuthenticated: false, 
        user: null, 
        token: null,
        error: null 
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token,
          user: JSON.parse(user)
        }
      });
    }
  }, []);

  // Listen for auth changes (from modal)
  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            token,
            user: JSON.parse(user)
          }
        });
      }
    };

    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const data = await authAPI.login(email, password);
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { token: data.token, user: data.user }
        });
        return { success: true };
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: data.message });
        return { success: false, message: data.message };
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Network error' });
      return { success: false, message: 'Network error' };
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const data = await authAPI.register(userData);
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { token: data.token, user: data.user }
        });
        return { success: true };
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: data.message });
        return { success: false, message: data.message };
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Network error' });
      return { success: false, message: 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};