import React, { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { PreviewMedia } from './PreviewMedia'
import { WallpaperInfo } from './WallpaperInfo'
import { PreviewActions } from './PreviewActions'
import type { Wallpaper } from '../types'

interface PreviewPanelProps {
    wallpaper: Wallpaper | null
    isOpen: boolean
    onClose: () => void
    onApply?: () => void
    onRemove?: () => void
    onDelete?: () => void
    onEdit?: () => void
    onShare?: () => void
    onToggleFavorite?: () => void
    onUpdateName?: (name: string) => void
    onUpdateTags?: (tags: string[]) => void
    isApplying?: boolean
    isRemoving?: boolean
    className?: string
}

export function PreviewPanel({
    wallpaper,
    isOpen,
    onClose,
    onApply,
    onRemove,
    onDelete,
    onEdit,
    onShare,
    onToggleFavorite,
    onUpdateName,
    onUpdateTags,
    isApplying = false,
    isRemoving = false,
    className
}: PreviewPanelProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    // Handle panel visibility and animation
    const panelClasses = cn(
        // Base styles
        'fixed right-0 top-0 h-full z-40',
        'glass-strong border-l border-border-default',
        'flex flex-col',
        'transition-all duration-[350ms] transition-ease-spring',
        // Width and transform based on state
        isOpen && !isCollapsed ? 'w-[400px] translate-x-0' : 'translate-x-full',
        isCollapsed && 'w-0',
        className
    )

    // Don't render if not open
    if (!isOpen && !isCollapsed) {
        return null
    }

    return (
        <>
            {/* Backdrop overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-250"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Preview Panel */}
            <aside
                className={panelClasses}
                role="complementary"
                aria-label="Wallpaper preview panel"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border-subtle">
                    <h2 className="text-lg font-semibold text-text-primary">
                        Preview
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        aria-label="Close preview panel"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {wallpaper ? (
                        <div className="p-4 space-y-6">
                            {/* Preview Media */}
                            <PreviewMedia wallpaper={wallpaper} />

                            {/* Wallpaper Info */}
                            <WallpaperInfo
                                wallpaper={wallpaper}
                                onUpdateName={onUpdateName}
                                onUpdateTags={onUpdateTags}
                                onToggleFavorite={onToggleFavorite}
                            />

                            {/* Action Buttons */}
                            <PreviewActions
                                wallpaper={wallpaper}
                                onApply={onApply}
                                onRemove={onRemove}
                                onEdit={onEdit}
                                onShare={onShare}
                                onDelete={onDelete}
                                isApplying={isApplying}
                                isRemoving={isRemoving}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-text-tertiary text-sm">
                                Select a wallpaper to preview
                            </p>
                        </div>
                    )}
                </div>
            </aside>
        </>
    )
}
