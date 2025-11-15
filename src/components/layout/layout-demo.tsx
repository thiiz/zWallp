import { useState } from 'react'
import { AppLayout } from '@/components/app-layout'
import {
    Sidebar,
    TopBar,
    type NavigationItem,
    type ViewMode
} from '@/components/layout'

/**
 * Demo component showing how to use the new layout structure
 *
 * This demonstrates:
 * - AppLayout with sidebar and preview panel
 * - Sidebar with navigation and collapse functionality
 * - TopBar with search, view mode toggle, and settings
 * - Layout preferences persistence
 */
export function LayoutDemo() {
    const [activeItemId, setActiveItemId] = useState('library')
    const [searchQuery, setSearchQuery] = useState('')
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [previewPanelOpen, setPreviewPanelOpen] = useState(false)

    const handleNavigate = (item: NavigationItem) => {
        setActiveItemId(item.id)
        console.log('Navigate to:', item.path)
    }

    const handleSettingsClick = () => {
        setActiveItemId('settings')
        console.log('Open settings')
    }

    return (
        <AppLayout
            sidebarCollapsed={sidebarCollapsed}
            onSidebarCollapsedChange={setSidebarCollapsed}
            previewPanelOpen={previewPanelOpen}
            onPreviewPanelOpenChange={setPreviewPanelOpen}
            sidebar={
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onCollapsedChange={setSidebarCollapsed}
                    activeItemId={activeItemId}
                    onNavigate={handleNavigate}
                />
            }
            previewPanel={
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Preview Panel
                    </h2>
                    <p className="text-text-secondary">
                        This is where wallpaper previews will be displayed.
                    </p>
                </div>
            }
        >
            {/* TopBar */}
            <TopBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onSettingsClick={handleSettingsClick}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">
                        Wallpaper Library
                    </h1>
                    <p className="text-text-secondary mb-6">
                        Active view: {activeItemId} | Search: "{searchQuery}" |
                        View mode: {viewMode}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="aspect-video rounded-lg bg-bg-secondary border border-border-default flex items-center justify-center cursor-pointer hover:border-accent-primary transition-colors"
                                onClick={() =>
                                    setPreviewPanelOpen(!previewPanelOpen)
                                }
                            >
                                <span className="text-text-tertiary">
                                    Wallpaper {i}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
