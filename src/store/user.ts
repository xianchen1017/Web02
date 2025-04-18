import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, logout, getUserInfo, refreshToken as refreshTokenApi } from '@/api/auth'
import router from '@/router'
import { ElMessage } from 'element-plus'
import type { UserRole, LoginResponse } from '@/types/user'

export const useUserStore = defineStore('user', () => {
    const token = ref(localStorage.getItem('token') || '')
    const refreshToken = ref(localStorage.getItem('refreshToken') || '')  // 保持响应式存储 refreshToken
    const id = ref(0)
    const username = ref('')
    const email = ref('')
    const avatar = ref('')
    const role = ref<UserRole>('user')
    const isInitialized = ref(false)
    const registerTime = ref('')
    const lastLoginTime = ref('')

    // 登录方法
    const userLogin = async (credentials: { username: string; password: string }) => {
        try {
            // 使用 login 函数，并确保它返回 LoginResponse 类型
            const response: LoginResponse = await login(credentials);

            // 使用返回的 response 中的字段
            token.value = response.token;
            refreshToken.value = response.refreshToken;
            id.value = response.userInfo.id;
            username.value = response.userInfo.username;
            email.value = response.userInfo.email || '';
            avatar.value = response.userInfo.avatar || '';
            role.value = response.userInfo.role as UserRole;

            // 保存到 localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('userInfo', JSON.stringify(response.userInfo));

            // 更新时间
            const now = new Date().toISOString();
            registerTime.value = registerTime.value || now;
            lastLoginTime.value = now;

            // 获取跳转路径
            const redirect = router.currentRoute.value.query.redirect || '/';
            await router.push(redirect as string);

            return response;
        } catch (error) {
            clearUser();
            throw error;
        }
    };


    // 刷新 token
    const refreshUserToken = async () => {
        try {
            // 调用刷新 token 的 API
            const response = await refreshTokenApi(refreshToken.value); // 使用 `refreshTokenApi` 进行刷新
            token.value = response.token;
            refreshToken.value = response.refreshToken;

            // 更新 localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('refreshToken', response.refreshToken);

            return true;
        } catch (error) {
            ElMessage.error('刷新令牌失败');
            console.error('刷新令牌失败:', error);
            logout();  // 退出登录
            return false;
        }
    };

    // 登出方法
    const userLogout = async () => {
        try {
            await logout()
            clearUser()
            await router.push('/login')
        } catch (error) {
            ElMessage.error('退出登录失败')
            console.error('退出登录失败:', error)
        }
    }

    // 清空用户信息
    const clearUser = () => {
        token.value = ''
        refreshToken.value = ''
        id.value = 0
        username.value = ''
        email.value = ''
        avatar.value = ''
        role.value = 'user'
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userInfo')
    }

    // 设置用户信息
    const setUser = (userData: any) => {
        token.value = userData.token;
        username.value = userData.username;
        email.value = userData.email || '';
        avatar.value = userData.avatar || '';
        role.value = userData.role;
        // 将用户数据存储到localStorage中
        localStorage.setItem('token', userData.token);
        localStorage.setItem('refreshToken', userData.refreshToken);
        localStorage.setItem('userInfo', JSON.stringify(userData));
    };

    // 用于设置 token
    const setToken = (newToken: string) => {
        token.value = newToken;
    };

    // 用于设置 refreshToken
    const setRefreshToken = (newRefreshToken: string) => {
        refreshToken.value = newRefreshToken;
    };

    // 登出
    const logout = () => {
        token.value = '';
        refreshToken.value = '';
        // 清除其他用户数据
    };

    // 检查是否认证
    const isAuthenticated = () => {
        return !!localStorage.getItem('token');  // 如果 token 存在，则用户已认证
    };

    // 检查角色权限
    const hasRole = (requiredRole: UserRole) => role.value === requiredRole

    const checkTokenExpiration = () => {
        if (!token.value) return false;  // 使用 token.value 来获取 token 的值
        try {
            const payload = JSON.parse(atob(token.value.split('.')[1]));  // 使用 token.value
            return payload.exp * 1000 > Date.now();
        } catch (e) {
            return false;
        }
    };

    return {
        token,
        refreshToken, // 返回 refreshToken
        id,
        username,
        email,
        avatar,
        role,
        isInitialized,
        registerTime,
        lastLoginTime,
        login: userLogin,
        logout: userLogout,
        isAuthenticated,
        hasRole,
        setUser,  // 在返回的对象中添加setUser
        setToken, // 返回 setToken
        setRefreshToken, // 返回 setRefreshToken
        refreshUserToken  // 返回改名后的方法
    }
})
