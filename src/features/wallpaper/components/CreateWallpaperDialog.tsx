import { useState } from 'react'
import { X, Upload, Code } from 'lucide-react'
import { open } from '@tauri-apps/plugin-dialog'
import { convertToAssetUrl } from '../utils/convertFilePath'

interface CreateWallpaperDialogProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: { name: string; type: string; source: string }) => void
}

export function CreateWallpaperDialog({
    isOpen,
    onClose,
    onSubmit
}: CreateWallpaperDialogProps) {
    const [name, setName] = useState('')
    const [type, setType] = useState<'video' | 'html' | 'image'>('video')
    const [source, setSource] = useState('')

    const handleFileSelect = async () => {
        const filters =
            type === 'video'
                ? [{ name: 'Video', extensions: ['mp4', 'webm', 'mov'] }]
                : type === 'image'
                  ? [
                        {
                            name: 'Image',
                            extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp']
                        }
                    ]
                  : [{ name: 'HTML', extensions: ['html'] }]

        const selected = await open({
            multiple: false,
            filters
        })

        if (selected) {
            const filePath = selected as string
            const assetUrl = convertToAssetUrl(filePath)
            setSource(assetUrl)
            if (!name) {
                const fileName =
                    filePath
                        .split(/[\\/]/)
                        .pop()
                        ?.replace(/\.[^/.]+$/, '') || ''
                setName(fileName)
            }
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name && source) {
            onSubmit({ name, type, source })
            setName('')
            setSource('')
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-zinc-900 rounded-lg w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Add Wallpaper</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-zinc-800 rounded"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="My Wallpaper"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Type
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['video', 'image', 'html'] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                                        type === t
                                            ? 'bg-blue-600'
                                            : 'bg-zinc-800 hover:bg-zinc-700'
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Source
                        </label>
                        <button
                            type="button"
                            onClick={handleFileSelect}
                            className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            {type === 'html' ? (
                                <Code className="w-5 h-5" />
                            ) : (
                                <Upload className="w-5 h-5" />
                            )}
                            {source ? 'Change File' : 'Select File'}
                        </button>
                        {source && (
                            <p className="mt-2 text-sm text-zinc-400 truncate">
                                {source}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name || !source}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-lg transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
