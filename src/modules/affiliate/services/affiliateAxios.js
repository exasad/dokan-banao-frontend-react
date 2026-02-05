import axios from 'axios';

const affiliateAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/affiliate',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

affiliateAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('affiliate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

affiliateAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('affiliate_token');
      if (!window.location.pathname.includes('/affiliate/login')) {
        window.location.href = '/affiliate/login';
      }
    }
    return Promise.reject(error);
  },
);

export default affiliateAxios;
