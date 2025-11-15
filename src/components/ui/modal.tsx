import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    className?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    closeOnBackdrop?: boolean
    closeOnEscape?: boolean
    showCloseButton?: boolean
}

const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
    (
        {
            isOpen,
            onClose,
            children,
            className,
            size = 'md',
            closeOnBackdrop = true,
            closeOnEscape = true,
            showCloseButton = true
        },
        ref
    ) => {
        // Handle escape key
        useEffect(() => {
            if (!isOpen || !closeOnEscape) return

            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    onClose()
                }
            }

            document.addEventListener('keydown', handleEscape)
            return () => document.removeEventListener('keydown', handleEscape)
        }, [isOpen, closeOnEscape, onClose])

        // Prevent body scroll when modal is open
        useEffect(() => {
            if (isOpen) {
                document.body.style.overflow = 'hidden'
            } else {
                document.body.style.overflow = ''
            }

            return () => {
                document.body.style.overflow = ''
            }
        }, [isOpen])

        if (!isOpen) return null

        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center"
                role="dialog"
                aria-modal="true"
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={closeOnBackdrop ? onClose : undefined}
                    aria-hidden="true"
                />

                {/* Modal Content */}
                <div
                    ref={ref}
                    className={cn(
                        'relative z-10 w-full animate-in zoom-in-95 slide-in-from-bottom-4 duration-200',
                        sizeClasses[size],
                        className
                    )}
                >
                    <div className="glass-strong rounded-xl border border-border-default shadow-2xl">
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 rounded-lg p-1 text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                                aria-label="Close modal"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                        {children}
                    </div>
                </div>
            </div>
        )
    }
)
Modal.displayName = 'Modal'

const ModalHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex flex-col space-y-2 p-6 pb-4', className)}
        {...props}
    />
))
ModalHeader.displayName = 'ModalHeader'

const ModalTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h2
        ref={ref}
        className={cn('text-2xl font-semibold text-text-primary', className)}
        {...props}
    />
))
ModalTitle.displayName = 'ModalTitle'

const ModalDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn('text-sm text-text-secondary', className)}
        {...props}
    />
))
ModalDescription.displayName = 'ModalDescription'

const ModalContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
ModalContent.displayName = 'ModalContent'

const ModalFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'flex items-center justify-end gap-3 p-6 pt-4',
            className
        )}
        {...props}
    />
))
ModalFooter.displayName = 'ModalFooter'

export {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalContent,
    ModalFooter
}
