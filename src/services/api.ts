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
          config.headers.set('Authorization', `Bearer F85E-P20Rl2W7qXwDMM33KMbBeTAa2rrOEq5lUdN9pUioi2VPNzRY6779jjSAdyE6rtvQsP0heoO6zTfDVaNe8nR4qEmtF9TbfHlDEsKJIopgcc7RoysL8oNlizGZaSPbEO11fD9vTrjL9p6OrVGA_7tNBnaV8sTzGHtY8CRNo5hNS1V6a-GjBKk7kh16n7nqCptj7V1jv4pbQ4m5_BB9jiSrfN0dCWg5wsut71sQptMQemRCAcSV-vxwkHdxZpB3IXsrRm-sa_SIoMtiJ70tyqPdUCzP9uJOnLHN2t8JQiYObvAX2-Da5RD9usgaZk6`);
                    // config.headers.set('Authorization', `Bearer u-kq9EB2VKBazddgPYxRyzR_fGoNda-Wmx7JXQKcDQFBubHHfPQzR5fIo1EhcKvYYY0JCEUH-fTrYeFmKmNMCt0zITYbJ2iJDk3XkV_Ce1qn6gJsC7XNWVYCPxl8zrUa5qBmn5iQH0pJ4C-ygplI3WHA8jiNj_UVjiF58dMq-Bppa23Xgf31m51IHih9c0Ihhk45Efiy-NCqsk_i_m34y8X-o0CKn9BtljhHjB2qcW11zl8Wb5naK33N9ThTbRhnHXl9iuLC-cdbBg02U4PvAmlXVX2UpaAVG_YC1ZiAmc7CEFvzqSrXb-79UqAN8Puy`);
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
