import request from '@/utils/request'

interface AuthorWithArticleCount {
    id: number
    username: string
    avatar: string
    articleCount: number
}

interface Article {
    id: number
    title: string
    content: string
    category: string
    status: 'published' | 'draft'
    createTime: string
    updateTime: string
    authorId: number
}

interface ListResult<T> {
    list: T[]
    total: number
}

// 获取作者列表及文章数统计
export const getAuthorsWithArticleCount = (params: {
    page: number
    size: number
    keyword?: string
}) => {
    return request.get<ListResult<AuthorWithArticleCount>>('/api/authors/with-article-count', { params })
}

// 获取作者的文章列表
export const getAuthorArticles = (params: {
    authorId: number
    page: number
    size: number
    keyword?: string
}) => {
    return request.get<ListResult<Article>>(`/api/authors/${params.authorId}/articles`, { params })
}

// 新增文章
export const addArticle = (data: Omit<Article, 'id' | 'createTime' | 'updateTime'>) => {
    return request.post<Article>('/api/articles', data)
}

// 更新文章
export const updateArticle = (data: Article) => {
    return request.put<Article>(`/api/articles/${data.id}`, data)
}

// 删除文章
export const deleteArticle = (id: number) => {
    return request.delete(`/api/articles/${id}`)
}