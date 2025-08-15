import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Tasks API calls
export const tasksAPI = {
  getAll: (groupId) => api.get(`/tasks${groupId ? `?groupId=${groupId}` : ''}`),
  get: (id) => api.get(`/tasks/${id}`),
  create: (taskData) => api.post('/tasks', taskData),
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  delete: (id) => api.delete(`/tasks/${id}`),
};

// Enhanced update function with retry logic
export const updateWithRetry = async (taskId, data, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await tasksAPI.update(taskId, data);
      return response;
    } catch (error) {
      if (error.response?.status === 409 && i < maxRetries - 1) {
        // Get the latest version and retry
        console.log(`Retry ${i + 1}/${maxRetries} for task ${taskId}`);
        const latestTask = await tasksAPI.get(taskId);
        data.version = latestTask.data.version;
        continue;
      }
      throw error;
    }
  }
};

// Actions API calls
export const actionsAPI = {
  getAll: (groupId) => api.get(`/actions${groupId ? `?groupId=${groupId}` : ''}`),
};

// Groups API calls
export const groupsAPI = {
  create: (groupData) => api.post('/groups', groupData),
  getMyGroups: () => api.get('/groups/my'),
  join: (token) => api.post('/groups/join', { token }),
  leave: (groupId) => {
    const url = `/groups/${groupId}`;
    console.log('Leaving group, full URL:', api.defaults.baseURL + url);
    return api.delete(url);
  },
};

// Users API calls
export const usersAPI = {
  getAll: () => api.get('/users'),
};

export default {
  authAPI,
  tasksAPI,
  actionsAPI,
  groupsAPI,
  usersAPI,
  updateWithRetry
}; 