import React, { useState, useEffect } from 'react'
import {
    Heart,
    Calendar,
    FileType,
    HardDrive,
    Monitor,
    Tag,
    X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Wallpaper } from '../types'

interface WallpaperInfoProps {
    wallpaper: Wallpaper
    onUpdateName?: (name: string) => void
    onUpdateTags?: (tags: string[]) => void
    onToggleFavorite?: () => void
    className?: string
}

export function WallpaperInfo({
    wallpaper,
    onUpdateName,
    onUpdateTags,
    onToggleFavorite,
    className
}: WallpaperInfoProps) {
    const [isEditingName, setIsEditingName] = useState(false)
    const [editedName, setEditedName] = useState(wallpaper.name)
    const [tagInput, setTagInput] = useState('')
    const [tags, setTags] = useState<string[]>(wallpaper.tags || [])

    // Update local state when wallpaper changes
    useEffect(() => {
        setEditedName(wallpaper.name)
        setTags(wallpaper.tags || [])
    }, [wallpaper.id, wallpaper.name, wallpaper.tags])

    const handleNameSave = () => {
        if (editedName.trim() && editedName !== wallpaper.name) {
            onUpdateName?.(editedName.trim())
        }
        setIsEditingName(false)
    }

    const handleNameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleNameSave()
        } else if (e.key === 'Escape') {
            setEditedName(wallpaper.name)
            setIsEditingName(false)
        }
    }

    const handleAddTag = () => {
        const newTag = tagInput.trim().toLowerCase()
        if (newTag && !tags.includes(newTag)) {
            const updatedTags = [...tags, newTag]
            setTags(updatedTags)
            onUpdateTags?.(updatedTags)
            setTagInput('')
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
        const updatedTags = tags.filter((tag) => tag !== tagToRemove)
        setTags(updatedTags)
        onUpdateTags?.(updatedTags)
    }

    const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddTag()
        }
    }

    const formatFileSize = (bytes?: number): string => {
        if (!bytes) return 'Unknown'
        const mb = bytes / (1024 * 1024)
        if (mb < 1) {
            return `${(bytes / 1024).toFixed(1)} KB`
        }
        return `${mb.toFixed(1)} MB`
    }

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getTypeLabel = (type: string): string => {
        switch (type) {
            case 'video':
                return 'Video'
            case 'image':
                return 'Image'
            case 'html':
                return 'HTML'
            default:
                return type
        }
    }

    const getTypeBadgeColor = (type: string): string => {
        switch (type) {
            case 'video':
                return 'bg-info/20 text-info border-info/30'
            case 'image':
                return 'bg-success/20 text-success border-success/30'
            case 'html':
                return 'bg-warning/20 text-warning border-warning/30'
            default:
                return 'bg-text-tertiary/20 text-text-tertiary border-text-tertiary/30'
        }
    }

    return (
        <div className={cn('space-y-4', className)}>
            {/* Name Section */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-text-secondary">
                        Name
                    </label>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleFavorite}
                        className={cn(
                            'transition-colors',
                            wallpaper.isFavorite
                                ? 'text-error hover:text-error/80'
                                : 'text-text-tertiary hover:text-text-secondary'
                        )}
                        aria-label={
                            wallpaper.isFavorite
                                ? 'Remove from favorites'
                                : 'Add to favorites'
                        }
                    >
                        <Heart
                            className={cn(
                                'h-4 w-4',
                                wallpaper.isFavorite && 'fill-current'
                            )}
                        />
                    </Button>
                </div>

                {isEditingName ? (
                    <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onBlur={handleNameSave}
                        onKeyDown={handleNameKeyDown}
                        autoFocus
                        className="text-base"
                    />
                ) : (
                    <button
                        onClick={() => setIsEditingName(true)}
                        className="w-full text-left px-3 py-2 rounded-lg bg-bg-tertiary hover:bg-bg-elevated transition-colors text-text-primary font-medium"
                    >
                        {wallpaper.name}
                    </button>
                )}
            </div>

            {/* Type Badge */}
            <div className="flex items-center gap-2">
                <span
                    className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border',
                        getTypeBadgeColor(wallpaper.type)
                    )}
                >
                    <FileType className="h-3 w-3" />
                    {getTypeLabel(wallpaper.type)}
                </span>

                {wallpaper.isActive && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-success/20 text-success border border-success/30">
                        Active
                    </span>
                )}
            </div>

            {/* Metadata */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium text-text-secondary">
                    Details
                </h3>
                <div className="space-y-1.5 text-sm">
                    {wallpaper.metadata?.resolution && (
                        <div className="flex items-center gap-2 text-text-tertiary">
                            <Monitor className="h-4 w-4" />
                            <span>{wallpaper.metadata.resolution}</span>
                        </div>
                    )}

                    {wallpaper.metadata?.fileSize && (
                        <div className="flex items-center gap-2 text-text-tertiary">
                            <HardDrive className="h-4 w-4" />
                            <span>
                                {formatFileSize(wallpaper.metadata.fileSize)}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-text-tertiary">
                        <Calendar className="h-4 w-4" />
                        <span>Added {formatDate(wallpaper.createdAt)}</span>
                    </div>
                </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary flex items-center gap-1.5">
                    <Tag className="h-4 w-4" />
                    Tags
                </label>

                {/* Tag Input */}
                <div className="flex gap-2">
                    <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        placeholder="Add a tag..."
                        className="text-sm"
                        inputSize="sm"
                    />
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                    >
                        Add
                    </Button>
                </div>

                {/* Tag List */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-accent-primary/20 text-accent-primary text-xs font-medium border border-accent-primary/30"
                            >
                                {tag}
                                <button
                                    onClick={() => handleRemoveTag(tag)}
                                    className="hover:text-accent-hover transition-colors"
                                    aria-label={`Remove ${tag} tag`}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
