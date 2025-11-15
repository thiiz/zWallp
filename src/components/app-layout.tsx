import { ReactNode, useState, useEffect } from 'react'
import { Titlebar } from './titlebar'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
    children: ReactNode
    sidebar?: ReactNode
    previewPanel?: ReactNode
    sidebarCollapsed?: boolean
    previewPanelOpen?: boolean
    onSidebarCollapsedChange?: (collapsed: boolean) => void
    onPreviewPanelOpenChange?: (open: boolean) => void
}

interface LayoutPreferences {
    sidebarCollapsed: boolean
    previewPanelOpen: boolean
}

const LAYOUT_PREFERENCES_KEY = 'wallpaper-engine-layout-preferences'

function loadLayoutPreferences(): LayoutPreferences {
    try {
        const stored = localStorage.getItem(LAYOUT_PREFERENCES_KEY)
        if (stored) {
            return JSON.parse(stored)
        }
    } catch (error) {
        console.error('Failed to load layout preferences:', error)
    }
    return {
        sidebarCollapsed: false,
        previewPanelOpen: false
    }
}

function saveLayoutPreferences(preferences: LayoutPreferences): void {
    try {
        localStorage.setItem(
            LAYOUT_PREFERENCES_KEY,
            JSON.stringify(preferences)
        )
    } catch (error) {
        console.error('Failed to save layout preferences:', error)
    }
}

export function AppLayout({
    children,
    sidebar,
    previewPanel,
    sidebarCollapsed: controlledSidebarCollapsed,
    previewPanelOpen: controlledPreviewPanelOpen,
    onSidebarCollapsedChange,
    onPreviewPanelOpenChange
}: AppLayoutProps) {
    // Load preferences from localStorage on mount
    const [preferences, setPreferences] = useState<LayoutPreferences>(
        loadLayoutPreferences
    )

    // Use controlled props if provided, otherwise use internal state
    const sidebarCollapsed =
        controlledSidebarCollapsed ?? preferences.sidebarCollapsed
    const previewPanelOpen =
        controlledPreviewPanelOpen ?? preferences.previewPanelOpen

    // Update internal state and persist to localStorage
    const handleSidebarCollapsedChange = (collapsed: boolean) => {
        const newPreferences = { ...preferences, sidebarCollapsed: collapsed }
        setPreferences(newPreferences)
        saveLayoutPreferences(newPreferences)
        onSidebarCollapsedChange?.(collapsed)
    }

    const handlePreviewPanelOpenChange = (open: boolean) => {
        const newPreferences = { ...preferences, previewPanelOpen: open }
        setPreferences(newPreferences)
        saveLayoutPreferences(newPreferences)
        onPreviewPanelOpenChange?.(open)
    }

    // Expose handler for future use
    void handlePreviewPanelOpenChange

    // Auto-collapse sidebar on small screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768 && !sidebarCollapsed) {
                handleSidebarCollapsedChange(true)
            }
        }

        handleResize() // Check on mount
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [sidebarCollapsed])

    return (
        <div className="flex h-screen flex-col bg-bg-primary text-text-primary overflow-hidden">
            {/* Fixed Titlebar */}
            <div className="flex-none z-50">
                <Titlebar />
            </div>

            {/* Main Layout */}
            <div className="flex flex-1 min-h-0">
                {/* Sidebar */}
                {sidebar && (
                    <aside
                        className={cn(
                            'flex-none border-r border-border-subtle bg-bg-secondary transition-all duration-300 ease-out',
                            sidebarCollapsed ? 'w-16' : 'w-60'
                        )}
                    >
                        {sidebar}
                    </aside>
                )}

                {/* Main Content Area */}
                <main className="flex-1 min-w-0 flex flex-col">{children}</main>

                {/* Preview Panel */}
                {previewPanel && (
                    <aside
                        className={cn(
                            'flex-none border-l border-border-subtle bg-bg-secondary transition-all duration-300 ease-out overflow-hidden',
                            previewPanelOpen ? 'w-96' : 'w-0'
                        )}
                    >
                        <div
                            className={cn(
                                'w-96 h-full',
                                !previewPanelOpen && 'opacity-0'
                            )}
                        >
                            {previewPanel}
                        </div>
                    </aside>
                )}
            </div>
        </div>
    )
}

// Export helper functions for external use
export { loadLayoutPreferences, saveLayoutPreferences }
export type { LayoutPreferences }
