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
          config.headers.set('Authorization', `Bearer ivfMGURu0ZUMBzQdXk1eoN6dSP5U_BcUO7Zuk7jDGylMyWk8X7glFkkHb5_c8kMPhRXvLcnOZSQ4vNiwIZdNUpGeZ6xBNoxmwYrURzCXJJKXUnAa2d0UsZuMgcQUP9Y9YQ8K-bmzlZ4JBNwRFxTfDmaeqfeV6ap44ZDP5ssZpnoAlka1jTcaFhcXaHOS8oJCIsEnOn_NVIgb2duwk5xYSrJKj4oJWyHizQ9RDYhLriEPvcot6PoPw7Q9HyoKxxQuE0oTcCQ-dkQuMm4aFCOx08OZvCkxfG_HJqBu47Ren2e-RaEUmO5nsf8Ral5OqT9H`);
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
