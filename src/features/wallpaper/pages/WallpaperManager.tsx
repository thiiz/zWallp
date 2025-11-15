import { useState } from 'react'
import { WallpaperGallery } from '../components/WallpaperGallery'
import { WallpaperPreview } from '../components/WallpaperPreview'
import { WallpaperControls } from '../components/WallpaperControls'
import { CreateWallpaperDialog } from '../components/CreateWallpaperDialog'
import type { Wallpaper } from '../types'

export function WallpaperManager() {
    const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
    const [selectedWallpaper, setSelectedWallpaper] =
        useState<Wallpaper | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleAddWallpaper = (data: {
        name: string
        type: string
        source: string
    }) => {
        const newWallpaper: Wallpaper = {
            id: Date.now().toString(),
            name: data.name,
            type: data.type as 'video' | 'html' | 'image',
            thumbnail: data.source,
            source: data.source,
            createdAt: new Date().toISOString()
        }
        setWallpapers([...wallpapers, newWallpaper])
        setSelectedWallpaper(newWallpaper)
    }

    const handleDeleteWallpaper = (id: string) => {
        setWallpapers(wallpapers.filter((w) => w.id !== id))
        if (selectedWallpaper?.id === id) {
            setSelectedWallpaper(null)
        }
    }

    return (
        <div className="h-full flex flex-col bg-zinc-950 text-white overflow-hidden">
            {/* Header - Fixed */}
            <header className="flex-none flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800">
                <h1 className="text-2xl font-bold">Wallpaper Engine</h1>
                <div className="text-sm text-zinc-400">
                    {wallpapers.length} wallpaper
                    {wallpapers.length !== 1 ? 's' : ''}
                </div>
            </header>

            {/* Main Content - Scrollable */}
            <div className="flex-1 flex overflow-hidden min-h-0">
                {/* Gallery - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                    <WallpaperGallery
                        wallpapers={wallpapers}
                        onSelect={setSelectedWallpaper}
                        onDelete={handleDeleteWallpaper}
                        onAdd={() => setIsDialogOpen(true)}
                    />
                </div>

                {/* Preview Panel - Fixed width, scrollable content */}
                <div className="w-96 flex flex-col border-l border-zinc-800 flex-none">
                    <div className="flex-1 overflow-hidden">
                        <WallpaperPreview
                            wallpaper={selectedWallpaper}
                            className="h-full"
                        />
                    </div>

                    {selectedWallpaper && (
                        <div className="flex-none p-4 bg-zinc-900 border-t border-zinc-800">
                            <h3 className="font-semibold mb-1">
                                {selectedWallpaper.name}
                            </h3>
                            <p className="text-sm text-zinc-400 capitalize">
                                {selectedWallpaper.type} wallpaper
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Controls - Fixed at bottom */}
            <div className="flex-none">
                <WallpaperControls hasSelection={!!selectedWallpaper} />
            </div>

            <CreateWallpaperDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleAddWallpaper}
            />
        </div>
    )
}
