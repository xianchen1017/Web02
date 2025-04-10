import type { User } from '@/types/user'

export const mockUserList: User[] = [
    {
        id: 1,
        username: 'admin',
        password: '123456',
        email: 'admin@example.com',
        phone: '13800138000',
        role: 'admin',
        status: 1,
        avatar: '/images/admin-avatar.jpg',
        createTime: '2023-01-01T00:00:00Z'
    },
    {
        id: 2,
        username: 'editor',
        password: '123456',
        email: 'editor@example.com',
        phone: '13800138001',
        role: 'editor',
        status: 1,
        avatar: '/images/editor-avatar.jpg',
        createTime: '2023-01-02T00:00:00Z'
    },
    {
        id: 3,
        username: 'user',
        password: '123456',
        email: 'user@example.com',
        phone: '13800138002',
        role: 'user',
        status: 1,
        createTime: '2023-01-03T00:00:00Z'
    }
]

export const mockUserListResponse = {
    total: mockUserList.length,
    list: mockUserList
}