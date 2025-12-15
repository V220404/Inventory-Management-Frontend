/**
 * API utility to make authenticated requests
 * Automatically includes username in headers
 */
const API_BASE_URL = 'http://localhost:5000/api';

export const apiRequest = async (endpoint, options = {}) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const username = user?.username;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add username to headers for authentication
  if (username) {
    defaultHeaders['x-username'] = username;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return response;
};

export default apiRequest;

