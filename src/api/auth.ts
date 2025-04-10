// src/api/auth.ts
import type { LoginResponse, UserRole, User } from '@/types/user'
import { mockUserList } from '@/mock/users'

// 模拟token前缀
const MOCK_TOKEN_PREFIX = 'mock-token-'

/**
 * 用户登录
 * @param credentials 登录凭证
 * @returns Promise<LoginResponse>
 */
export const login = async (credentials: {
    username: string
    password: string
}): Promise<LoginResponse> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 在模拟用户列表中查找用户
    const user = mockUserList.find(
        u => u.username === credentials.username &&
            u.password === credentials.password
    )

    if (!user) {
        throw new Error('用户名或密码错误')
    }

    // 确保返回的数据符合LoginResponse类型
    return {
        token: `${MOCK_TOKEN_PREFIX}${user.id}`,
        userInfo: {
            id: user.id,
            username: user.username,
            role: user.role as UserRole,
            avatar: user.avatar || '', // 提供默认值
            email: user.email || ''    // 提供默认值
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
    // 验证token格式
    if (!token.startsWith(MOCK_TOKEN_PREFIX)) {
        throw new Error('无效的token格式')
    }

    // 从token中提取用户ID
    const userId = parseInt(token.replace(MOCK_TOKEN_PREFIX, ''))

    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 300))

    // 查找用户
    const user = mockUserList.find(u => u.id === userId)
    if (!user) {
        throw new Error('用户不存在')
    }

    // 返回完整的用户信息
    return {
        id: user.id,
        username: user.username,
        password: user.password, // 实际项目中不应该返回密码
        email: user.email || '',
        phone: user.phone || '',
        role: user.role as UserRole,
        status: user.status || 1,
        avatar: user.avatar || '',
        createTime: user.createTime || new Date().toISOString(),
        updateTime: user.updateTime || new Date().toISOString()
    }
}

/**
 * 验证token有效性
 * @param token 用户token
 * @returns Promise<boolean>
 */
export const verifyToken = async (token: string): Promise<boolean> => {
    try {
        await getUserInfo(token)
        return true
    } catch {
        return false
    }
}