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
          config.headers.set('Authorization', `Bearer SLRE_zW0i-pnUIyUouAV-EclV6n-PJAv3PS-_7JlCQlUcX0XfyBM9jFgYI3-U9D91AdhDE51YXno3rjZgVLS-RNN9c_NtGBTT1kFNNIi6WckCghrM_yZcwvRJKtAwQYXt-yuiFAKCbcwLYz43XCAA2BdUoX8jmd_QA7Hf9OxSeHIpnXbvSl9GyjQM6zH7DwUggkNwih_hgv-VNYNfmFYvwUD7-a5OiUuxSYngd5xVLPMEKu6V3PwjO7GkptNsvrRXIwWZuDwRtCq1W7PK0RGrSBgUSh8GfjdXho-Qp29ay5ilZWgBeWFovoeGkZ9JxvL`);
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
