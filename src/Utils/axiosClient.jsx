// Utils/axiosClient.js
import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "https://osit-assignment-bd.onrender.com",
});

// Remove the module-level user declaration
// Add request interceptor that gets fresh token for each request
axiosClient.interceptors.request.use(
  function (config) {
    // Get fresh user data from localStorage for each request
    const user = JSON.parse(localStorage.getItem("authUser"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);