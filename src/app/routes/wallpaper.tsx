import { useEffect, useState } from 'react'
import { listen } from '@tauri-apps/api/event'

interface WallpaperConfig {
    type: 'video' | 'html' | 'image'
    source: string
}

export default function WallpaperDisplay() {
    const [config, setConfig] = useState<WallpaperConfig | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        console.log('Wallpaper display mounted')

        const setupListener = async () => {
            try {
                const unlisten = await listen<WallpaperConfig>(
                    'wallpaper-config',
                    (event) => {
                        console.log('Received wallpaper config:', event.payload)
                        setConfig(event.payload)
                        setError(null)
                    }
                )

                return unlisten
            } catch (err) {
                console.error('Failed to setup listener:', err)
                setError(String(err))
            }
        }

        const unlistenPromise = setupListener()

        return () => {
            unlistenPromise.then((unlisten) => unlisten?.())
        }
    }, [])

    if (error) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-red-900">
                <div className="text-white text-center">
                    <p className="text-xl mb-2">Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        )
    }

    if (!config) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
                <div className="text-white text-center">
                    <div className="animate-pulse mb-4">
                        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                    <p className="text-xl">Waiting for wallpaper...</p>
                    <p className="text-sm text-gray-300 mt-2">
                        Listening for configuration
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-screen h-screen overflow-hidden bg-black">
            {config.type === 'video' && (
                <video
                    src={config.source}
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        console.error('Video error:', e)
                        setError('Failed to load video')
                    }}
                />
            )}
            {config.type === 'image' && (
                <img
                    src={config.source}
                    alt="Wallpaper"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        console.error('Image error:', e)
                        setError('Failed to load image')
                    }}
                />
            )}
            {config.type === 'html' && (
                <iframe
                    src={config.source}
                    className="w-full h-full border-0"
                    title="Wallpaper"
                    onError={(e) => {
                        console.error('Iframe error:', e)
                        setError('Failed to load HTML content')
                    }}
                />
            )}
        </div>
    )
}
