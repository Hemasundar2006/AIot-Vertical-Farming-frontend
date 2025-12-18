import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'https://aiot-vertical-farming-backend.onrender.com/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('farm_user');
    const storedToken = localStorage.getItem('farm_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      // Set default auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { user, token, message } = response.data;

      setUser(user);
      localStorage.setItem('farm_user', JSON.stringify(user));
      localStorage.setItem('farm_token', token);
      
      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      toast.success(message || 'Welcome back!');
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      // Defaulting to "Farmer" role as per requirements. 
      // Could accept role as argument if UI supports it.
      const response = await axios.post(`${API_URL}/register`, { 
        name, 
        email, 
        password,
        role: "Farmer" 
      });
      
      const { user, token, message } = response.data;

      setUser(user);
      localStorage.setItem('farm_user', JSON.stringify(user));
      localStorage.setItem('farm_token', token);
      
      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      toast.success(message || 'Account created successfully!');
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('farm_user');
    localStorage.removeItem('farm_token');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
