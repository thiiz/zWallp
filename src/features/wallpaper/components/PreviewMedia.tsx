import React, { useEffect, useRef, useState } from 'react'
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    ZoomIn,
    ZoomOut,
    Maximize2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Wallpaper } from '../types'

interface PreviewMediaProps {
    wallpaper: Wallpaper
    className?: string
}

export function PreviewMedia({ wallpaper, className }: PreviewMediaProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)

    // Video controls state
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const [volume, setVolume] = useState(0.5)

    // Image zoom state
    const [zoom, setZoom] = useState(1)
    const [isFullscreen, setIsFullscreen] = useState(false)

    // Loading state
    const [isLoading, setIsLoading] = useState(true)

    // Reset loading state when wallpaper changes
    useEffect(() => {
        setIsLoading(true)
        setZoom(1)
        setIsPlaying(false)
    }, [wallpaper.id])

    // Video controls
    useEffect(() => {
        const video = videoRef.current
        if (!video || wallpaper.type !== 'video') return

        const handleLoadedData = () => setIsLoading(false)
        const handlePlay = () => setIsPlaying(true)
        const handlePause = () => setIsPlaying(false)

        video.addEventListener('loadeddata', handleLoadedData)
        video.addEventListener('play', handlePlay)
        video.addEventListener('pause', handlePause)

        // Auto-play video
        video.play().catch(() => {
            // Auto-play might be blocked
            setIsPlaying(false)
        })

        return () => {
            video.removeEventListener('loadeddata', handleLoadedData)
            video.removeEventListener('play', handlePlay)
            video.removeEventListener('pause', handlePause)
        }
    }, [wallpaper.id, wallpaper.type])

    // Image loading
    useEffect(() => {
        const image = imageRef.current
        if (!image || wallpaper.type !== 'image') return

        const handleLoad = () => setIsLoading(false)
        image.addEventListener('load', handleLoad)

        return () => {
            image.removeEventListener('load', handleLoad)
        }
    }, [wallpaper.id, wallpaper.type])

    // HTML iframe loading
    useEffect(() => {
        if (wallpaper.type === 'html') {
            // Simulate loading for iframe
            const timer = setTimeout(() => setIsLoading(false), 1000)
            return () => clearTimeout(timer)
        }
    }, [wallpaper.id, wallpaper.type])

    const togglePlay = () => {
        const video = videoRef.current
        if (!video) return

        if (isPlaying) {
            video.pause()
        } else {
            video.play()
        }
    }

    const toggleMute = () => {
        const video = videoRef.current
        if (!video) return

        video.muted = !video.muted
        setIsMuted(video.muted)
    }

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current
        if (!video) return

        const newVolume = parseFloat(e.target.value)
        video.volume = newVolume
        setVolume(newVolume)
        setIsMuted(newVolume === 0)
    }

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.25, 3))
    }

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.25, 0.5))
    }

    const handleFullscreen = () => {
        const container = imageRef.current?.parentElement
        if (!container) return

        if (!document.fullscreenElement) {
            container.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    return (
        <div
            className={cn(
                'relative rounded-lg overflow-hidden bg-bg-primary',
                className
            )}
        >
            {/* Loading Skeleton */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-bg-secondary animate-pulse">
                    <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Video Preview */}
            {wallpaper.type === 'video' && (
                <div className="relative group">
                    <video
                        ref={videoRef}
                        src={wallpaper.source}
                        className="w-full h-auto max-h-[300px] object-cover"
                        loop
                        muted={isMuted}
                        playsInline
                    />

                    {/* Video Controls Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                            {/* Play/Pause and Volume */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={togglePlay}
                                    className="text-white hover:bg-white/20"
                                >
                                    {isPlaying ? (
                                        <Pause className="h-4 w-4" />
                                    ) : (
                                        <Play className="h-4 w-4" />
                                    )}
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleMute}
                                    className="text-white hover:bg-white/20"
                                >
                                    {isMuted ? (
                                        <VolumeX className="h-4 w-4" />
                                    ) : (
                                        <Volume2 className="h-4 w-4" />
                                    )}
                                </Button>

                                {!isMuted && (
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={volume}
                                        onChange={handleVolumeChange}
                                        className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Preview */}
            {wallpaper.type === 'image' && (
                <div className="relative group">
                    <div className="overflow-hidden">
                        <img
                            ref={imageRef}
                            src={wallpaper.source}
                            alt={wallpaper.name}
                            className="w-full h-auto max-h-[300px] object-cover transition-transform duration-200"
                            style={{ transform: `scale(${zoom})` }}
                        />
                    </div>

                    {/* Image Controls Overlay */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleZoomOut}
                            disabled={zoom <= 0.5}
                            className="bg-black/60 hover:bg-black/80 text-white border-none"
                        >
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleZoomIn}
                            disabled={zoom >= 3}
                            className="bg-black/60 hover:bg-black/80 text-white border-none"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleFullscreen}
                            className="bg-black/60 hover:bg-black/80 text-white border-none"
                        >
                            <Maximize2 className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Zoom indicator */}
                    {zoom !== 1 && (
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-white text-xs">
                            {Math.round(zoom * 100)}%
                        </div>
                    )}
                </div>
            )}

            {/* HTML Preview */}
            {wallpaper.type === 'html' && (
                <div className="relative">
                    <iframe
                        ref={iframeRef}
                        src={wallpaper.source}
                        className="w-full h-[300px] border-0"
                        title={wallpaper.name}
                        sandbox="allow-scripts allow-same-origin"
                    />
                    <div className="absolute top-2 left-2 px-2 py-1 bg-accent-primary/80 rounded text-white text-xs font-medium">
                        HTML Wallpaper
                    </div>
                </div>
            )}
        </div>
    )
}
