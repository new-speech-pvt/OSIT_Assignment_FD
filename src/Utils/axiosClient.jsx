import axios from "axios";
import { getUserFromLocal } from "./auth";
const user = getUserFromLocal("authUser");
console.log("user token", user?.token);

export const axiosClient = axios.create({
  baseURL: "http://localhost:3001/",
});

axiosClient.interceptors.request.use(
  function (config) {
    config.headers.Authorization = `Bearer ${user?.token}`;
    return config;
  },
  function (error) {
    Promise.reject(error);
  },
  { synchronous: true, runWhen: () => console.log("user token") }
);
