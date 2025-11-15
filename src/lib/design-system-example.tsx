/**
 * Design System Usage Examples
 *
 * This file demonstrates how to use the design tokens and utilities
 * in your components. This is for reference only and can be deleted.
 */

import { designTokens } from './design-tokens'
import {
    cn,
    createVariants,
    conditionalClass,
    transitions,
    focusRing
} from './utils/variants'

// Example 1: Using design tokens directly
export function ExampleWithTokens() {
    return (
        <div
            style={{
                backgroundColor: designTokens.colors.background.primary,
                color: designTokens.colors.text.primary,
                padding: designTokens.spacing[4],
                fontFamily: designTokens.typography.fontFamily.sans
            }}
        >
            Using design tokens directly
        </div>
    )
}

// Example 2: Using Tailwind classes with design tokens
export function ExampleWithTailwind() {
    return (
        <div className="bg-bg-primary text-text-primary p-4 rounded-lg">
            Using Tailwind with custom design tokens
        </div>
    )
}

// Example 3: Creating component variants with CVA
const buttonVariants = createVariants({
    base: cn(
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-normal transition-ease-default',
        focusRing,
        'disabled:opacity-50 disabled:pointer-events-none'
    ),
    variants: {
        variant: {
            primary:
                'bg-accent-primary text-white hover:bg-accent-hover active:bg-accent-active',
            secondary: 'bg-bg-tertiary text-text-primary hover:bg-bg-elevated',
            ghost: 'hover:bg-bg-secondary text-text-primary',
            danger: 'bg-error text-white hover:opacity-90'
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
})

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
}

export function Button({
    variant,
    size,
    isLoading,
    className,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(buttonVariants({ variant, size }), className)}
            {...props}
        >
            {isLoading ? 'Loading...' : children}
        </button>
    )
}

// Example 4: Using conditional classes
export function ExampleWithConditional({ isActive }: { isActive: boolean }) {
    return (
        <div
            className={cn(
                'p-4 rounded-lg',
                conditionalClass(
                    isActive,
                    'bg-accent-primary text-white',
                    'bg-bg-secondary text-text-secondary'
                )
            )}
        >
            Conditional styling
        </div>
    )
}

// Example 5: Using animation utilities
export function ExampleWithAnimations() {
    return (
        <div
            className={cn(
                'p-4 rounded-lg bg-bg-secondary',
                transitions.spring,
                'hover:scale-105'
            )}
        >
            Hover me for spring animation
        </div>
    )
}

// Example 6: Using glass-morphism effect
export function ExampleWithGlass() {
    return (
        <div className="glass p-6 rounded-xl border border-border-subtle">
            Glass-morphism effect with backdrop blur
        </div>
    )
}

// Example 7: Using glow effects
export function ExampleWithGlow() {
    return (
        <div className="p-4 rounded-lg bg-accent-primary text-white glow-accent">
            Card with accent glow
        </div>
    )
}
