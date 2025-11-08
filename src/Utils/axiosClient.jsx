// Utils/axiosClient.js
import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "https://osit-assignment-bd.onrender.com",
});

// export const axiosClient = axios.create({
//   baseURL:"http://192.168.29.61:3001"
// });
// export const axiosClient = axios.create({
//   baseURL:"http://localhost:3001"
// });

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