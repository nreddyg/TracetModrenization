// services/api.ts
import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from 'axios';

const api = axios.create({
  baseURL: "http://10.20.1.34:8054",
  // timeout: 10000,
    headers: {
    'Content-Type': 'application/json'
  }

});

// Extend config type to include our custom noAuth flag
interface CustomAxiosConfig extends InternalAxiosRequestConfig {
  noAuth?: boolean;
}

api.interceptors.request.use(
  (config: CustomAxiosConfig): InternalAxiosRequestConfig => {
    if (!config.noAuth) {
      const token = localStorage.getItem('Token');
      // if (token) {
        // Axios v1+ headers is an instance of AxiosHeaders; use set method
        if (config.headers && typeof config.headers.set === 'function') {
          config.headers.set('Authorization', `Bearer YguU9opI5lJYxAmAqqSC4aSePtwJXdQrmWyjKGwlNzJdJROIHzWvxE-SDDWemUs5grTb5yxIQ_DNysaUm30w7Tkg88BHxCd6WE8WXgaL7ZNd2gMMgXo07zpSLuxIZgvmThGG3TOo_ZR9wAeZJUuUNeizdknwCGGJ-vtn0nY1EXo3xi2nPjfTShxHCp6cq8PoL_uVKkUaVpGj0vrduolXa-HYRACY-TR13EnijM-m8TD-ver60cdIoTMIKPZLmokg6U2r_eeF5-h4mclaWR53D0C1R9ME9N9hmO2nUD7E3hglDBnjVNxeMtMc7HmUMmng`);
        // }
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      alert('Unauthorized - Please log in again.');
    }
    return Promise.reject(error);
  }
);

export default api;
