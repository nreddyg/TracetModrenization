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
          config.headers.set('Authorization', `Bearer plr_7GKdHPnStxg3zOdBYuYxPmOLGVyFA4CrT51I2dmaaTT2qkxhy3eOm6ReRLXPBEbSwhz-H2NQ2P9a7c76rEa83Po-d4SFq2a47KopCB6_8JuapYxpa5Jwd292OrvS-bf89qXoS5Zauvx4zXTvU01Y3xhCmwvPqhfG9cy3m2-RgkGSkZK07oD8biT6JKSSSy7ISPUEuFD8IcArlyX7DJ1DCv1KImbIpber0ofQcBywTTtgUGPp0zFmcMhp7DqkOLmaonxIu1AF79XtV3ZSfldkifZDni5NtvYHVik6PFfC5ZH8KYMkE7BTCEAy7zOl`);
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
