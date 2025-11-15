# Design System Documentation

This document describes the design system foundation for the Wallpaper Engine UI refactor.

## Overview

The design system provides a consistent set of design tokens, utilities, and patterns for building the UI. It includes:

- **Design Tokens**: Colors, typography, spacing, and animations
- **Tailwind Configuration**: Custom theme extending the design tokens
- **Utility Functions**: For className merging and component variants

## Design Tokens

All design tokens are defined in `src/lib/design-tokens.ts` and can be imported as:

```typescript
import {
    designTokens,
    colors,
    typography,
    spacing,
    animations,
    layout
} from '@/lib/design-tokens'
```

### Colors

The color system is based on HSL values for easy manipulation:

- **Background**: `primary`, `secondary`, `tertiary`, `elevated`
- **Accent**: `primary`, `hover`, `active`
- **Text**: `primary`, `secondary`, `tertiary`, `disabled`
- **Semantic**: `success`, `error`, `warning`, `info`
- **Borders**: `subtle`, `default`, `strong`

### Typography

- **Font Families**: `sans` (Inter), `mono` (JetBrains Mono)
- **Font Sizes**: `xs` to `3xl`
- **Font Weights**: `normal`, `medium`, `semibold`, `bold`
- **Line Heights**: `tight`, `normal`, `relaxed`

### Spacing

Consistent spacing scale from `0` to `16` (0px to 64px).

### Animations

- **Durations**: `fast` (150ms), `normal` (250ms), `slow` (350ms)
- **Easing**: `default`, `in`, `out`, `spring`

## Tailwind CSS Integration

The design tokens are integrated into Tailwind CSS via CSS custom properties in `src/app/global.css`.

### Using Tailwind Classes

```tsx
// Background colors
<div className="bg-bg-primary">...</div>
<div className="bg-bg-secondary">...</div>

// Text colors
<div className="text-text-primary">...</div>
<div className="text-text-secondary">...</div>

// Accent colors
<button className="bg-accent-primary hover:bg-accent-hover">...</button>

// Borders
<div className="border border-border-default">...</div>
```

### Custom Utilities

#### Animation Utilities

```tsx
// Duration
<div className="animate-duration-fast">...</div>
<div className="animate-duration-normal">...</div>
<div className="animate-duration-slow">...</div>

// Easing
<div className="animate-ease-spring">...</div>

// Transitions
<div className="transition-fast transition-ease-default">...</div>
```

#### Glass-morphism

```tsx
<div className="glass">...</div>
<div className="glass-strong">...</div>
```

#### Glow Effects

```tsx
<div className="glow-accent">...</div>
<div className="glow-accent-strong">...</div>
```

## Utility Functions

### cn() - ClassName Merging

Combines multiple class names and handles Tailwind conflicts:

```tsx
import { cn } from '@/lib/utils'

;<div className={cn('p-4 bg-blue-500', isActive && 'bg-red-500')}>...</div>
```

### createVariants() - Component Variants

Create type-safe component variants using class-variance-authority:

```tsx
import { createVariants } from '@/lib/utils'

const buttonVariants = createVariants({
  base: 'px-4 py-2 rounded',
  variants: {
    variant: {
      primary: 'bg-accent-primary text-white',
      secondary: 'bg-bg-tertiary text-text-primary',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

// Use in component
<button className={buttonVariants({ variant: 'primary', size: 'lg' })}>
  Click me
</button>
```

### conditionalClass() - Conditional Styling

Apply classes based on conditions:

```tsx
import { conditionalClass } from '@/lib/utils'

;<div className={conditionalClass(isActive, 'bg-blue-500', 'bg-gray-500')}>
    ...
</div>
```

### Pre-defined Utilities

```tsx
import { focusRing, disabledStyles, transitions } from '@/lib/utils'

// Focus ring for accessibility
<button className={cn('px-4 py-2', focusRing)}>...</button>

// Disabled styles
<button className={cn('px-4 py-2', disabledStyles)}>...</button>

// Transitions
<div className={transitions.spring}>...</div>
<div className={transitions.colors}>...</div>
```

## Component Patterns

### Creating a Component with Variants

```tsx
import { createVariants, cn, focusRing, type VariantProps } from '@/lib/utils'

const cardVariants = createVariants({
    base: cn('rounded-lg border transition-normal', focusRing),
    variants: {
        variant: {
            default: 'bg-bg-secondary border-border-default',
            elevated: 'bg-bg-elevated border-border-subtle shadow-lg',
            glass: 'glass border-border-subtle'
        },
        padding: {
            none: '',
            sm: 'p-3',
            md: 'p-4',
            lg: 'p-6'
        }
    },
    defaultVariants: {
        variant: 'default',
        padding: 'md'
    }
})

interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof cardVariants> {}

export function Card({ variant, padding, className, ...props }: CardProps) {
    return (
        <div
            className={cn(cardVariants({ variant, padding }), className)}
            {...props}
        />
    )
}
```

## Best Practices

1. **Use design tokens** instead of hardcoded values
2. **Use Tailwind classes** for styling when possible
3. **Use cn()** for combining class names to handle conflicts
4. **Create variants** for components with multiple styles
5. **Use semantic color names** (e.g., `bg-primary` instead of `bg-gray-900`)
6. **Include focus states** for accessibility
7. **Use transitions** for smooth animations
8. **Respect reduced motion** preferences

## Examples

See `src/lib/design-system-example.tsx` for complete working examples of all patterns.

## Dark Mode

The design system is dark-mode first. All color tokens automatically adapt to the `.dark` class on the root element.

## Performance

- All utilities use CSS custom properties for runtime theme switching
- Tailwind CSS purges unused styles in production
- Animations use GPU-accelerated properties (transform, opacity)
- Glass-morphism effects use backdrop-filter for performance

## Accessibility

- All interactive elements include focus states
- Color contrast ratios meet WCAG AA standards
- Reduced motion preferences are respected
- Semantic HTML is encouraged
