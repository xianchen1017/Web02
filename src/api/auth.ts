import type { LoginResponse, UserRole, User } from '@/types/user'
import request from '@/utils/request'
import type { ResponseResult } from '@/types/api'
import axios from 'axios'

export const register = (data: FormData) => {
    return request.post<ResponseResult<any>>('/auth/register', data, {
        // headers: {
        //     'Content-Type': 'multipart/form-data'
        // },
    })
}
// 假设你已经设置了 axios 实例
export const refreshToken = (refreshToken: string) => {
    return axios.post('/api/auth/refresh', { refreshToken })
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
};
/**
 * 用户登录
 * @param credentials 登录凭证
 * @returns Promise<LoginResponse>
 */
// @/api/auth.ts
// @/api/auth.ts
export const login = async (credentials: { username: string; password: string }): Promise<LoginResponse> => {
    try {
        const response = await axios.post('/auth/login', credentials);

        // 假设响应结构为 { success: true, data: { ... } }
        if (response.data.success) {
            return response.data; // 返回实际的 LoginResponse 数据
        } else {
            throw new Error('用户名或密码错误');
        }
    } catch (error) {
        throw new Error('登录请求失败');
    }
};


/**
 * 用户登出
 * @returns Promise<void>
 */
export const logout = async (): Promise<void> => {
    // 模拟登出延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    // 可以在这里添加清除本地token的逻辑
}

/**
 * 获取用户信息
 * @param token 用户token
 * @returns Promise<User> 返回完整的用户信息
 */
// @/api/auth.ts
export const getUserInfo = async (token: string): Promise<User> => {
    try {
        const response = await request.get<ResponseResult<User>>('/user/list', {
            // headers: {
            //     'Authorization': `Bearer ${token}`
            // }
        });

        return response.data;  // 直接返回 data 部分
    } catch (error) {
        throw new Error('无法获取用户信息');
    }
};



/**
 * 验证token有效性
 * @param token 用户token
 * @returns Promise<boolean>
 */
export const verifyToken = async (token: string): Promise<boolean> => {
    try {
        const userInfo = await getUserInfo(token);
        return !!userInfo; // 如果获取到了用户信息，token有效
    } catch {
        return false; // 如果获取用户信息失败，token无效
    }
}
