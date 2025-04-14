// src/store/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, logout, getUserInfo } from '@/api/auth'
import router from '@/router'
import { ElMessage } from 'element-plus'
import type { UserRole } from '@/types/user'

export const useUserStore = defineStore('user', () => {
    const token = ref(localStorage.getItem('token') || '')
    const id = ref(0)
    const username = ref('')
    const email = ref('')
    const avatar = ref('')
    const role = ref<UserRole>('user')
    const isInitialized = ref(false)
    const registerTime = ref('')
    const lastLoginTime = ref('')

    // 初始化用户信息
    const initUser = async () => {
        if (isInitialized.value || !token.value) return

        try {
            const userInfo = await getUserInfo(token.value)
            console.log('从后端接收到的用户信息:', userInfo)
            id.value = userInfo.id
            username.value = userInfo.username
            email.value = userInfo.email || ''
            avatar.value = userInfo.avatar || ''
            role.value = userInfo.role

            // 初始化时间信息
            const now = new Date().toISOString()
            if (!registerTime.value) registerTime.value = now
            lastLoginTime.value = now

            // 保存到localStorage
            localStorage.setItem('userInfo', JSON.stringify({
                id: userInfo.id,
                username: userInfo.username,
                email: userInfo.email,
                avatar: userInfo.avatar,
                role: userInfo.role
            }))
        } catch (error) {
            console.error('初始化用户信息失败:', error)
            clearUser()
        } finally {
            isInitialized.value = true
        }
    }

    // 登录方法
    const userLogin = async (credentials: { username: string; password: string }) => {
        try {
            const response = await login(credentials)  // 调用API进行登录
            token.value = response.token
            id.value = response.userInfo.id
            username.value = response.userInfo.username
            email.value = response.userInfo.email || ''
            avatar.value = response.userInfo.avatar || ''
            role.value = response.userInfo.role

            // 保存到localStorage
            localStorage.setItem('token', response.token)
            localStorage.setItem('userInfo', JSON.stringify(response.userInfo))

            // 更新时间
            const now = new Date().toISOString()
            registerTime.value = registerTime.value || now
            lastLoginTime.value = now

            // 获取跳转的路径，默认为 '/'
            const redirect = router.currentRoute.value.query.redirect || '/'
            await router.push(redirect as string)  // 跳转到原来的页面或主页

            return response
        } catch (error) {
            clearUser()
            throw error
        }
    }

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
        id.value = 0
        username.value = ''
        email.value = ''
        avatar.value = ''
        role.value = 'user'
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
    }

    // 设置用户信息
    const setUser = (userData: any) => {
        token.value = userData.token
        username.value = userData.username
        email.value = userData.email || ''
        avatar.value = userData.avatar || ''
        role.value = userData.role
        // 将用户数据存储到localStorage中
        localStorage.setItem('token', userData.token)
        localStorage.setItem('userInfo', JSON.stringify(userData))
    }

    // 检查是否认证
    const isAuthenticated = () => {
        return !!localStorage.getItem('token');  // 如果 token 存在，则用户已认证
    };
    // 检查角色权限
    const hasRole = (requiredRole: UserRole) => role.value === requiredRole

    return {
        token,
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
        initUser,
        isAuthenticated,
        hasRole,
        setUser  // 在返回的对象中添加setUser
    }
})