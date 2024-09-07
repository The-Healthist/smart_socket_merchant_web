export const getAuditStatusTagIndex = (value:any) => {
    if (!value) return 1
    if (value.status === 1) return 0 // 发布
    if (value.status === 0) return 2 // 驳回
    return 2
}


export const manuscriptStatusList = [
    { name: 'published', label: '已发布', color: 'success' as const },
    { name: 'reviewing', label: '待审核', color: 'warning' as const },
    { name: 'rejected', label: '已驳回', color: 'danger' as const },
]

export const manuscriptStatusTagTypeList = [
    'success',
    'warning',
    'danger',
]


export const manuscriptStyleList = [
    { name: 'electronic', label: '电子' },
    { name: 'pop', label: '流行' },
    { name: 'rock', label: '摇滚' },
    { name: 'jazz', label: '爵士' },
    { name: 'folk', label: '民谣' },
    { name: 'classical', label: '古典' },
    { name: 'hiphop', label: '嘻哈' },
    { name: 'dance', label: '舞曲' },
]

export const getStyleLabel = (value:any) => {
    const style = manuscriptStyleList.find((item) => item.name === value)
    return style ? style.label : ''
}

export const videoPlatformList = [
    { name: 'youtube', label: 'YouTube' },
    { name: 'bilibili', label: '哔哩哔哩' },
]

export const userStatusList = [
    { name: 'normal', label: '正常', color: 'success' as const },
    { name: 'banned', label: '已封禁', color: 'danger' as const },
]

export const questionStatusList = [
    { name: 'reviewing', label: '待审核', color: 'warning' as const },
    { name: 'published', label: '已发布', color: 'success' as const },
]