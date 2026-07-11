import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Register
export const registerUser = (userData) => {
  return API.post("/auth/register", userData);
};

// Login
export const loginUser = (loginData) => {
  return API.post("/auth/login", loginData);
};