import { useState, useEffect, useRef } from 'react'
import {
    Search,
    X,
    Grid3x3,
    List,
    Settings as SettingsIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip'

export type ViewMode = 'grid' | 'list'

interface TopBarProps {
    searchQuery?: string
    onSearchChange?: (query: string) => void
    viewMode?: ViewMode
    onViewModeChange?: (mode: ViewMode) => void
    onSettingsClick?: () => void
    className?: string
}

export function TopBar({
    searchQuery = '',
    onSearchChange,
    viewMode = 'grid',
    onViewModeChange,
    onSettingsClick,
    className
}: TopBarProps) {
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
    const [isFocused, setIsFocused] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)

    // Debounced search handler
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
        }

        debounceTimerRef.current = setTimeout(() => {
            onSearchChange?.(localSearchQuery)
        }, 300)

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
        }
    }, [localSearchQuery, onSearchChange])

    // Keyboard shortcut handler (Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                searchInputRef.current?.focus()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const handleClearSearch = () => {
        setLocalSearchQuery('')
        onSearchChange?.('')
        searchInputRef.current?.focus()
    }

    return (
        <div
            className={cn(
                'flex items-center gap-4 px-6 py-4 border-b border-border-subtle bg-bg-primary',
                className
            )}
        >
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
                <div
                    className={cn(
                        'relative flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200',
                        'glass',
                        isFocused
                            ? 'border-accent-primary ring-2 ring-accent-primary/20'
                            : 'border-border-default hover:border-border-strong'
                    )}
                >
                    <Search
                        className={cn(
                            'h-4 w-4 transition-colors',
                            isFocused
                                ? 'text-accent-primary'
                                : 'text-text-tertiary'
                        )}
                    />

                    <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search wallpapers..."
                        value={localSearchQuery}
                        onChange={(e) => setLocalSearchQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-text-primary placeholder:text-text-tertiary p-0 h-auto"
                    />

                    {localSearchQuery && (
                        <button
                            onClick={handleClearSearch}
                            className="p-1 rounded hover:bg-bg-tertiary transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4 text-text-secondary" />
                        </button>
                    )}

                    {!isFocused && !localSearchQuery && (
                        <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs bg-bg-elevated border border-border-default rounded text-text-tertiary">
                            <span>Ctrl</span>
                            <span>+</span>
                            <span>K</span>
                        </kbd>
                    )}
                </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-bg-secondary border border-border-default">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewModeChange?.('grid')}
                            className={cn(
                                'px-3',
                                viewMode === 'grid' &&
                                    'bg-accent-primary text-white hover:bg-accent-hover'
                            )}
                        >
                            <Grid3x3 className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Grid View</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewModeChange?.('list')}
                            className={cn(
                                'px-3',
                                viewMode === 'list' &&
                                    'bg-accent-primary text-white hover:bg-accent-hover'
                            )}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>List View</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            {/* Settings Button */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onSettingsClick}
                        className="px-3"
                    >
                        <SettingsIcon className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="flex items-center gap-2">
                        <span>Settings</span>
                        <kbd className="px-2 py-1 text-xs bg-bg-elevated border border-border-default rounded">
                            Ctrl+,
                        </kbd>
                    </div>
                </TooltipContent>
            </Tooltip>
        </div>
    )
}
