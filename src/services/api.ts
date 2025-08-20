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
          config.headers.set('Authorization', `Bearer lkPk0y6dminsVCCHuVyPLZYdTtg4lfTFz-l52mOaBDthsCXsncmHYtlmiYgB_dEN48zXB0I6if4hjcAqRYIee5TgpZnUcD_aU6fnmCEN1JNHOpIu9ja2G9a_QlgDqJsceUcNe3aPycTi5GdvEVp0kzxAXEF1dyQLrRVgF-TJD86GQbHLVUKBxD0wCfTmNX0qUkmj8Nk6KZGvSdKLfh5GQae6qiVhbjKBBvNuQsAq06bQ28_tsEfWZK4kkTzFxUvAwnFBt23KC94HTxrVV7RXQYi6mqzPjyc8w-Zkw3MuGui6JK6yY-IuhdxuIlCnAxwL`);
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
