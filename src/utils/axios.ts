// src/utils/axios.ts
import axios from 'axios';
import { useUserStore } from '@/store/user';
import router from '@/router';
import {ElMessage} from "element-plus";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,  // 确保跨域请求携带凭证
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
axiosInstance.interceptors.request.use((config) => {
    const userStore = useUserStore();
    // if (userStore.token) {
    //     config.headers.Authorization = `Bearer ${userStore.token}`;
    // }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 响应拦截器
axiosInstance.interceptors.response.use(response => {
    return response;
}, error => {
    const userStore = useUserStore();
    if (error.response?.status === 401) {
        ElMessage.warning('会话已过期，请重新登录');
        // userStore.logout();
        router.push('/login');
    }
    return Promise.reject(error);
});

export default axiosInstance;