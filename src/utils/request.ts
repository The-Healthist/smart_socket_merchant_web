import axios, {AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig} from 'axios';

const service: AxiosInstance = axios.create({
    timeout: 5000,
    baseURL: import.meta.env.DEV ? '/api' : '/api'
});

service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        if (config.headers)
            config.headers['Authorization'] = String(localStorage.getItem('token'))
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            Promise.reject();
        }
    },
    (error: AxiosError) => {
        console.log(error);
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
        }
        return Promise.reject(error);
    }
);

export default service;
