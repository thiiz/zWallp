import { ReactNode } from 'react'
import { Titlebar } from './titlebar'

interface AppLayoutProps {
    children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex h-screen flex-col bg-zinc-900 text-white overflow-hidden">
            {/* Fixed Titlebar */}
            <div className="flex-none z-50">
                <Titlebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-h-0">{children}</div>
        </div>
    )
}
