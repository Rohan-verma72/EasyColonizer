import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

// Add a request interceptor to include tenant slug
api.interceptors.request.use(
  (config) => {
    // Detect slug from hostname
    const hostname = window.location.hostname;
    let slug = "default";
    
    if (!hostname.includes("localhost") && !hostname.match(/\d+\.\d+\.\d+\.\d+/)) {
      const parts = hostname.split(".");
      if (parts.length >= 3) {
        slug = parts[0];
      }
    }
    
    config.headers["x-tenant-slug"] = slug;
    
    // Add auth token if exists
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
