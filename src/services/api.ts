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
          config.headers.set('Authorization', `Bearer vWe3OMTk6DFUnXa3v-dVoisH8MfxBg_AjJiQdTb61VQGbnMQXPaAfR_Ji5p536dRRVUeq7yV1iRzNnBtT5cIdcmZzUQ_QLLpwJfGF-M9V72YE5qlJtWoE3G-I-AmsVoY27d5WSSdIEIIcKIad2HPG5zlpFteVPUc0PsVjMGyWDTb2sfgDijmbrhDFKKXU_MAnRVVNgigVgwtVDVy0-h1bHHIzayx9FcSs6Sa5jWYjy9xaSi8l7L9xBQvOc8ZaPb2_AQKW5Esux5luqC_TpQBxeOWOH5q9vpsbzhyuCLGE7XQcl5igu2MTAV9fco0pe3s`);
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
