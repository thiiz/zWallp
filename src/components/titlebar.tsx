import { WindowControls } from './window-controls'
import { Wallpaper } from 'lucide-react'

export function Titlebar() {
    return (
        <div
            data-tauri-drag-region
            className="h-10 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between select-none"
        >
            <div className="flex h-full items-center gap-2 px-4">
                <Wallpaper className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold">zWallp</span>
            </div>
            <WindowControls />
        </div>
    )
}
