import React from 'react'
import { Check, Trash2, Edit, Share2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Wallpaper } from '../types'

interface PreviewActionsProps {
    wallpaper: Wallpaper
    onApply?: () => void
    onRemove?: () => void
    onEdit?: () => void
    onShare?: () => void
    onDelete?: () => void
    isApplying?: boolean
    isRemoving?: boolean
    className?: string
}

export function PreviewActions({
    wallpaper,
    onApply,
    onRemove,
    onEdit,
    onShare,
    onDelete,
    isApplying = false,
    isRemoving = false,
    className
}: PreviewActionsProps) {
    const isActive = wallpaper.isActive

    return (
        <div className={cn('space-y-3', className)}>
            {/* Primary Action */}
            <div className="space-y-2">
                {!isActive ? (
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={onApply}
                        loading={isApplying}
                        disabled={isApplying}
                        className="w-full"
                        leftIcon={Check}
                    >
                        {isApplying ? 'Applying...' : 'Apply Wallpaper'}
                    </Button>
                ) : (
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={onRemove}
                        loading={isRemoving}
                        disabled={isRemoving}
                        className="w-full"
                        leftIcon={X}
                    >
                        {isRemoving ? 'Removing...' : 'Remove Wallpaper'}
                    </Button>
                )}
            </div>

            {/* Secondary Actions */}
            <div className="grid grid-cols-3 gap-2">
                {onEdit && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        disabled={isApplying || isRemoving}
                        className="flex-col h-auto py-3 gap-1"
                    >
                        <Edit className="h-4 w-4" />
                        <span className="text-xs">Edit</span>
                    </Button>
                )}

                {onShare && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onShare}
                        disabled={isApplying || isRemoving}
                        className="flex-col h-auto py-3 gap-1"
                    >
                        <Share2 className="h-4 w-4" />
                        <span className="text-xs">Share</span>
                    </Button>
                )}

                {onDelete && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                        disabled={isApplying || isRemoving || isActive}
                        className="flex-col h-auto py-3 gap-1 text-error hover:text-error hover:bg-error/10"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="text-xs">Delete</span>
                    </Button>
                )}
            </div>

            {/* Status Message */}
            {isActive && (
                <div className="p-3 rounded-lg bg-success/10 border border-success/30">
                    <p className="text-sm text-success text-center">
                        This wallpaper is currently active
                    </p>
                </div>
            )}

            {isApplying && (
                <div className="p-3 rounded-lg bg-accent-primary/10 border border-accent-primary/30">
                    <p className="text-sm text-accent-primary text-center">
                        Applying wallpaper to your desktop...
                    </p>
                </div>
            )}

            {isRemoving && (
                <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
                    <p className="text-sm text-warning text-center">
                        Removing wallpaper from your desktop...
                    </p>
                </div>
            )}
        </div>
    )
}
