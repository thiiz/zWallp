import { Play, Square, Volume2, Settings } from 'lucide-react'
import { useWallpaper } from '../hooks/useWallpaper'

interface WallpaperControlsProps {
    hasSelection: boolean
}

export function WallpaperControls({ hasSelection }: WallpaperControlsProps) {
    const { isActive, loading, applyWallpaper, removeWallpaper } =
        useWallpaper()

    return (
        <div className="flex items-center gap-3 p-4 bg-zinc-900 border-t border-zinc-800">
            <button
                onClick={isActive ? removeWallpaper : applyWallpaper}
                disabled={!hasSelection || loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-lg transition-colors"
            >
                {isActive ? (
                    <>
                        <Square className="w-4 h-4" />
                        Stop
                    </>
                ) : (
                    <>
                        <Play className="w-4 h-4" />
                        Apply
                    </>
                )}
            </button>

            <div className="flex-1" />

            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                <Volume2 className="w-5 h-5" />
            </button>

            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
            </button>
        </div>
    )
}
