import React, { createContext, useContext } from 'react'
import { ToastContainer } from '@/components/ui/toast'
import { useToast } from '@/lib/hooks/use-toast'

type ToastContextType = ReturnType<typeof useToast>

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const toast = useToast()

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer
                toasts={toast.toasts}
                onDismiss={toast.dismissToast}
            />
        </ToastContext.Provider>
    )
}

export function useToastContext() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToastContext must be used within ToastProvider')
    }
    return context
}
