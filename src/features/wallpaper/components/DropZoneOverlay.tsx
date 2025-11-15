import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DropZoneOverlayProps {
    isVisible: boolean
    className?: string
}

export function DropZoneOverlay({
    isVisible,
    className
}: DropZoneOverlayProps) {
    return (
        <div
            className={cn(
                'fixed inset-0 z-50',
                'flex items-center justify-center',
                'bg-black/80 backdrop-blur-md',
                'transition-all duration-200',
                isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
                className
            )}
        >
            <div
                className={cn(
                    'flex flex-col items-center gap-6 p-12',
                    'border-4 border-dashed rounded-2xl',
                    'transition-all duration-200',
                    isVisible
                        ? 'border-accent-primary scale-100'
                        : 'border-border-default scale-95'
                )}
            >
                <div
                    className={cn(
                        'w-24 h-24 rounded-full',
                        'flex items-center justify-center',
                        'bg-accent-primary/20',
                        'transition-transform duration-200',
                        isVisible && 'animate-bounce'
                    )}
                >
                    <Upload className="w-12 h-12 text-accent-primary" />
                </div>

                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Drop your wallpaper here
                    </h2>
                    <p className="text-text-secondary">
                        Supports videos (MP4, WebM), images (JPG, PNG, GIF), and
                        HTML files
                    </p>
                </div>
            </div>
        </div>
    )
}
