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
          config.headers.set('Authorization', `Bearer MnOx69_m3EzosXx1OcvRXjQ2i9Ej_q_YLR8CCsyI5y-oVmtY3RIhSP8M1C0UMeveRcfD5qEo2CpiinqGpzU5pJMeQkiGCSpD6Q7ib42HIwQ4kV6tDVS9ekh0szF9VOwWBcW35Twx4t6pQxhLFx8TVZmAOWypz7R7UkmsHn6m2TyTxtKiYCQEF7iL3TZqY05JJBa2yMzPyoAqkZG2pY71of74NEggeqcbbZByu6zr3c6hQ2SJaOJljl0J1iI0diOtsbQfcjMimTD5QwNLEs2o2Hu_iS34SPDELd-MwDTmGBHYoHRaBlelV2OJPAIR3n8J`);
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
