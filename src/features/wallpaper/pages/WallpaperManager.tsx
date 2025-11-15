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
        <div className="h-screen flex flex-col bg-zinc-950 text-white">
            <header className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800">
                <h1 className="text-2xl font-bold">Wallpaper Engine</h1>
                <div className="text-sm text-zinc-400">
                    {wallpapers.length} wallpaper
                    {wallpapers.length !== 1 ? 's' : ''}
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    <WallpaperGallery
                        wallpapers={wallpapers}
                        onSelect={setSelectedWallpaper}
                        onDelete={handleDeleteWallpaper}
                        onAdd={() => setIsDialogOpen(true)}
                    />
                </div>

                <div className="w-96 flex flex-col border-l border-zinc-800">
                    <div className="flex-1">
                        <WallpaperPreview
                            wallpaper={selectedWallpaper}
                            className="h-full"
                        />
                    </div>

                    {selectedWallpaper && (
                        <div className="p-4 bg-zinc-900 border-t border-zinc-800">
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

            <WallpaperControls hasSelection={!!selectedWallpaper} />

            <CreateWallpaperDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleAddWallpaper}
            />
        </div>
    )
}
