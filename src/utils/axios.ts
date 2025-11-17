import axios from "axios";
import store from "@/store";
import { clearUser } from "@/store/slices/auth";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      // Clear user data if token is invalid or expired
      store.dispatch(clearUser());
    }
    return Promise.reject(error);
  }
);
