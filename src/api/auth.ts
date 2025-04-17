import type { LoginResponse, UserRole, User } from '@/types/user'
import request from '@/utils/request'
import type { ResponseResult } from '@/types/api'
import axios from 'axios'

export const register = (data: FormData) => {
    return request.post<ResponseResult<any>>('/auth/register', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    })
}

/**
 * 用户登录
 * @param credentials 登录凭证
 * @returns Promise<LoginResponse>
 */
export const login = async (credentials: {
    username: string
    password: string
}): Promise<LoginResponse> => {
    try {
        // 发送登录请求到后端
        const response = await request.post<LoginResponse>('/auth/login', credentials);

        if (response.data && response.data.success) {
            // 成功返回数据，返回登录响应数据
            return response.data;
        } else {
            // 登录失败
            throw new Error('用户名或密码错误');
        }
    } catch (error: unknown) {
        // 处理 error 为 unknown 类型
        if (error instanceof Error) {
            // 如果 error 是 Error 实例
            throw new Error(error.message || '登录请求失败');
        } else {
            // 处理其他未知类型的 error
            throw new Error('登录请求失败，发生未知错误');
        }
    }
}

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
export const getUserInfo = async (token: string): Promise<User> => {
    try {
        // 请求后端获取用户信息
        const response = await request.get<ResponseResult<User>>('/user/list', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data; // 现在可以访问 response.data
    } catch (error) {
        throw new Error('无法获取用户信息');
    }
}


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
