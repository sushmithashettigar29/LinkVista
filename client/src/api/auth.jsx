import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

// Get current user
const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  try {
    return user ? JSON.parse(user) : null;
  } catch (err) {
    console.error("Error parsing user from localStorage:", err);
    return null;
  }
};

// Get auth token
const getAuthToken = () => {
  return localStorage.getItem("token");
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  getAuthToken,
};
