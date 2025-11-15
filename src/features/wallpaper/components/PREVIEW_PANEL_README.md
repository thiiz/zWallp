# PreviewPanel Component

The PreviewPanel is an enhanced wallpaper preview component that provides a comprehensive interface for viewing, editing, and managing wallpapers. It slides in from the right side of the screen with a glass-morphism effect.

## Features

### 5.1 PreviewPanel Structure ✅

- **Slide-in animation**: Smooth slide-in from right with spring easing
- **Collapsible functionality**: Can be collapsed/expanded
- **Glass-morphism background**: Modern frosted glass effect with backdrop blur
- **Backdrop overlay**: Semi-transparent backdrop when open

### 5.2 PreviewMedia Component ✅

- **Video player with controls**: Play/pause, volume control, mute toggle
- **Image viewer with zoom**: Zoom in/out (0.5x to 3x), fullscreen support
- **HTML iframe preview**: Safe iframe rendering with sandbox
- **Loading skeleton**: Animated loading state for all media types

### 5.3 WallpaperInfo Section ✅

- **Metadata display**: Resolution, file size, date added
- **Editable name field**: Click to edit, Enter to save, Escape to cancel
- **Tags input with multi-select**: Add/remove tags with visual chips
- **Favorite toggle**: Heart icon to mark as favorite

### 5.4 Action Buttons ✅

- **Primary "Apply Wallpaper" button**: Main action with loading state
- **Secondary "Remove" button**: Shows when wallpaper is active
- **Tertiary actions**: Edit, Share, Delete buttons
- **Loading states**: Visual feedback during operations
- **Status messages**: Active, applying, removing states

## Components

### PreviewPanel

Main container component that orchestrates all sub-components.

```tsx
import { PreviewPanel } from '@/features/wallpaper'

;<PreviewPanel
    wallpaper={selectedWallpaper}
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    onApply={handleApply}
    onRemove={handleRemove}
    onDelete={handleDelete}
    onEdit={handleEdit}
    onShare={handleShare}
    onToggleFavorite={handleToggleFavorite}
    onUpdateName={handleUpdateName}
    onUpdateTags={handleUpdateTags}
    isApplying={isApplying}
    isRemoving={isRemoving}
/>
```

### PreviewMedia

Handles media preview with type-specific controls.

```tsx
import { PreviewMedia } from '@/features/wallpaper'

;<PreviewMedia wallpaper={wallpaper} />
```

**Features by type:**

- **Video**: Play/pause, volume slider, mute toggle, auto-play
- **Image**: Zoom controls (0.5x-3x), fullscreen, zoom indicator
- **HTML**: Sandboxed iframe with type badge

### WallpaperInfo

Displays and edits wallpaper metadata.

```tsx
import { WallpaperInfo } from '@/features/wallpaper'

;<WallpaperInfo
    wallpaper={wallpaper}
    onUpdateName={handleUpdateName}
    onUpdateTags={handleUpdateTags}
    onToggleFavorite={handleToggleFavorite}
/>
```

**Features:**

- Editable name (click to edit)
- Type badge with color coding
- Active status badge
- Metadata display (resolution, file size, date)
- Tag management (add/remove)
- Favorite toggle

### PreviewActions

Action buttons with loading states.

```tsx
import { PreviewActions } from '@/features/wallpaper'

;<PreviewActions
    wallpaper={wallpaper}
    onApply={handleApply}
    onRemove={handleRemove}
    onEdit={handleEdit}
    onShare={handleShare}
    onDelete={handleDelete}
    isApplying={isApplying}
    isRemoving={isRemoving}
/>
```

**Features:**

- Primary action (Apply/Remove based on active state)
- Secondary actions (Edit, Share, Delete)
- Loading states with spinners
- Status messages
- Disabled states during operations

## Props

### PreviewPanel Props

| Prop               | Type                       | Required | Description                          |
| ------------------ | -------------------------- | -------- | ------------------------------------ |
| `wallpaper`        | `Wallpaper \| null`        | Yes      | The wallpaper to preview             |
| `isOpen`           | `boolean`                  | Yes      | Controls panel visibility            |
| `onClose`          | `() => void`               | Yes      | Called when panel is closed          |
| `onApply`          | `() => void`               | No       | Called when Apply button is clicked  |
| `onRemove`         | `() => void`               | No       | Called when Remove button is clicked |
| `onDelete`         | `() => void`               | No       | Called when Delete button is clicked |
| `onEdit`           | `() => void`               | No       | Called when Edit button is clicked   |
| `onShare`          | `() => void`               | No       | Called when Share button is clicked  |
| `onToggleFavorite` | `() => void`               | No       | Called when favorite is toggled      |
| `onUpdateName`     | `(name: string) => void`   | No       | Called when name is updated          |
| `onUpdateTags`     | `(tags: string[]) => void` | No       | Called when tags are updated         |
| `isApplying`       | `boolean`                  | No       | Shows applying loading state         |
| `isRemoving`       | `boolean`                  | No       | Shows removing loading state         |
| `className`        | `string`                   | No       | Additional CSS classes               |

## Wallpaper Type

The component expects a `Wallpaper` object with the following structure:

```typescript
interface Wallpaper {
    id: string
    name: string
    type: 'video' | 'html' | 'image'
    thumbnail: string
    source: string
    createdAt: string
    metadata?: {
        resolution?: string
        fileSize?: number
        duration?: number
        fps?: number
        codec?: string
    }
    tags?: string[]
    isFavorite?: boolean
    isActive?: boolean
    updatedAt?: string
}
```

## Styling

The component uses the design system tokens:

- **Colors**: Accent primary, background variants, text colors
- **Spacing**: Consistent padding and gaps
- **Typography**: Font sizes and weights from design tokens
- **Animations**: Spring easing for smooth transitions
- **Effects**: Glass-morphism, backdrop blur

## Animations

- **Panel slide-in**: 350ms with spring easing
- **Backdrop fade**: 250ms
- **Button hover**: 200ms
- **Media controls**: 200ms fade on hover
- **Loading spinner**: Continuous rotation

## Accessibility

- **Keyboard navigation**: Tab through interactive elements
- **ARIA labels**: All buttons have descriptive labels
- **Focus indicators**: Visible focus states
- **Screen reader support**: Semantic HTML and ARIA roles
- **Escape key**: Closes the panel

## Responsive Design

- **Desktop (>1024px)**: 400px width panel
- **Tablet (768-1024px)**: Full width overlay
- **Mobile (<768px)**: Full screen overlay

## Performance

- **Lazy loading**: Media loads on demand
- **Memoization**: Prevents unnecessary re-renders
- **GPU acceleration**: Transform and opacity animations
- **Debouncing**: Tag input debounced
- **Cleanup**: Proper event listener cleanup

## Usage Example

See `PreviewPanelExample.tsx` for a complete working example with all features.

## Requirements Mapping

This implementation satisfies the following requirements:

- **Requirement 4.1**: Large preview panel with full quality media
- **Requirement 4.2**: Smooth slide-in animation
- **Requirement 4.3**: Detailed metadata display
- **Requirement 4.4**: Video playback with audio controls
- **Requirement 4.5**: Quick action buttons with feedback
- **Requirement 7.1**: One-click apply/remove
- **Requirement 7.2**: Loading states and progress
- **Requirement 8.5**: Editable metadata (name, tags)
- **Requirement 10.3**: Collapsible panel

## Future Enhancements

- [ ] Keyboard shortcuts for actions
- [ ] Drag to resize panel width
- [ ] Preview history/navigation
- [ ] Comparison mode (side-by-side)
- [ ] Advanced video controls (playback speed, loop)
- [ ] Image filters and adjustments
- [ ] Export/download functionality
