import React, { useEffect, useState } from 'react'
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
    id: string
    type: ToastType
    title: string
    message?: string
    duration?: number
    action?: {
        label: string
        handler: () => void
    }
}

interface ToastItemProps {
    toast: Toast
    onDismiss: (id: string) => void
}

const toastIcons = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
}

const toastStyles = {
    success: 'border-success/50 bg-success/10',
    error: 'border-error/50 bg-error/10',
    warning: 'border-warning/50 bg-warning/10',
    info: 'border-info/50 bg-info/10'
}

const toastIconColors = {
    success: 'text-success',
    error: 'text-error',
    warning: 'text-warning',
    info: 'text-info'
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
    const [progress, setProgress] = useState(100)
    const [startX, setStartX] = useState<number | null>(null)
    const [offsetX, setOffsetX] = useState(0)
    const [isDismissing, setIsDismissing] = useState(false)

    const Icon = toastIcons[toast.type]
    const duration = toast.duration ?? 5000

    useEffect(() => {
        if (duration <= 0) return

        const startTime = Date.now()
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
            setProgress(remaining)

            if (remaining === 0) {
                handleDismiss()
            }
        }, 16)

        return () => clearInterval(interval)
    }, [duration])

    const handleDismiss = () => {
        setIsDismissing(true)
        setTimeout(() => onDismiss(toast.id), 200)
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartX(e.touches[0].clientX)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (startX === null) return
        const currentX = e.touches[0].clientX
        const diff = currentX - startX
        if (diff > 0) {
            setOffsetX(diff)
        }
    }

    const handleTouchEnd = () => {
        if (offsetX > 100) {
            handleDismiss()
        } else {
            setOffsetX(0)
        }
        setStartX(null)
    }

    return (
        <div
            className={cn(
                'relative w-full max-w-sm overflow-hidden rounded-lg border glass-strong shadow-lg transition-all duration-200',
                toastStyles[toast.type],
                isDismissing && 'animate-out slide-out-to-right fade-out',
                !isDismissing && 'animate-in slide-in-from-right fade-in'
            )}
            style={{ transform: `translateX(${offsetX}px)` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            role="alert"
        >
            <div className="flex items-start gap-3 p-4">
                <Icon
                    className={cn(
                        'h-5 w-5 shrink-0 mt-0.5',
                        toastIconColors[toast.type]
                    )}
                />

                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary">
                        {toast.title}
                    </p>
                    {toast.message && (
                        <p className="mt-1 text-sm text-text-secondary">
                            {toast.message}
                        </p>
                    )}
                    {toast.action && (
                        <button
                            onClick={() => {
                                toast.action!.handler()
                                handleDismiss()
                            }}
                            className="mt-2 text-sm font-medium text-accent-primary hover:text-accent-hover transition-colors"
                        >
                            {toast.action.label}
                        </button>
                    )}
                </div>

                <button
                    onClick={handleDismiss}
                    className="shrink-0 rounded-lg p-1 text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                    aria-label="Dismiss notification"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Progress bar */}
            {duration > 0 && (
                <div className="absolute bottom-0 left-0 h-1 w-full bg-bg-tertiary/30">
                    <div
                        className={cn(
                            'h-full transition-all',
                            toastIconColors[toast.type].replace('text-', 'bg-')
                        )}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    )
}

interface ToastContainerProps {
    toasts: Toast[]
    onDismiss: (id: string) => void
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
    toasts,
    onDismiss
}) => {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            <div className="flex flex-col gap-2 pointer-events-auto">
                {toasts.map((toast) => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onDismiss={onDismiss}
                    />
                ))}
            </div>
        </div>
    )
}
