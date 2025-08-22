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
          config.headers.set('Authorization', `Bearer 3K8myMD_rEkS2IEdL2oj-J6AbKlRQfs59IrIIcLXAkOO3WHrXfsi-ye_vP48ozPz0HYViUeqUQy3Ptey4lbCirr4_tzBrFj58p2Ec6MYIZF4acOeFXnHci6f9DO7lxJjj2Q_CsCdWUGghv5vTrrmSXpC28_m6c4-6PBP54rOHWLBd07L21-jcYQginYJdFzvkt54dcqjXxEnyfR7zfDibKSsDj1B2l6uq6LpdUajVpBpvgiA94zIj55yETm4f36zVSOrI0M63T3A4PiwiypYJosHqUk-SNgnngCdKju0cBljI5TT1lXLJImtH4E55teh`);
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
