import React, { useState } from 'react'
import { Tag, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface MetadataFormProps {
    name: string
    onNameChange: (name: string) => void
    tags: string[]
    onTagsChange: (tags: string[]) => void
    description: string
    onDescriptionChange: (description: string) => void
    disabled?: boolean
    autoFillName?: string
}

export function MetadataForm({
    name,
    onNameChange,
    tags,
    onTagsChange,
    description,
    onDescriptionChange,
    disabled = false,
    autoFillName
}: MetadataFormProps) {
    const [tagInput, setTagInput] = useState('')

    // Auto-fill name when autoFillName changes
    React.useEffect(() => {
        if (autoFillName && !name) {
            onNameChange(autoFillName)
        }
    }, [autoFillName, name, onNameChange])

    const handleTagInputKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addTag()
        } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
            // Remove last tag if input is empty
            removeTag(tags[tags.length - 1])
        }
    }

    const addTag = () => {
        const trimmedTag = tagInput.trim().replace(/,/g, '')
        if (trimmedTag && !tags.includes(trimmedTag)) {
            onTagsChange([...tags, trimmedTag])
            setTagInput('')
        }
    }

    const removeTag = (tagToRemove: string) => {
        onTagsChange(tags.filter((tag) => tag !== tagToRemove))
    }

    const handleTagInputBlur = () => {
        if (tagInput.trim()) {
            addTag()
        }
    }

    return (
        <div className="space-y-4 pt-4 border-t border-border-default">
            <h4 className="text-sm font-medium text-text-primary">
                Wallpaper Details
            </h4>

            {/* Name Input */}
            <div>
                <label
                    htmlFor="wallpaper-name"
                    className="block text-sm font-medium text-text-primary mb-2"
                >
                    Name <span className="text-error">*</span>
                </label>
                <Input
                    id="wallpaper-name"
                    type="text"
                    placeholder="My Awesome Wallpaper"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    disabled={disabled}
                    required
                />
                {autoFillName && !name && (
                    <p className="text-xs text-text-tertiary mt-1">
                        Auto-filled from file name
                    </p>
                )}
            </div>

            {/* Tags Input */}
            <div>
                <label
                    htmlFor="wallpaper-tags"
                    className="block text-sm font-medium text-text-primary mb-2"
                >
                    Tags
                </label>
                <div
                    className={cn(
                        'flex flex-wrap gap-2 p-2 rounded-lg border border-border-default bg-bg-elevated',
                        'focus-within:ring-2 focus-within:ring-accent-primary focus-within:border-accent-primary',
                        'transition-all duration-200',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    {/* Tag Pills */}
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-accent-primary/10 text-accent-primary text-sm"
                        >
                            <Tag className="h-3 w-3" />
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                disabled={disabled}
                                className="ml-1 hover:bg-accent-primary/20 rounded-sm p-0.5 transition-colors"
                                aria-label={`Remove ${tag} tag`}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}

                    {/* Tag Input */}
                    <input
                        id="wallpaper-tags"
                        type="text"
                        placeholder={
                            tags.length === 0
                                ? 'Add tags (press Enter or comma)'
                                : 'Add more...'
                        }
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        onBlur={handleTagInputBlur}
                        disabled={disabled}
                        className={cn(
                            'flex-1 min-w-[120px] bg-transparent border-0 outline-none',
                            'text-text-primary placeholder:text-text-tertiary text-sm',
                            'disabled:cursor-not-allowed'
                        )}
                    />
                </div>
                <p className="text-xs text-text-tertiary mt-1">
                    Press Enter or comma to add a tag
                </p>
            </div>

            {/* Description Input (Optional) */}
            <div>
                <label
                    htmlFor="wallpaper-description"
                    className="block text-sm font-medium text-text-primary mb-2"
                >
                    Description{' '}
                    <span className="text-text-tertiary">(optional)</span>
                </label>
                <textarea
                    id="wallpaper-description"
                    placeholder="Add a description for this wallpaper..."
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    disabled={disabled}
                    rows={3}
                    className={cn(
                        'w-full p-3 rounded-lg border border-border-default bg-bg-elevated',
                        'text-text-primary placeholder:text-text-tertiary text-sm',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary',
                        'focus-visible:border-accent-primary transition-all duration-200',
                        'resize-none',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                />
            </div>

            {/* Suggested Tags */}
            {tags.length === 0 && (
                <div className="rounded-lg bg-bg-elevated p-3 border border-border-subtle">
                    <p className="text-xs font-medium text-text-primary mb-2">
                        Suggested tags:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {[
                            'nature',
                            'abstract',
                            'minimal',
                            'dark',
                            'colorful',
                            'animated'
                        ].map((suggestedTag) => (
                            <button
                                key={suggestedTag}
                                type="button"
                                onClick={() =>
                                    onTagsChange([...tags, suggestedTag])
                                }
                                disabled={disabled}
                                className={cn(
                                    'px-2 py-1 rounded-md text-xs',
                                    'bg-bg-tertiary text-text-secondary',
                                    'hover:bg-accent-primary/10 hover:text-accent-primary',
                                    'transition-colors duration-200',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary',
                                    disabled && 'opacity-50 cursor-not-allowed'
                                )}
                            >
                                {suggestedTag}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
