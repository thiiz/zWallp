import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

const inputVariants = cva(
    'flex w-full rounded-lg border bg-bg-elevated px-3 py-2 text-base text-text-primary transition-all duration-200 placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            variant: {
                default:
                    'border-border-default focus-visible:border-accent-primary focus-visible:ring-accent-primary',
                error: 'border-error focus-visible:border-error focus-visible:ring-error',
                success:
                    'border-success focus-visible:border-success focus-visible:ring-success'
            },
            inputSize: {
                sm: 'h-8 text-sm px-2',
                md: 'h-10 text-base px-3',
                lg: 'h-12 text-lg px-4'
            }
        },
        defaultVariants: {
            variant: 'default',
            inputSize: 'md'
        }
    }
)

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
        VariantProps<typeof inputVariants> {
    leftIcon?: LucideIcon
    rightIcon?: LucideIcon
    error?: string
    success?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            variant,
            inputSize,
            type = 'text',
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            error,
            success,
            ...props
        },
        ref
    ) => {
        // Determine variant based on error/success props
        const effectiveVariant = error ? 'error' : success ? 'success' : variant

        const hasIcon = LeftIcon || RightIcon

        return (
            <div className="w-full">
                <div className="relative">
                    {LeftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                            <LeftIcon className="h-4 w-4" />
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            inputVariants({
                                variant: effectiveVariant,
                                inputSize,
                                className
                            }),
                            LeftIcon && 'pl-10',
                            RightIcon && 'pr-10'
                        )}
                        ref={ref}
                        {...props}
                    />
                    {RightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                            <RightIcon className="h-4 w-4" />
                        </div>
                    )}
                </div>
                {error && <p className="mt-1 text-sm text-error">{error}</p>}
                {success && !error && (
                    <p className="mt-1 text-sm text-success">{success}</p>
                )}
            </div>
        )
    }
)
Input.displayName = 'Input'

export { Input, inputVariants }
