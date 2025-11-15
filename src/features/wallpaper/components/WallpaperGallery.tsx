import { useState } from 'react'
import { Play, Trash2, Plus } from 'lucide-react'
import type { Wallpaper } from '../types'

interface WallpaperGalleryProps {
    wallpapers: Wallpaper[]
    onSelect: (wallpaper: Wallpaper) => void
    onDelete: (id: string) => void
    onAdd: () => void
}

export function WallpaperGallery({
    wallpapers,
    onSelect,
    onDelete,
    onAdd
}: WallpaperGalleryProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
            <button
                onClick={onAdd}
                className="aspect-video bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-700 hover:border-zinc-600 flex flex-col items-center justify-center gap-2 transition-colors"
            >
                <Plus className="w-8 h-8 text-zinc-500" />
                <span className="text-sm text-zinc-500">Add Wallpaper</span>
            </button>

            {wallpapers.map((wallpaper) => (
                <div
                    key={wallpaper.id}
                    className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden group cursor-pointer"
                    onMouseEnter={() => setHoveredId(wallpaper.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => onSelect(wallpaper)}
                >
                    <img
                        src={wallpaper.thumbnail}
                        alt={wallpaper.name}
                        className="w-full h-full object-cover"
                    />

                    {hoveredId === wallpaper.id && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onSelect(wallpaper)
                                }}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <Play className="w-6 h-6" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDelete(wallpaper.id)
                                }}
                                className="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-full transition-colors"
                            >
                                <Trash2 className="w-6 h-6" />
                            </button>
                        </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-sm font-medium truncate">
                            {wallpaper.name}
                        </p>
                        <p className="text-xs text-zinc-400 capitalize">
                            {wallpaper.type}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
