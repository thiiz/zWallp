import { useState, useEffect, useCallback, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/tailwind'

interface SearchBarProps {
    onSearch: (query: string) => void
    placeholder?: string
    debounceMs?: number
    className?: string
}

export function SearchBar({
    onSearch,
    placeholder = 'Search wallpapers...',
    debounceMs = 300,
    className
}: SearchBarProps) {
    const [query, setQuery] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const debounceTimerRef = useRef<NodeJS.Timeout>()

    // Debounced search
    const debouncedSearch = useCallback(
        (value: string) => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }

            debounceTimerRef.current = setTimeout(() => {
                onSearch(value)
            }, debounceMs)
        },
        [onSearch, debounceMs]
    )

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setQuery(value)
        debouncedSearch(value)
    }

    // Clear search
    const handleClear = () => {
        setQuery('')
        onSearch('')
        inputRef.current?.focus()
    }

    // Keyboard shortcut (Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                inputRef.current?.focus()
            }

            // Escape to clear
            if (e.key === 'Escape' && isFocused) {
                handleClear()
                inputRef.current?.blur()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
        }
    }, [isFocused])

    return (
        <div className={cn('relative w-full max-w-md', className)}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary pointer-events-none" />

                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className={cn(
                        'w-full h-10 pl-10 pr-20 rounded-lg',
                        'bg-bg-elevated border border-border-default',
                        'text-text-primary placeholder:text-text-tertiary',
                        'transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary',
                        'hover:border-border-strong'
                    )}
                />

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {query && (
                        <button
                            onClick={handleClear}
                            className={cn(
                                'p-1.5 rounded-md',
                                'text-text-tertiary hover:text-text-primary',
                                'hover:bg-bg-tertiary',
                                'transition-colors duration-150'
                            )}
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}

                    {!isFocused && !query && (
                        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-text-tertiary bg-bg-tertiary rounded border border-border-subtle">
                            <span className="text-[10px]">⌘</span>K
                        </kbd>
                    )}
                </div>
            </div>
        </div>
    )
}
