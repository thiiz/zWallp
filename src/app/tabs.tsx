import { useState, useRef } from 'react'
import { WallpaperManager } from '@/features/wallpaper'

type Tab = {
    id: string
    title: string
    content: React.ReactNode
}

const defaultTabs: Tab[] = [
    {
        id: 'home',
        title: 'Home',
        content: <WallpaperManager />
    }
]

const MIN_WIDTH = 200
const MAX_WIDTH = 300
const DEFAULT_WIDTH = 250

export default function AppTabs() {
    const [tabs, setTabs] = useState<Tab[]>(defaultTabs)
    const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id)
    const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH)
    const [isResizing, setIsResizing] = useState(false)
    const sidebarRef = useRef<HTMLDivElement>(null)

    const activeTab = tabs.find((tab) => tab.id === activeTabId)

    const closeTab = (tabId: string) => {
        if (tabs.length === 1) return

        const newTabs = tabs.filter((tab) => tab.id !== tabId)
        setTabs(newTabs)

        if (activeTabId === tabId) {
            setActiveTabId(newTabs[0].id)
        }
    }

    const handleMouseDown = () => {
        setIsResizing(true)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isResizing) return

        const newWidth = e.clientX
        if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
            setSidebarWidth(newWidth)
        }
    }

    const handleMouseUp = () => {
        setIsResizing(false)
    }

    return (
        <div
            className="flex h-screen bg-zinc-900 text-white"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className="flex flex-col bg-zinc-950 border-r border-zinc-800"
                style={{ width: `${sidebarWidth}px` }}
            >
                {/* Tabs List */}
                <div className="flex-1 overflow-y-auto">
                    {tabs.map((tab) => (
                        <div
                            key={tab.id}
                            className={`
                                flex items-center justify-between px-4 py-3 cursor-pointer
                                border-b border-zinc-800
                                ${
                                    activeTabId === tab.id
                                        ? 'bg-zinc-800 border-l-2 border-l-blue-500'
                                        : 'hover:bg-zinc-900'
                                }
                            `}
                            onClick={() => setActiveTabId(tab.id)}
                        >
                            <span className="truncate">{tab.title}</span>
                            {tabs.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        closeTab(tab.id)
                                    }}
                                    className="ml-2 text-zinc-400 hover:text-red-400 text-xl leading-none"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Resize Handle */}
            <div
                className={`
                    w-1 cursor-col-resize hover:bg-blue-500 transition-colors
                    ${isResizing ? 'bg-blue-500' : 'bg-transparent'}
                `}
                onMouseDown={handleMouseDown}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-zinc-900">
                {activeTab?.content}
            </div>
        </div>
    )
}
