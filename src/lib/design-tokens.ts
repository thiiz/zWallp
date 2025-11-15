/**
 * Design Tokens for Wallpaper Engine UI
 *
 * This file contains all design tokens including colors, typography, spacing, and animations.
 * These tokens are used throughout the application to maintain consistency.
 */

export const colors = {
    // Base colors
    background: {
        primary: 'hsl(240, 10%, 8%)', // #13141a
        secondary: 'hsl(240, 10%, 11%)', // #1a1b23
        tertiary: 'hsl(240, 10%, 14%)', // #21222c
        elevated: 'hsl(240, 10%, 16%)' // #26272f
    },

    // Accent colors
    accent: {
        primary: 'hsl(250, 95%, 65%)', // #6366f1 (indigo)
        hover: 'hsl(250, 95%, 70%)',
        active: 'hsl(250, 95%, 60%)'
    },

    // Text colors
    text: {
        primary: 'hsl(0, 0%, 98%)', // #fafafa
        secondary: 'hsl(0, 0%, 70%)', // #b3b3b3
        tertiary: 'hsl(0, 0%, 50%)', // #808080
        disabled: 'hsl(0, 0%, 30%)' // #4d4d4d
    },

    // Semantic colors
    success: 'hsl(142, 76%, 36%)', // #16a34a
    error: 'hsl(0, 84%, 60%)', // #ef4444
    warning: 'hsl(38, 92%, 50%)', // #f59e0b
    info: 'hsl(199, 89%, 48%)', // #0ea5e9

    // Borders and dividers
    border: {
        subtle: 'hsl(240, 10%, 20%)',
        default: 'hsl(240, 10%, 25%)',
        strong: 'hsl(240, 10%, 30%)'
    }
} as const

export const typography = {
    fontFamily: {
        sans: 'Inter, system-ui, -apple-system, sans-serif',
        mono: 'JetBrains Mono, monospace'
    },

    fontSize: {
        xs: '0.75rem', // 12px
        sm: '0.875rem', // 14px
        base: '1rem', // 16px
        lg: '1.125rem', // 18px
        xl: '1.25rem', // 20px
        '2xl': '1.5rem', // 24px
        '3xl': '1.875rem' // 30px
    },

    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
    },

    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75
    }
} as const

export const spacing = {
    0: '0',
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    16: '4rem' // 64px
} as const

export const animations = {
    duration: {
        fast: '150ms',
        normal: '250ms',
        slow: '350ms'
    },

    easing: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    }
} as const

// Layout constants
export const layout = {
    sidebar: {
        expanded: '240px',
        collapsed: '64px'
    },
    previewPanel: {
        width: '400px'
    },
    minWindowSize: {
        width: '600px',
        height: '400px'
    },
    breakpoints: {
        mobile: '768px',
        tablet: '1024px',
        desktop: '1280px'
    }
} as const

// Export all tokens as a single object
export const designTokens = {
    colors,
    typography,
    spacing,
    animations,
    layout
} as const

export type DesignTokens = typeof designTokens
