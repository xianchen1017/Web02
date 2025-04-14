// src/types/user.ts

// 用户角色类型
export type UserRole = 'admin' | 'editor' | 'user' | 'guest'

// 用户状态枚举
export enum UserStatus {
    DISABLED = 0,
    ENABLED = 1
}

// 基础用户类型
export interface User {
    id: number
    username: string
    password?: string
    email: string
    phone: string
    role: UserRole
    status: UserStatus
    avatar?: string
    createTime?: string
    updateTime?: string
    lastLoginTime?: string
}

// 登录响应类型
export interface LoginResponse {
    token: string
    userInfo: Pick<User, 'id' | 'username' | 'role' | 'avatar' | 'email'>
    success: boolean; // 登录成功与否
    message: string; // 提示信息
    data: any; // 返回的数据（如果有）
}

// 分页查询参数
export interface PaginationParams {
    page: number
    size: number
}

// 用户查询参数
export interface UserQueryParams extends PaginationParams {
    keyword?: string
    username?: string
    email?: string
    phone?: string
    role?: UserRole
    status?: UserStatus
}

// 列表响应类型
export interface ListResult<T> {
    total: number
    list: T[]
    page?: number
    size?: number
}

// 用户列表响应
export interface UserListResponse extends ListResult<User> {}

// 表单数据类型 (创建/编辑)
export interface UserFormData extends Omit<User, 'id' | 'createTime' | 'updateTime'> {
    confirmPassword?: string
}

// 通用响应类型
export interface BaseResponse<T = any> {
    code: number
    data: T
    message: string
    success: boolean
}

// 带分页的响应类型
export interface PaginatedResponse<T> extends BaseResponse<ListResult<T>> {}