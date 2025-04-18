// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from "@/store/user"
import { ElMessage } from "element-plus"
import { UserRole } from "@/types/user"


const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'), // 主布局组件
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/views/Home.vue')
        },
        // 用户管理路由
        {
          path: '/user-management',
          name: 'UserManagement',
          component: () => import('@/views/UserManagement.vue'),
          meta: { requiresAuth: true, role: 'admin' } // 添加角色权限控制
        }
      ]
    },
    // 认证相关路由
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: () => import('@/views/ResetPassword.vue'),
      meta: { guestOnly: true }
    },
    // 404页面处理
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue')
    }
  ]
})

// 增强的路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 类型安全的状态检查
  const isAuthenticated = userStore.isAuthenticated()
  const userRole = userStore.role as UserRole // 显式类型声明
  console.log('用户认证状态:', userStore.isAuthenticated());
  // 1. 已登录用户访问guestOnly页面
  if (to.meta.guestOnly && isAuthenticated) {
    return next('/')
  }

  // 2. 未登录用户访问需要认证的页面
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }

  // 3. 角色权限检查（类型安全版本）
  if (to.meta.role) {
    const requiredRole = to.meta.role as UserRole
    if (!userStore.hasRole(requiredRole)) {
      ElMessage.warning('权限不足')
      return next(from.path || '/')
    }
  }

  next()
})

export default router