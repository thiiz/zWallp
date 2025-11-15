# Base UI Components

This directory contains the foundational UI components for the Wallpaper Engine application, implementing the design system specified in the requirements.

## Components

### Button

A versatile button component with multiple variants, sizes, loading states, and icon support.

**Variants:**

- `primary` - Main action button with accent color
- `secondary` - Secondary actions with subtle styling
- `ghost` - Minimal button for tertiary actions
- `danger` - Destructive actions (delete, remove)

**Sizes:**

- `sm` - Small (h-8, text-sm)
- `md` - Medium (h-10, text-base) - default
- `lg` - Large (h-12, text-lg)

**Features:**

- Loading state with spinner
- Left/right icon support
- Keyboard accessible
- Focus ring for accessibility

**Example:**

```tsx
import { Button } from '@/components/ui'
import { Play, Trash2 } from 'lucide-react'

<Button variant="primary" size="md" leftIcon={Play}>
  Apply Wallpaper
</Button>

<Button variant="danger" loading={isDeleting} onClick={handleDelete}>
  Delete
</Button>
```

### Input

Text input component with validation states, icons, and multiple types.

**Types:**

- `text` - Standard text input (default)
- `search` - Search input
- `number` - Numeric input

**States:**

- Default
- Error (with error message)
- Success (with success message)

**Sizes:**

- `sm` - Small (h-8)
- `md` - Medium (h-10) - default
- `lg` - Large (h-12)

**Features:**

- Left/right icon support
- Validation messages
- Keyboard accessible
- Focus ring for accessibility

**Example:**

```tsx
import { Input } from '@/components/ui'
import { Search } from 'lucide-react'

<Input
  placeholder="Search wallpapers..."
  leftIcon={Search}
/>

<Input
  placeholder="Name"
  error="Name is required"
/>
```

### Card

Container component with multiple variants and interactive states.

**Variants:**

- `default` - Standard card
- `elevated` - Card with shadow
- `glass` - Glass-morphism effect
- `glassStrong` - Stronger glass effect

**Elevation:**

- `none` - No shadow (default)
- `sm` - Small shadow
- `md` - Medium shadow
- `lg` - Large shadow
- `xl` - Extra large shadow

**Features:**

- Interactive mode with hover effects
- Composable sub-components (Header, Title, Description, Content, Footer)
- Smooth transitions

**Example:**

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

;<Card variant="glass" interactive>
    <CardHeader>
        <CardTitle>Wallpaper Name</CardTitle>
    </CardHeader>
    <CardContent>
        <p>Card content here</p>
    </CardContent>
</Card>
```

### Modal

Dialog component with backdrop blur, animations, and keyboard handling.

**Sizes:**

- `sm` - Small (max-w-sm)
- `md` - Medium (max-w-md) - default
- `lg` - Large (max-w-lg)
- `xl` - Extra large (max-w-xl)
- `full` - Full width with margin

**Features:**

- Backdrop blur effect
- Escape key to close
- Click backdrop to close (configurable)
- Smooth animations (zoom + slide)
- Body scroll lock when open
- Composable sub-components (Header, Title, Description, Content, Footer)

**Example:**

```tsx
import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalContent,
    ModalFooter
} from '@/components/ui'

;<Modal isOpen={isOpen} onClose={handleClose}>
    <ModalHeader>
        <ModalTitle>Add Wallpaper</ModalTitle>
    </ModalHeader>
    <ModalContent>
        <p>Modal content here</p>
    </ModalContent>
    <ModalFooter>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="primary">Save</Button>
    </ModalFooter>
</Modal>
```

### Toast

Notification system with multiple types, auto-dismiss, and swipe-to-dismiss.

**Types:**

- `success` - Success notifications (green)
- `error` - Error notifications (red)
- `warning` - Warning notifications (orange)
- `info` - Info notifications (blue)

**Features:**

- Auto-dismiss with progress bar
- Swipe-to-dismiss gesture (touch devices)
- Action button support
- Stacked notifications
- Smooth animations

**Usage:**

1. Wrap your app with `ToastProvider`:

```tsx
import { ToastProvider } from '@/lib/providers/toast-provider'

;<ToastProvider>
    <App />
</ToastProvider>
```

2. Use the toast hook:

```tsx
import { useToastContext } from '@/lib/providers/toast-provider'

function MyComponent() {
    const toast = useToastContext()

    const handleSuccess = () => {
        toast.success('Wallpaper applied!', {
            message: 'Your desktop has been updated.',
            duration: 5000
        })
    }

    const handleError = () => {
        toast.error('Failed to apply wallpaper', {
            message: 'Please try again.',
            action: {
                label: 'Retry',
                handler: () => retryApply()
            }
        })
    }

    return <Button onClick={handleSuccess}>Apply</Button>
}
```

## Design Tokens

All components use the design tokens defined in `src/app/global.css`:

**Colors:**

- Background: `bg-primary`, `bg-secondary`, `bg-tertiary`, `bg-elevated`
- Accent: `accent-primary`, `accent-hover`, `accent-active`
- Text: `text-primary`, `text-secondary`, `text-tertiary`, `text-disabled`
- Semantic: `success`, `error`, `warning`, `info`
- Borders: `border-subtle`, `border-default`, `border-strong`

**Animations:**

- Duration: `transition-fast` (150ms), `transition-normal` (250ms), `transition-slow` (350ms)
- Easing: `transition-ease-default`, `transition-ease-spring`

**Effects:**

- Glass-morphism: `glass`, `glass-strong`
- Glow: `glow-accent`, `glow-accent-strong`

## Accessibility

All components follow accessibility best practices:

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Screen reader compatible
- Color contrast compliance (WCAG AA)

## Demo

To see all components in action, import and render the demo component:

```tsx
import { UIComponentsDemo } from '@/components/ui/demo'

;<UIComponentsDemo />
```

## Requirements Mapping

These components fulfill the following requirements from the spec:

- **Requirement 1.4, 1.5**: Consistent design system with defined spacing, typography, and colors
- **Requirement 7.1**: Quick action buttons with clear visual feedback
- **Requirement 7.3, 7.4**: Toast notifications for success/error states
- **Requirement 8.1**: Modal component for adding wallpapers
- **Requirement 8.5**: Input components with validation
- **Requirement 11.1**: Smooth animations and transitions
- **Requirement 12.1, 12.2**: Keyboard navigation and ARIA labels
