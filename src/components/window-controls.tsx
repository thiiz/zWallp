import { getCurrentWindow } from '@tauri-apps/api/window'
import { Minus, Square, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export function WindowControls() {
    const [isMaximized, setIsMaximized] = useState(false)
    const appWindow = getCurrentWindow()

    useEffect(() => {
        const checkMaximized = async () => {
            const maximized = await appWindow.isMaximized()
            setIsMaximized(maximized)
        }

        checkMaximized()

        const unlisten = appWindow.onResized(() => {
            checkMaximized()
        })

        return () => {
            unlisten.then((fn) => fn())
        }
    }, [])

    const handleMinimize = () => appWindow.minimize()
    const handleMaximize = () => appWindow.toggleMaximize()
    const handleClose = () => appWindow.close()

    return (
        <div className="flex h-full items-center">
            <button
                onClick={handleMinimize}
                className="h-full w-12 hover:bg-zinc-800 transition-colors flex items-center justify-center group"
                aria-label="Minimize"
            >
                <Minus className="w-4 h-4 text-zinc-400 group-hover:text-white" />
            </button>
            <button
                onClick={handleMaximize}
                className="h-full w-12 hover:bg-zinc-800 transition-colors flex items-center justify-center group"
                aria-label={isMaximized ? 'Restore' : 'Maximize'}
            >
                <Square className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
            </button>
            <button
                onClick={handleClose}
                className="h-full w-12 hover:bg-red-600 transition-colors flex items-center justify-center group"
                aria-label="Close"
            >
                <X className="w-4 h-4 text-zinc-400 group-hover:text-white" />
            </button>
        </div>
    )
}
