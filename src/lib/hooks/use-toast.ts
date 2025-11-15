import { useState, useCallback } from 'react'
import type { Toast, ToastType } from '@/components/ui/toast'

let toastCounter = 0

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = useCallback(
        (
            type: ToastType,
            title: string,
            options?: {
                message?: string
                duration?: number
                action?: {
                    label: string
                    handler: () => void
                }
            }
        ) => {
            const id = `toast-${++toastCounter}`
            const newToast: Toast = {
                id,
                type,
                title,
                message: options?.message,
                duration: options?.duration ?? 5000,
                action: options?.action
            }

            setToasts((prev) => [...prev, newToast])
            return id
        },
        []
    )

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, [])

    const success = useCallback(
        (title: string, options?: Parameters<typeof addToast>[2]) => {
            return addToast('success', title, options)
        },
        [addToast]
    )

    const error = useCallback(
        (title: string, options?: Parameters<typeof addToast>[2]) => {
            return addToast('error', title, options)
        },
        [addToast]
    )

    const warning = useCallback(
        (title: string, options?: Parameters<typeof addToast>[2]) => {
            return addToast('warning', title, options)
        },
        [addToast]
    )

    const info = useCallback(
        (title: string, options?: Parameters<typeof addToast>[2]) => {
            return addToast('info', title, options)
        },
        [addToast]
    )

    const dismissAll = useCallback(() => {
        setToasts([])
    }, [])

    return {
        toasts,
        addToast,
        dismissToast,
        success,
        error,
        warning,
        info,
        dismissAll
    }
}
