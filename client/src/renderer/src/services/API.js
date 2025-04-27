import axios from 'axios';

// Access the environment variable defined in your electron-vite config
// Make sure __API_URL__ was correctly stringified in the config!
const API_BASE_URL = __API_URL__;

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL, // Your API base URL from env variable
  timeout: 10000, // Optional: Set a timeout (e.g., 10 seconds)
  headers: {
    'Content-Type': 'application/json',
    //'Authorization': `Bearer ${yourAuthToken}`
    // You can add other default headers here if needed
    
  }
});

// Optional: Add request interceptors (e.g., for adding auth tokens dynamically)
apiClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('authToken'); // Example: Get token
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    console.log('Starting Request', config);
    return config;
  },
  (error) => {
    console.error('Request Error Interceptor', error);
    return Promise.reject(error);
  }
);

// Optional: Add response interceptors (e.g., for global error handling)
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    console.log('Response Received', response);
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    console.error('Response Error Interceptor', error.response || error.message);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls outside the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
      // You could add global error handling here, e.g., redirect to login on 401
      // if (error.response.status === 401) {
      //   // Handle unauthorized access
      // }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error('Request Error: No response received', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Axios Config Error:', error.message);
    }
    return Promise.reject(error); // Important: re-reject the error so consuming code can handle it
  }
);

export default apiClient;