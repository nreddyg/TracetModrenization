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
          config.headers.set('Authorization', `Bearer dghjgy9GT_ky59tqndispurbGhUxGYQmK5C1-4ifAUnwdSeG5K2MizIsfpZZEF0EUQEWUFCKNmg1MZ2KIn73dtP5ObkIWuRaGsCK6YbH-2pGBrZAd1bHvoZBj7gaOZGRQuLGDv0uOjd2ASeUHLLzqw-oHekZyCw8ZzWZ_vXjknmSRnEhlEM4GS7gjNuPgH3gO-gF3hdXRJcs_mIL-jnowf2crMtDIXaU8UBn3P0f9R6SrM91k1CfETuHDYfXsUPwC4USTlm-3qNIQox2r0YP0KgQaZbENQdAj7EOT11HAom-kTiloTIDs35A93MxXYky`);
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
