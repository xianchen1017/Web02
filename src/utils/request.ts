// D:\JAVA SHIT\web02\src\utils\request.ts
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ResponseResult } from '@/types/api'
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/user';
import router from '@/router'

const service = axios.create({
    baseURL: '/api', // 统一后端地址
    timeout: 5000
});

// 请求拦截器
service.interceptors.request.use(config => {
    const userStore = useUserStore();
    const token = userStore.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => {
        // 直接返回后端原始数据结构
        return response.data;
    },
    error => {
        ElMessage.error(error.response?.data?.message || '请求失败');
        return Promise.reject(error);
    }
);

// 请求方法封装
const request = {
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return service.get(url, config);
    },
    post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return service.post(url, data, config);
    },
    put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return service.put(url, data, config);
    },
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return service.delete(url, config);
    }
};

export default request;