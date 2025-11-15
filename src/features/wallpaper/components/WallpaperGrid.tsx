import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { WallpaperCard } from './WallpaperCard'
import { DropZoneOverlay } from './DropZoneOverlay'
import { useDragAndDrop } from '../hooks/useDragAndDrop'
import type { Wallpaper } from '../types'

interface WallpaperGridProps {
    wallpapers: Wallpaper[]
    selectedId?: string
    activeId?: string
    onSelect: (wallpaper: Wallpaper) => void
    onDelete: (id: string) => void
    onToggleFavorite?: (id: string) => void
    onFilesDropped?: (files: File[]) => void
    className?: string
    children?: React.ReactNode
}

// Responsive grid columns based on container width
const gridColumns = {
    mobile: 'grid-cols-1',
    tablet: 'sm:grid-cols-2',
    desktop: 'md:grid-cols-3 lg:grid-cols-4',
    wide: 'xl:grid-cols-5',
    ultrawide: '2xl:grid-cols-6'
}

export function WallpaperGrid({
    wallpapers,
    selectedId,
    activeId,
    onSelect,
    onDelete,
    onToggleFavorite,
    onFilesDropped,
    className,
    children
}: WallpaperGridProps) {
    // Drag and drop functionality
    const {
        isDragging,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop
    } = useDragAndDrop({
        onFilesDropped: onFilesDropped || (() => {})
    })

    // Memoize grid classes to prevent unnecessary recalculations
    const gridClasses = useMemo(
        () =>
            cn(
                'grid gap-4 p-6',
                'transition-all duration-300 ease-out',
                gridColumns.mobile,
                gridColumns.tablet,
                gridColumns.desktop,
                gridColumns.wide,
                gridColumns.ultrawide,
                className
            ),
        [className]
    )

    return (
        <>
            <div
                className={gridClasses}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {children}
                {wallpapers.map((wallpaper) => (
                    <WallpaperCard
                        key={wallpaper.id}
                        wallpaper={wallpaper}
                        isSelected={selectedId === wallpaper.id}
                        isActive={activeId === wallpaper.id}
                        isFavorite={false} // TODO: Implement favorites in state management
                        onSelect={onSelect}
                        onDelete={onDelete}
                        onToggleFavorite={onToggleFavorite}
                    />
                ))}
            </div>

            {/* Drop Zone Overlay */}
            {onFilesDropped && <DropZoneOverlay isVisible={isDragging} />}
        </>
    )
}
