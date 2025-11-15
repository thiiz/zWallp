import { useEffect, useRef } from 'react'
import type { Wallpaper } from '../types'

interface WallpaperPreviewProps {
    wallpaper: Wallpaper | null
    className?: string
}

export function WallpaperPreview({
    wallpaper,
    className = ''
}: WallpaperPreviewProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        if (wallpaper?.type === 'video' && videoRef.current) {
            videoRef.current.load()
            videoRef.current.play()
        }
    }, [wallpaper])

    if (!wallpaper) {
        return (
            <div
                className={`flex items-center justify-center bg-zinc-900 ${className}`}
            >
                <p className="text-zinc-500">Select a wallpaper to preview</p>
            </div>
        )
    }

    return (
        <div className={`relative overflow-hidden bg-black ${className}`}>
            {wallpaper.type === 'video' && (
                <video
                    ref={videoRef}
                    src={wallpaper.source}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    autoPlay
                />
            )}

            {wallpaper.type === 'image' && (
                <img
                    src={wallpaper.source}
                    alt={wallpaper.name}
                    className="w-full h-full object-cover"
                />
            )}

            {wallpaper.type === 'html' && (
                <iframe
                    ref={iframeRef}
                    src={wallpaper.source}
                    className="w-full h-full border-0"
                    title={wallpaper.name}
                />
            )}
        </div>
    )
}
