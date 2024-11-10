import axios from "axios";
import Cookies from 'js-cookie'
// Define the base URL for the API
const baseUrl = "https://be-fkitshop.onrender.com";

const api = axios.create({
  baseURL: baseUrl, // Setting the baseURL configuration directly in axios.create
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to handle the request before sending
const handleBefore = (config) => {
//   // Retrieve the token from localStorage
//const token = localStorage.getItem("token")?.replace(/"/g, "");
  const token = Cookies.get("token" );
  
//   // Attach the token to the Authorization header if it exists
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  
  if (config.data instanceof FormData) {
    // Remove Content-Type to let the browser set it (with boundary for multipart/form-data)
    delete config.headers["Content-Type"];
  }
  
  return config;
};

// Use the interceptor to attach the Authorization header
api.interceptors.request.use(handleBefore, null);

export default api;
