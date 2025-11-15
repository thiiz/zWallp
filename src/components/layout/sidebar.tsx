import {
    type LucideIcon,
    LayoutGrid,
    Compass,
    Heart,
    Settings,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip'

export interface NavigationItem {
    id: string
    label: string
    icon: LucideIcon
    path: string
    badge?: number
    shortcut?: string
}

interface SidebarProps {
    collapsed?: boolean
    onCollapsedChange?: (collapsed: boolean) => void
    activeItemId?: string
    onNavigate?: (item: NavigationItem) => void
    className?: string
}

const defaultNavigationItems: NavigationItem[] = [
    {
        id: 'library',
        label: 'Library',
        icon: LayoutGrid,
        path: '/',
        shortcut: 'Ctrl+1'
    },
    {
        id: 'discover',
        label: 'Discover',
        icon: Compass,
        path: '/discover',
        shortcut: 'Ctrl+2'
    },
    {
        id: 'favorites',
        label: 'Favorites',
        icon: Heart,
        path: '/favorites',
        shortcut: 'Ctrl+3'
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        path: '/settings',
        shortcut: 'Ctrl+,'
    }
]

export function Sidebar({
    collapsed = false,
    onCollapsedChange,
    activeItemId = 'library',
    onNavigate,
    className
}: SidebarProps) {
    const handleToggleCollapse = () => {
        onCollapsedChange?.(!collapsed)
    }

    const handleItemClick = (item: NavigationItem) => {
        onNavigate?.(item)
    }

    return (
        <div className={cn('flex flex-col h-full', className)}>
            {/* Logo Section */}
            <div
                className={cn(
                    'flex items-center gap-3 p-4 border-b border-border-subtle',
                    collapsed && 'justify-center'
                )}
            >
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-accent-primary to-accent-active flex items-center justify-center glow-accent">
                    <span className="text-white font-bold text-sm">W</span>
                </div>
                {!collapsed && (
                    <span className="font-semibold text-text-primary text-lg">
                        Wallpaper
                    </span>
                )}
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-2 space-y-1">
                {defaultNavigationItems.map((item) => {
                    const Icon = item.icon
                    const isActive = item.id === activeItemId

                    const button = (
                        <Button
                            key={item.id}
                            variant="ghost"
                            size={collapsed ? 'md' : 'md'}
                            onClick={() => handleItemClick(item)}
                            className={cn(
                                'w-full transition-all duration-200',
                                collapsed
                                    ? 'justify-center px-0'
                                    : 'justify-start',
                                isActive && [
                                    'bg-accent-primary/10 text-accent-primary',
                                    'border-l-2 border-accent-primary',
                                    'hover:bg-accent-primary/20'
                                ],
                                !isActive && 'hover:bg-bg-tertiary'
                            )}
                        >
                            <Icon
                                className={cn(
                                    'h-5 w-5',
                                    isActive && 'text-accent-primary'
                                )}
                            />
                            {!collapsed && (
                                <>
                                    <span className="flex-1 text-left">
                                        {item.label}
                                    </span>
                                    {item.badge !== undefined &&
                                        item.badge > 0 && (
                                            <span className="px-2 py-0.5 text-xs rounded-full bg-accent-primary text-white">
                                                {item.badge}
                                            </span>
                                        )}
                                </>
                            )}
                        </Button>
                    )

                    // Wrap in tooltip when collapsed
                    if (collapsed) {
                        return (
                            <Tooltip key={item.id}>
                                <TooltipTrigger asChild>
                                    {button}
                                </TooltipTrigger>
                                <TooltipContent
                                    side="right"
                                    className="flex items-center gap-2"
                                >
                                    <span>{item.label}</span>
                                    {item.shortcut && (
                                        <kbd className="px-2 py-1 text-xs bg-bg-elevated border border-border-default rounded">
                                            {item.shortcut}
                                        </kbd>
                                    )}
                                </TooltipContent>
                            </Tooltip>
                        )
                    }

                    return button
                })}
            </nav>

            {/* Keyboard Shortcuts Section (when expanded) */}
            {!collapsed && (
                <div className="p-4 border-t border-border-subtle">
                    <div className="text-xs text-text-tertiary mb-2">
                        Keyboard Shortcuts
                    </div>
                    <div className="space-y-1">
                        {defaultNavigationItems
                            .filter((item) => item.shortcut)
                            .slice(0, 3)
                            .map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between text-xs"
                                >
                                    <span className="text-text-secondary">
                                        {item.label}
                                    </span>
                                    <kbd className="px-1.5 py-0.5 bg-bg-elevated border border-border-default rounded text-text-tertiary">
                                        {item.shortcut}
                                    </kbd>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Collapse Toggle Button */}
            <div
                className={cn(
                    'p-2 border-t border-border-subtle',
                    collapsed && 'flex justify-center'
                )}
            >
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleCollapse}
                    className={cn('w-full', collapsed && 'px-0')}
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <>
                            <ChevronLeft className="h-4 w-4" />
                            <span className="flex-1 text-left text-sm">
                                Collapse
                            </span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

export { defaultNavigationItems }
