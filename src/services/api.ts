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
          config.headers.set('Authorization', `Bearer c0nGzJzF6ZFf-CCzAvkq75cKvre_Xi6Z2tdCZB7reO692UGGI3x6JUIUTfXyYbiGR7Ag6u2ir71nu95Y4LcCWdbAI3xFklBc0aFmuXblnqWRVYEYwvQKn5A-a5U9tuRbvFtGEYYzHlvTUhI24j3G_w6Wr6TEZs3MdxeTXXET8rwFgmvtZwIldgHtVcUV5XJ9Bc16-9baMmFWTYTmMMMmX1rAsw4V_5BZJBn-96v8ivGpXb-m2iYRzmlcghdqBLcm5l_k70GxL0eDa0UdQQ3m--EFtsivxMirYkFE_PVqAnuxTL2rlXDy-i1vakKnPUwN`);
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
