import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000' || 'http://127.0.0.1:8000';
const BACKEND_CHECK_TIMEOUT = 3000;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use((config) => config);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('⚠️ Unauthorized access');
    }
    return Promise.reject(error);
  }
);

const realAuthService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });

      const data = response.data;
      const conf = (data.confirmation || "").trim().toLowerCase();

      if (conf === "email doesn't exist") {
        throw new Error("Email doesn't exist");
      }

      if (conf === "password incorrect") {
        throw new Error("Password is incorrect");
      }

      if (conf === "backend error") {
        throw new Error("Server is busy, try again later");
      }

      if (conf === "login successful" && data.token) {
        localStorage.setItem('token', data.token);
        return { token: data.token };
      }

      throw new Error("Unknown login response");

    } catch (error) {
      const conf = error.response?.data?.confirmation;

      if (conf === "email doesn't exist") {
        throw new Error("Email doesn't exist");
      }
      if (conf === "password is incorrect") throw new Error("Password is incorrect");
      if (conf === "backend error") throw new Error("Server is busy, try again later");

      throw new Error(error.message || "Login failed");
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/registration', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        fullname: userData.fullname,
      });

      const data = response.data;
      
      // Debug: Log response
      console.log('🔍 Registration response:', JSON.stringify(data));
      console.log('🔍 Confirmation value:', data.confirmation);

      if (data.confirmation === 'register successful') {
        return { success: true };
      }

      // Handle error cases
      if (data.confirmation === 'email already registered') {
        throw new Error('Email already exists');
      }
      
      if (data.confirmation === 'username already taken') {
        throw new Error('Username already taken');
      }

      if (data.confirmation === 'backend error') {
        throw new Error('Server is busy, try again later');
      }

      throw new Error('Server is busy, try again later');
    } catch (error) {
      const conf = error.response?.data?.confirmation;
      if (conf === 'email already registered') throw new Error('Email already exists');
      if (conf === 'backend error') throw new Error('Server is busy, try again later');

      throw new Error('Server is busy, try again later');
    }
  },
};

let isBackendAvailable = null;
let backendCheckPromise = null;

const checkBackendAvailability = async () => {
  if (backendCheckPromise) return backendCheckPromise;

  backendCheckPromise = (async () => {
    try {
      const endpoints = [`${API_BASE_URL}/docs`, API_BASE_URL];

      for (const endpoint of endpoints) {
        try {
          const response = await axios.get(endpoint, {
            timeout: BACKEND_CHECK_TIMEOUT,
            validateStatus: (status) => status < 500,
          });

          if (response.status >= 200 && response.status < 500) {
            isBackendAvailable = true;
            return true;
          }
        } catch {
          continue;
        }
      }

      throw new Error('All endpoints failed');
    } catch {
      isBackendAvailable = false;
      return false;
    }
  })();

  return backendCheckPromise;
};

checkBackendAvailability();

export const authService = {
  login: async (credentials) => {
    if (isBackendAvailable === null) await checkBackendAvailability();
    if (!isBackendAvailable) throw new Error('Backend unavailable');
    return await realAuthService.login(credentials);
  },

  register: async (userData) => {
    if (isBackendAvailable === null) await checkBackendAvailability();
    if (!isBackendAvailable) throw new Error('Backend unavailable');
    return await realAuthService.register(userData);
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => !!localStorage.getItem('token'),

  recheckBackend: async () => {
    isBackendAvailable = null;
    backendCheckPromise = null;
    return await checkBackendAvailability();
  },

  getBackendStatus: () => ({
    isAvailable: isBackendAvailable,
    apiUrl: API_BASE_URL,
  }),
};

export default api;