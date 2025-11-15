export interface Wallpaper {
    id: string
    name: string
    type: 'video' | 'html' | 'image'
    thumbnail: string
    source: string
    createdAt: string
}

export interface WallpaperSettings {
    volume: number
    playbackSpeed: number
    quality: 'low' | 'medium' | 'high'
}
