import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (!savedUser || savedUser === 'undefined' || savedUser === 'null') {
        return null;
      }
      return JSON.parse(savedUser);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      // Clear invalid data
      localStorage.removeItem('user');
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clean up invalid localStorage data on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser === 'undefined' || savedUser === 'null') {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
    } catch (error) {
      console.error('Error cleaning localStorage:', error);
    }
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Backend returns user data in data.data, not data.user
        const userData = data.data || data.user;
        
        if (!userData) {
          console.error('No user data in login response:', data);
          setError('Login successful but user data not received');
          setLoading(false);
          return false;
        }

        // Clear stale cached data from localStorage on fresh login
        // This ensures fresh data is fetched from the database
        // Note: Database data persists - this only clears the cache
        localStorage.removeItem('products');
        localStorage.removeItem('transactions');

        // Save user authentication data
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
        setLoading(false);
        return true;
      } else {
        setError(data.message || 'Login failed');
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check if the server is running.');
      setLoading(false);
      return false;
    }
  };

  const register = async (username, firstName, lastName, contactNumber, email, password, profileImage, shopName, fullAddress, pincode) => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare request body - only include profileImage if it exists and is not empty
      const requestBody = {
        username,
        firstName,
        lastName,
        contactNumber,
        email,
        password,
        shopName: shopName || '',
        fullAddress: fullAddress || '',
        pincode: pincode || '',
      };
      
      // Only include profileImage if it's a valid non-empty string
      if (profileImage && profileImage.trim() !== '') {
        requestBody.profileImage = profileImage;
      }

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Check if response is ok before parsing
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Server error: ${response.status}` }));
        setError(errorData.message || `Registration failed with status ${response.status}`);
        setLoading(false);
        return false;
      }

      const data = await response.json();

      if (data.success) {
        // Backend returns user data in data.data, not data.user
        const userData = data.data || data.user;
        
        if (!userData) {
          console.error('No user data in response:', data);
          setError('Registration successful but user data not received');
          setLoading(false);
          return false;
        }

        console.log('Registration successful, user data:', {
          ...userData,
          profileImage: userData.profileImage ? `present (${userData.profileImage.substring(0, 50)}...)` : 'missing'
        });
        
        // Clear stale cached data from localStorage on fresh registration
        // This ensures fresh data is fetched from the database
        // Note: Database data persists - this only clears the cache
        localStorage.removeItem('products');
        localStorage.removeItem('transactions');
        
        // Save user authentication data
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
        setLoading(false);
        return true;
      } else {
        setError(data.message || 'Registration failed');
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Better error messages
      if (error.message && error.message.includes('Failed to fetch')) {
        setError('Cannot connect to server. Please make sure the backend server is running on port 5000.');
      } else if (error.message && error.message.includes('JSON')) {
        setError('Invalid response from server. Please try again.');
      } else {
        setError(error.message || 'Network error. Please check if the server is running.');
      }
      
      setLoading(false);
      return false;
    }
  };

  const resetPassword = async (username, currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, currentPassword, newPassword }),
      });

      // Check if response is ok before parsing
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `Server responded with status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON, use default message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.success) {
        setLoading(false);
        return true;
      } else {
        setError(data.message || 'Password reset failed');
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Reset password error:', error);
      
      // Better error messages based on error type
      const errorMessage = error.message || error.toString() || '';
      
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('ERR_CONNECTION_REFUSED') || errorMessage.includes('NetworkError')) {
        setError('Cannot connect to server. Please make sure the backend server is running on port 5000.');
      } else if (errorMessage.includes('NetworkError') || errorMessage.includes('network')) {
        setError('Network error. Please check your internet connection.');
      } else if (errorMessage.includes('status:')) {
        // Server responded but with an error status
        setError(errorMessage.replace('Server responded with status: ', 'Server error: '));
      } else {
        setError(errorMessage || 'An error occurred while resetting password. Please try again.');
      }
      
      setLoading(false);
      return false;
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Include current username to identify the user
      const requestBody = {
        ...profileData,
        userId: user?.username || user?.id, // Use username to identify user
      };

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Server error: ${response.status}` }));
        setError(errorData.message || `Update failed with status ${response.status}`);
        setLoading(false);
        return false;
      }

      const data = await response.json();

      if (data.success) {
        const userData = data.data || data.user;
        
        if (!userData) {
          console.error('No user data in update response:', data);
          setError('Profile updated but user data not received');
          setLoading(false);
          return false;
        }

        // Update user state and localStorage
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setLoading(false);
        return true;
      } else {
        setError(data.message || 'Failed to update profile');
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Update profile error:', error);
      
      if (error.message && error.message.includes('Failed to fetch')) {
        setError('Cannot connect to server. Please make sure the backend server is running on port 5000.');
      } else {
        setError(error.message || 'Network error. Please check if the server is running.');
      }
      
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      register,
      resetPassword,
      updateProfile,
      logout, 
      loading, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

