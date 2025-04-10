import request from '@/utils/request'
import type {
    User,
    UserListResponse,
    UserQueryParams,
    BaseResponse,
    ListResult,
    UserFormData
} from '@/types/user'

// 获取用户列表
export const getUserList = (
    params: UserQueryParams
): Promise<BaseResponse<ListResult<User>>> => {
    return request.get('/user/list', { params })
}

// 添加用户
export const addUser = (
    data: UserFormData
): Promise<BaseResponse<User>> => {
    return request.post('/user/add', data)
}

// 更新用户
export const updateUser = (
    id: number,
    data: Partial<UserFormData>
): Promise<BaseResponse<User>> => {
    return request.put(`/user/${id}`, data)
}

// 删除用户
export const deleteUser = (
    id: number
): Promise<BaseResponse<boolean>> => {
    return request.delete(`/user/${id}`)
}