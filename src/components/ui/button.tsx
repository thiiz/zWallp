import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                primary:
                    'bg-accent-primary text-white hover:bg-accent-hover active:bg-accent-active shadow-sm hover:shadow-md',
                secondary:
                    'bg-bg-elevated text-text-primary border border-border-default hover:bg-bg-tertiary hover:border-border-strong',
                ghost: 'text-text-primary hover:bg-bg-tertiary active:bg-bg-secondary',
                danger: 'bg-error text-white hover:bg-error/90 active:bg-error/80 shadow-sm hover:shadow-md'
            },
            size: {
                sm: 'h-8 px-3 text-sm',
                md: 'h-10 px-4 text-base',
                lg: 'h-12 px-6 text-lg'
            }
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md'
        }
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
    loading?: boolean
    leftIcon?: LucideIcon
    rightIcon?: LucideIcon
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            loading = false,
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : 'button'

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {!loading && LeftIcon && <LeftIcon className="h-4 w-4" />}
                {children}
                {!loading && RightIcon && <RightIcon className="h-4 w-4" />}
            </Comp>
        )
    }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
