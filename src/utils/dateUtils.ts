// src/utils/dateUtils.ts
export function formatDate(dateString: string | Date): string {
    if (!dateString) return '未记录'

    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}