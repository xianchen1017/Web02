// src/types/article.ts
import {ref} from "vue";

export interface Article {
    id: number
    title: string
    category: string
    status: 'draft' | 'published' | 'archived'
    content: string
    createTime: string
    updateTime: string
    authorId: number
}

export interface Author {
    id: number
    username: string
    avatar: string
    articleCount: number
}

const currentAuthor = ref<Author | null>(null)

export interface ArticleListResponse {
    list: Article[]
    total: number
}

export interface AuthorListResponse {
    list: Author[]
    total: number
}