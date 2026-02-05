import axios from 'axios';

const superadminAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/superadmin',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

superadminAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('superadmin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

superadminAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('superadmin_token');
      if (!window.location.pathname.includes('/superadmin/login')) {
        window.location.href = '/superadmin/login';
      }
    }
    return Promise.reject(error);
  },
);

export default superadminAxios;
