import axios from 'axios';

const adminAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/admin',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

adminAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

adminAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default adminAxios;
