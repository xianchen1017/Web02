// src/types/api.ts
export interface LoginParams {
    username: string
    password: string
}

export interface LoginResult {
    token: string
    userInfo: {
        username: string
        avatar: string
    }
}

// src/types/api.ts

/** 基础响应结构 */
export interface ResponseResult<T = any> {
    code: number;
    message: string;
    data: T;
    timestamp?: number;
}

/** 分页响应结构 */
export interface PageResult<T> {
    list: T[];
    total: number;
    pageNum: number;
    pageSize: number;
}

/** 错误类型 */
export interface ApiError {
    code: number;
    message: string;
    details?: Record<string, any>;
}