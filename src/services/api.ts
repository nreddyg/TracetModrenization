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
          config.headers.set('Authorization', `Bearer 5_QWMcLSquf54L4pIsert6QAusZkzT8Y1_dHwa-gK1p5SIygiqozahAriAd0N6pagz5SEURRMRn3BgQod-oh55gBnU4XKMWXKQOGolN-U1QIr0EElCkPaVKgz1RqkaMBmenFjtl11COZMlAtwSAend3PjIcN5X8MJJWATI31uZpjz0T36BWNLY7dbwV49doLpZPmKF1p9qhietgeH5i0_KOPDQ4niMxgSK89Yp1g3EUvNJ0iXmtWZDCF7GJ6PyvaLnPgWlRZ1oo2F7aaLsaIipx2PPcPYgprB-2q2YHP5o1oUPuHmivh878sazBRVhsa`);
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
