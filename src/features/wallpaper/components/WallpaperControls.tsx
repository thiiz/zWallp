import { Play, Square, Volume2, Settings } from 'lucide-react'
import { useState } from 'react'
import { useWallpaper } from '../hooks/useWallpaper'
import type { Wallpaper } from '../types'

interface WallpaperControlsProps {
    selectedWallpaper: Wallpaper | null
}

export function WallpaperControls({
    selectedWallpaper
}: WallpaperControlsProps) {
    const { isActive, loading, applyWallpaper, removeWallpaper } =
        useWallpaper()
    const [error, setError] = useState<string | null>(null)

    const handleApply = async () => {
        if (selectedWallpaper) {
            try {
                setError(null)
                await applyWallpaper(selectedWallpaper)
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : 'Failed to apply wallpaper'
                setError(errorMessage)
                console.error('Wallpaper application error:', err)
            }
        }
    }

    const handleRemove = async () => {
        try {
            setError(null)
            await removeWallpaper()
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Failed to remove wallpaper'
            setError(errorMessage)
            console.error('Wallpaper removal error:', err)
        }
    }

    return (
        <div className="flex flex-col bg-zinc-900 border-t border-zinc-800">
            {error && (
                <div className="px-4 py-2 bg-red-900/50 border-b border-red-800 text-red-200 text-sm">
                    {error}
                </div>
            )}
            <div className="flex items-center gap-3 p-4">
                <button
                    onClick={isActive ? handleRemove : handleApply}
                    disabled={!selectedWallpaper || loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-lg transition-colors"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {isActive ? 'Removing...' : 'Applying...'}
                        </>
                    ) : isActive ? (
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
        </div>
    )
}
