import request from '@/utils/request'
import type {
    User,
    UserListResponse,
    UserQueryParams,
    BaseResponse,
    ListResult,
    UserFormData
} from '@/types/user'
import axios from "axios";

// 获取用户列表
export const getUserList = (
    params: UserQueryParams
): Promise<BaseResponse<ListResult<User>>> => {
    return request.get('/user/list', { params })
}
const fetchUserInfo = async () => {
    try {
        const res = await axios.get('/api/user/info', {
            // headers: {
            //     'Authorization': `Bearer ${userStore.token}`  // 假设你的 token 存储在 userStore 中
            // }
        });
        console.log(res.data);
    } catch (error) {
        console.error('获取用户信息失败', error);
    }
};

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