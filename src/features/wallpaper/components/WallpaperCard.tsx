import { useState, useRef, useEffect } from 'react'
import { Play, Trash2, Heart, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Wallpaper } from '../types'

interface WallpaperCardProps {
    wallpaper: Wallpaper
    isSelected?: boolean
    isActive?: boolean
    isFavorite?: boolean
    onSelect: (wallpaper: Wallpaper) => void
    onDelete: (id: string) => void
    onToggleFavorite?: (id: string) => void
    className?: string
}

export function WallpaperCard({
    wallpaper,
    isSelected = false,
    isActive = false,
    isFavorite = false,
    onSelect,
    onDelete,
    onToggleFavorite,
    className
}: WallpaperCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [isVideoPlaying, setIsVideoPlaying] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    // Handle video preview on hover
    useEffect(() => {
        if (wallpaper.type === 'video' && videoRef.current) {
            if (isHovered) {
                videoRef.current.play().catch(() => {
                    // Ignore autoplay errors
                })
                setIsVideoPlaying(true)
            } else {
                videoRef.current.pause()
                videoRef.current.currentTime = 0
                setIsVideoPlaying(false)
            }
        }
    }, [isHovered, wallpaper.type])

    return (
        <div
            className={cn(
                'group relative aspect-video rounded-xl overflow-hidden',
                'transition-all duration-200 ease-out',
                'cursor-pointer',
                // Hover effects
                'hover:scale-[1.02] hover:shadow-xl',
                // Selection state
                isSelected && 'ring-2 ring-accent-primary glow-accent',
                // Active state
                isActive && 'ring-2 ring-success',
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onSelect(wallpaper)}
        >
            {/* Thumbnail/Video */}
            <div className="relative w-full h-full bg-bg-tertiary">
                {wallpaper.type === 'video' ? (
                    <video
                        ref={videoRef}
                        src={wallpaper.source}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                    />
                ) : (
                    <img
                        src={wallpaper.thumbnail}
                        alt={wallpaper.name}
                        className="w-full h-full object-cover"
                    />
                )}

                {/* Gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Active Badge */}
            {isActive && (
                <div className="absolute top-3 right-3 z-10">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success text-white text-xs font-medium shadow-lg animate-pulse">
                        <Check className="w-3 h-3" />
                        Active
                    </div>
                </div>
            )}

            {/* Hover Overlay with Actions */}
            <div
                className={cn(
                    'absolute inset-0 bg-black/60 backdrop-blur-sm',
                    'flex items-center justify-center gap-3',
                    'transition-opacity duration-200',
                    isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
            >
                <Button
                    size="sm"
                    variant="primary"
                    onClick={(e) => {
                        e.stopPropagation()
                        onSelect(wallpaper)
                    }}
                    className="shadow-lg"
                >
                    <Play className="w-4 h-4" />
                </Button>

                {onToggleFavorite && (
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                            e.stopPropagation()
                            onToggleFavorite(wallpaper.id)
                        }}
                        className="shadow-lg"
                    >
                        <Heart
                            className={cn(
                                'w-4 h-4',
                                isFavorite && 'fill-current text-error'
                            )}
                        />
                    </Button>
                )}

                <Button
                    size="sm"
                    variant="danger"
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete(wallpaper.id)
                    }}
                    className="shadow-lg"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            {/* Wallpaper Info */}
            <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate">
                            {wallpaper.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-white/70 capitalize">
                                {wallpaper.type}
                            </span>
                        </div>
                    </div>

                    {/* Favorite indicator (when not hovering) */}
                    {isFavorite && !isHovered && (
                        <Heart className="w-4 h-4 fill-current text-error shrink-0" />
                    )}
                </div>
            </div>

            {/* Selection Checkmark */}
            {isSelected && (
                <div className="absolute top-3 left-3 z-10">
                    <div className="w-6 h-6 rounded-full bg-accent-primary flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 text-white" />
                    </div>
                </div>
            )}
        </div>
    )
}
