import { type ClassValue } from 'clsx'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './tailwind'

/**
 * Utility for creating component variants with class-variance-authority
 *
 * This provides a type-safe way to define component variants and their styles.
 *
 * @example
 * const buttonVariants = createVariants({
 *   base: 'px-4 py-2 rounded',
 *   variants: {
 *     variant: {
 *       primary: 'bg-blue-500 text-white',
 *       secondary: 'bg-gray-500 text-white',
 *     },
 *     size: {
 *       sm: 'text-sm',
 *       md: 'text-base',
 *       lg: 'text-lg',
 *     },
 *   },
 *   defaultVariants: {
 *     variant: 'primary',
 *     size: 'md',
 *   },
 * })
 */
export const createVariants = cva

/**
 * Type helper for extracting variant props from a cva definition
 */
export type { VariantProps }

/**
 * Utility for composing multiple class values with proper merging
 * Re-exported from tailwind utils for convenience
 */
export { cn }

/**
 * Helper to create a component with variants
 *
 * @example
 * const button = withVariants({
 *   base: 'px-4 py-2 rounded',
 *   variants: {
 *     variant: {
 *       primary: 'bg-blue-500',
 *       secondary: 'bg-gray-500',
 *     },
 *   },
 * })
 */
export function withVariants(config: {
    base: string
    variants?: any
    defaultVariants?: any
}) {
    const { base, variants, defaultVariants } = config
    return cva(base, { variants, defaultVariants } as any)
}

/**
 * Utility to conditionally apply classes based on a condition
 *
 * @example
 * const classes = conditionalClass(isActive, 'bg-blue-500', 'bg-gray-500')
 */
export function conditionalClass(
    condition: boolean,
    trueClass: ClassValue,
    falseClass?: ClassValue
): ClassValue {
    return condition ? trueClass : falseClass
}

/**
 * Utility to apply classes based on multiple conditions
 *
 * @example
 * const classes = multiConditionalClass({
 *   'bg-blue-500': isActive,
 *   'bg-red-500': hasError,
 *   'bg-gray-500': true, // default
 * })
 */
export function multiConditionalClass(
    conditions: Record<string, boolean>
): ClassValue[] {
    return Object.entries(conditions)
        .filter(([, condition]) => condition)
        .map(([className]) => className)
}

/**
 * Utility to create responsive variants
 *
 * @example
 * const responsiveClass = responsive({
 *   base: 'text-sm',
 *   sm: 'text-base',
 *   md: 'text-lg',
 *   lg: 'text-xl',
 * })
 */
export function responsive(classes: {
    base?: ClassValue
    sm?: ClassValue
    md?: ClassValue
    lg?: ClassValue
    xl?: ClassValue
}): ClassValue {
    return cn(
        classes.base,
        classes.sm && `sm:${classes.sm}`,
        classes.md && `md:${classes.md}`,
        classes.lg && `lg:${classes.lg}`,
        classes.xl && `xl:${classes.xl}`
    )
}

/**
 * Utility to create focus-visible styles
 * Standard focus ring for accessibility
 */
export const focusRing = cn(
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-accent-primary',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-offset-bg-primary'
)

/**
 * Utility for disabled state styles
 */
export const disabledStyles = cn(
    'disabled:opacity-50',
    'disabled:pointer-events-none',
    'disabled:cursor-not-allowed'
)

/**
 * Common transition styles
 */
export const transitions = {
    fast: 'transition-fast transition-ease-default',
    normal: 'transition-normal transition-ease-default',
    slow: 'transition-slow transition-ease-default',
    spring: 'transition-normal transition-ease-spring',
    colors: 'transition-colors duration-200',
    transform: 'transition-transform duration-200',
    all: 'transition-all duration-200'
} as const
