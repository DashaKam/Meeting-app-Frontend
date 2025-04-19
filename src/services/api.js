import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Auth header set');
  } else {
    delete api.defaults.headers.common['Authorization'];
    console.log('Auth header removed');
  }
};

export const loginUser = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  try {
    const response = await api.post(
      API_ENDPOINTS.LOGIN,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data; // { access_token, refresh_token }
  } catch (error) {
    console.error('API Service: Login failed:', error.response ? error.response.data : error.message);
    throw error; // Re-throw to be caught by the caller
  }
};

export const registerUser = async (name, username, email, password) => {
  try {
    const response = await api.post(API_ENDPOINTS.REGISTER, { name, username, email, password });
    return response.data; // { access_token, refresh_token }
  } catch (error) {
    console.error('API Service: Registration failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const refreshToken = async (refresh_token) => {
  try {
    const response = await api.post(API_ENDPOINTS.REFRESH, { refresh_token });
    return response.data; // { access_token }
  } catch (error) {
    console.error('API Service: Token refresh failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.PROFILE);
    return response.data; // User data object
  } catch (error) {
    console.error('API Service: Error fetching user profile:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchUsers = async (filters = {}) => {
  const { min_age, max_age, gender, interests, verified, skip = 0, limit = 10 } = filters;

  const params = new URLSearchParams();

  // Add parameters only if they are provided and valid
  if (min_age !== undefined && min_age !== null) params.append('min_age', String(min_age));
  if (max_age !== undefined && max_age !== null) params.append('max_age', String(max_age));
  if (gender) params.append('gender', gender);
  if (verified !== undefined && verified !== null) params.append('verified', String(verified));
  if (skip !== undefined && skip !== null) params.append('skip', String(skip));
  if (limit !== undefined && limit !== null) params.append('limit', String(limit));

  if (interests && Array.isArray(interests) && interests.length > 0) {
    interests.forEach(interest => params.append('interests', interest));
  }

  console.log(`Fetching users with params:`, filters); // Optional: for debugging

  try {
    const response = await api.get(API_ENDPOINTS.USERS, { params });
    return response.data;
  } catch (error) {
    console.error('API Service: Error fetching users:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export default api;
