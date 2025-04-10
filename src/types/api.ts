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