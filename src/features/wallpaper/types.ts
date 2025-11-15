export interface Wallpaper {
    id: string
    name: string
    type: 'video' | 'html' | 'image'
    thumbnail: string
    source: string
    createdAt: string
    metadata?: {
        resolution?: string
        fileSize?: number
        duration?: number
        fps?: number
        codec?: string
    }
    tags?: string[]
    isFavorite?: boolean
    isActive?: boolean
    updatedAt?: string
}

export interface WallpaperSettings {
    volume: number
    playbackSpeed: number
    quality: 'low' | 'medium' | 'high'
}
