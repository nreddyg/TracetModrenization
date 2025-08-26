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
          config.headers.set('Authorization', `Bearer Fz3IrXiT4Co1wXL-xaPBykm0exZFUVsRxwkuKpV1C4w4rxNDqUXkmYYfqJc8WECoBSuuAsdCOnyU9orKXmlNL1nVfOLYhnxpND-HDAGLuvU7lqvC1sPw_g_JU3Ma7RcPj9KyJ1doQbupaKvI1DevTzlk_pz6eMyfZocwb_D1aYNbZHPmC5qIw1GYNGTtPwEXE6Li5c9gRBHQDaYqZvxidc0SThpiLYkFCsLMxP1eKfAENis8L1vrPWFcmSdSmFeCJrtAIPSuzHoNIZ86zJGaupcGdMQHUHUvBORjiUSLMGPDKoqJb8d99cVXuyRg6MSM`);
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
