# Design Document - Wallpaper Engine UI Refactor

## Overview

Este documento detalha o design completo da refatoração da interface do Wallpaper Engine, transformando-a em uma aplicação desktop moderna, elegante e minimalista. O design é inspirado em aplicações contemporâneas como Spotify, Discord e Figma, com foco em usabilidade, performance e estética.

## Architecture

### Component Hierarchy

```
WallpaperApp
├── AppLayout
│   ├── Sidebar
│   │   ├── Logo
│   │   ├── NavigationMenu
│   │   └── UserProfile
│   ├── MainContent
│   │   ├── TopBar
│   │   │   ├── SearchBar
│   │   │   ├── ViewToggle
│   │   │   └── SettingsButton
│   │   ├── ContentArea
│   │   │   ├── LibraryView
│   │   │   │   ├── FilterBar
│   │   │   │   ├── WallpaperGrid
│   │   │   │   └── EmptyState
│   │   │   ├── SettingsView
│   │   │   └── AboutView
│   │   └── QuickActionsBar
│   └── PreviewPanel (collapsible)
│       ├── PreviewMedia
│       ├── WallpaperInfo
│       └── ActionButtons
└── GlobalComponents
    ├── AddWallpaperModal
    ├── OnboardingFlow
    ├── ToastNotifications
    └── ContextMenus
```

## Components and Interfaces

### 1. Design System Foundation

#### Color Palette

```typescript
// Design tokens
const colors = {
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
}
```

#### Typography

```typescript
const typography = {
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
}
```

#### Spacing System

```typescript
const spacing = {
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
}
```

#### Animation Tokens

```typescript
const animations = {
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
}
```

### 2. AppLayout Component

#### Structure

```typescript
interface AppLayoutProps {
    children: React.ReactNode
    sidebarCollapsed?: boolean
    previewPanelOpen?: boolean
}

interface AppLayoutState {
    sidebarCollapsed: boolean
    previewPanelOpen: boolean
    currentView: 'library' | 'settings' | 'about'
}
```

#### Layout Specifications

- **Sidebar Width**: 240px (expanded), 64px (collapsed)
- **Preview Panel Width**: 400px (desktop), full width (mobile)
- **Min Window Size**: 600x400px
- **Responsive Breakpoints**:
    - Mobile: < 768px
    - Tablet: 768px - 1024px
    - Desktop: > 1024px

#### Visual Design

- Glass-morphism effect on sidebar with backdrop blur
- Subtle gradient background
- Smooth transitions between collapsed/expanded states
- Persistent layout preferences in localStorage

### 3. Sidebar Component

#### Navigation Items

```typescript
interface NavigationItem {
    id: string
    label: string
    icon: LucideIcon
    path: string
    badge?: number
    shortcut?: string
}

const navigationItems: NavigationItem[] = [
    {
        id: 'library',
        label: 'Library',
        icon: LayoutGrid,
        path: '/',
        shortcut: 'Ctrl+1'
    },
    {
        id: 'discover',
        label: 'Discover',
        icon: Compass,
        path: '/discover',
        shortcut: 'Ctrl+2'
    },
    {
        id: 'favorites',
        label: 'Favorites',
        icon: Heart,
        path: '/favorites',
        shortcut: 'Ctrl+3'
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        path: '/settings',
        shortcut: 'Ctrl+,'
    }
]
```

#### Visual Design

- Logo at top with subtle glow effect
- Navigation items with hover states
- Active item highlighted with accent color and left border
- Smooth icon-only mode when collapsed
- User profile section at bottom (future feature)

### 4. TopBar Component

#### Structure

```typescript
interface TopBarProps {
    onSearch: (query: string) => void
    viewMode: 'grid' | 'list'
    onViewModeChange: (mode: 'grid' | 'list') => void
}
```

#### Features

- **SearchBar**:
    - Floating design with glass effect
    - Search icon with animation
    - Clear button appears when typing
    - Keyboard shortcut: Ctrl+K
- **ViewToggle**:
    - Grid/List view switcher
    - Smooth transition animation
    - Persisted preference

- **SettingsButton**:
    - Quick access to settings
    - Notification dot for updates

### 5. WallpaperGrid Component

#### Grid Specifications

```typescript
interface WallpaperGridProps {
    wallpapers: Wallpaper[]
    selectedId?: string
    onSelect: (wallpaper: Wallpaper) => void
    onDelete: (id: string) => void
    viewMode: 'grid' | 'list'
}

// Responsive columns
const gridColumns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4,
    ultrawide: 5
}
```

#### WallpaperCard Design

**Dimensions**:

- Aspect Ratio: 16:9
- Border Radius: 12px
- Gap: 16px

**States**:

1. **Default**:
    - Subtle border
    - Thumbnail with overlay gradient
    - Name and type at bottom

2. **Hover**:
    - Scale: 1.02
    - Elevated shadow
    - Overlay with actions (Play, Delete, Favorite)
    - Animated thumbnail for videos

3. **Selected**:
    - Accent color border (2px)
    - Glow effect
    - Checkmark badge

4. **Active** (currently applied):
    - Green badge with "Active" label
    - Subtle pulse animation

**Card Content**:

```typescript
interface WallpaperCardContent {
    thumbnail: string
    name: string
    type: 'video' | 'image' | 'html'
    duration?: string // for videos
    resolution?: string
    isActive: boolean
    isFavorite: boolean
}
```

### 6. PreviewPanel Component

#### Structure

```typescript
interface PreviewPanelProps {
    wallpaper: Wallpaper | null
    isOpen: boolean
    onClose: () => void
    onApply: () => void
    onRemove: () => void
}
```

#### Layout Sections

1. **Header**:
    - Close button
    - Wallpaper name (editable on click)
    - Favorite toggle

2. **Preview Area**:
    - Full-size media preview
    - Video controls (for videos)
    - Zoom controls (for images)
    - Loading skeleton

3. **Info Section**:
    - Type badge
    - Resolution
    - File size
    - Date added
    - Tags (editable)

4. **Actions**:
    - Primary: "Apply Wallpaper" button (accent color)
    - Secondary: "Remove" button (if active)
    - Tertiary: "Edit", "Share", "Delete"

#### Visual Design

- Slide-in animation from right
- Glass-morphism background
- Smooth transitions between wallpapers
- Skeleton loading for async operations

### 7. AddWallpaperModal Component

#### Structure

```typescript
interface AddWallpaperModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (wallpaper: NewWallpaper) => Promise<void>
}

interface NewWallpaper {
    name: string
    type: 'video' | 'image' | 'html'
    source: string
    tags?: string[]
}
```

#### Design

**Modal Layout**:

- Centered overlay with backdrop blur
- Max width: 600px
- Smooth scale-in animation

**Content Sections**:

1. **Source Selection**:
    - Tab buttons: "File", "URL", "HTML"
    - Active tab highlighted

2. **File Upload** (File tab):
    - Drag-and-drop zone
    - File type validation
    - Preview generation
    - Progress indicator

3. **URL Input** (URL tab):
    - Input field with validation
    - Preview button
    - Supported formats list

4. **HTML Editor** (HTML tab):
    - Code editor with syntax highlighting
    - Live preview
    - Template gallery

5. **Metadata**:
    - Name input (auto-filled from filename)
    - Tags input (multi-select)
    - Optional description

6. **Actions**:
    - Cancel button
    - Add button (disabled until valid)

### 8. EmptyState Component

#### Design Variants

**First Time User**:

```
┌─────────────────────────────────┐
│                                 │
│         [Illustration]          │
│                                 │
│    Welcome to Wallpaper Engine  │
│                                 │
│   Transform your desktop with   │
│     animated wallpapers         │
│                                 │
│      [Add Your First Wallpaper] │
│                                 │
│   or drag and drop files here   │
│                                 │
└─────────────────────────────────┘
```

**No Search Results**:

```
┌─────────────────────────────────┐
│                                 │
│         [Search Icon]           │
│                                 │
│    No wallpapers found          │
│                                 │
│   Try adjusting your filters    │
│                                 │
│      [Clear Filters]            │
│                                 │
└─────────────────────────────────┘
```

### 9. OnboardingFlow Component

#### Steps

```typescript
interface OnboardingStep {
    id: string
    title: string
    description: string
    illustration: string
    action?: {
        label: string
        handler: () => void
    }
}

const onboardingSteps: OnboardingStep[] = [
    {
        id: 'welcome',
        title: 'Welcome to Wallpaper Engine',
        description: 'Create stunning animated wallpapers for your desktop',
        illustration: '/onboarding/welcome.svg'
    },
    {
        id: 'add-wallpaper',
        title: 'Add Your First Wallpaper',
        description: 'Support for videos, images, and HTML wallpapers',
        illustration: '/onboarding/add.svg',
        action: {
            label: 'Add Wallpaper',
            handler: () => openAddModal()
        }
    },
    {
        id: 'apply',
        title: 'Apply and Enjoy',
        description: 'One click to transform your desktop',
        illustration: '/onboarding/apply.svg'
    }
]
```

#### Visual Design

- Full-screen overlay
- Progress dots at bottom
- Skip button (top-right)
- Next/Previous navigation
- Smooth slide transitions
- Auto-advance option

### 10. FilterBar Component

#### Structure

```typescript
interface FilterBarProps {
    activeFilters: FilterState
    onFilterChange: (filters: FilterState) => void
    resultCount: number
}

interface FilterState {
    type: ('video' | 'image' | 'html')[]
    sortBy: 'name' | 'date' | 'size'
    sortOrder: 'asc' | 'desc'
    favorites: boolean
}
```

#### Visual Design

- Horizontal layout with filter chips
- Active filters highlighted
- Clear all button
- Result count display
- Smooth animations

### 11. QuickActionsBar Component

#### Structure

```typescript
interface QuickActionsBarProps {
    selectedWallpaper: Wallpaper | null
    activeWallpaper: Wallpaper | null
    onApply: () => void
    onRemove: () => void
    isLoading: boolean
}
```

#### Layout

- Fixed at bottom of window
- Glass-morphism background
- Centered action buttons
- Status indicator (left)
- Settings shortcut (right)

#### States

**No Selection**:

```
[Status: No wallpaper active] ────────────── [⚙️]
```

**Wallpaper Selected**:

```
[Status: Ready to apply] ── [Apply Wallpaper] [Remove] ── [⚙️]
```

**Loading**:

```
[Status: Applying...] ──── [Progress Spinner] ──── [⚙️]
```

### 12. ToastNotifications Component

#### Types

```typescript
interface Toast {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    duration?: number
    action?: {
        label: string
        handler: () => void
    }
}
```

#### Visual Design

- Slide-in from top-right
- Auto-dismiss after duration
- Swipe to dismiss
- Stack multiple toasts
- Icon based on type
- Progress bar for duration

### 13. SettingsView Component

#### Categories

```typescript
interface SettingsCategory {
    id: string
    label: string
    icon: LucideIcon
    settings: Setting[]
}

interface Setting {
    id: string
    type: 'toggle' | 'select' | 'slider' | 'input'
    label: string
    description?: string
    value: any
    options?: any[]
}
```

#### Categories

1. **Appearance**:
    - Theme (Dark/Light/Auto)
    - Accent color
    - UI scale
    - Animations (On/Off)

2. **Wallpaper**:
    - Default quality
    - Auto-play videos
    - Volume level
    - Playback speed

3. **Application**:
    - Launch on startup
    - Minimize to tray
    - Check for updates
    - Hardware acceleration

4. **Advanced**:
    - Cache location
    - Max cache size
    - Debug mode
    - Reset settings

## Data Models

### Wallpaper Model

```typescript
interface Wallpaper {
    id: string
    name: string
    type: 'video' | 'image' | 'html'
    source: string
    thumbnail: string
    metadata: {
        resolution?: string
        fileSize?: number
        duration?: number
        fps?: number
        codec?: string
    }
    tags: string[]
    isFavorite: boolean
    isActive: boolean
    createdAt: string
    updatedAt: string
    stats: {
        timesApplied: number
        lastApplied?: string
    }
}
```

### Settings Model

```typescript
interface AppSettings {
    appearance: {
        theme: 'dark' | 'light' | 'auto'
        accentColor: string
        uiScale: number
        animationsEnabled: boolean
    }
    wallpaper: {
        defaultQuality: 'low' | 'medium' | 'high'
        autoPlayVideos: boolean
        volume: number
        playbackSpeed: number
    }
    application: {
        launchOnStartup: boolean
        minimizeToTray: boolean
        checkForUpdates: boolean
        hardwareAcceleration: boolean
    }
    advanced: {
        cacheLocation: string
        maxCacheSize: number
        debugMode: boolean
    }
}
```

### User Preferences Model

```typescript
interface UserPreferences {
    layout: {
        sidebarCollapsed: boolean
        previewPanelOpen: boolean
        viewMode: 'grid' | 'list'
        gridColumns: number
    }
    filters: FilterState
    onboardingCompleted: boolean
    lastActiveWallpaper?: string
}
```

## Error Handling

### Error Types

```typescript
type WallpaperError =
    | 'FILE_NOT_FOUND'
    | 'UNSUPPORTED_FORMAT'
    | 'FILE_TOO_LARGE'
    | 'INVALID_URL'
    | 'NETWORK_ERROR'
    | 'PERMISSION_DENIED'
    | 'APPLY_FAILED'
    | 'UNKNOWN_ERROR'

interface ErrorState {
    type: WallpaperError
    message: string
    details?: string
    recoverable: boolean
    suggestedAction?: string
}
```

### Error Display

- Toast notifications for non-critical errors
- Modal dialogs for critical errors
- Inline error messages in forms
- Retry buttons for recoverable errors
- Clear error messages with suggested actions

## Testing Strategy

### Unit Tests

- Component rendering
- State management
- Utility functions
- Data transformations

### Integration Tests

- User flows (add, apply, remove wallpaper)
- Navigation between views
- Filter and search functionality
- Settings persistence

### Visual Regression Tests

- Component snapshots
- Responsive layouts
- Theme variations
- Animation states

### Performance Tests

- Grid rendering with large datasets
- Animation frame rates
- Memory usage
- Load times

### Accessibility Tests

- Keyboard navigation
- Screen reader compatibility
- Color contrast
- Focus management

## Performance Optimizations

### Rendering Optimizations

1. **Virtual Scrolling**: For large wallpaper collections
2. **Lazy Loading**: Load thumbnails on demand
3. **Memoization**: React.memo for expensive components
4. **Code Splitting**: Lazy load routes and modals
5. **Image Optimization**: WebP format, responsive sizes

### State Management

1. **Local State**: Component-level state with useState
2. **Context**: Shared state (theme, settings)
3. **LocalStorage**: Persist preferences
4. **Debouncing**: Search and filter inputs

### Animation Performance

1. **GPU Acceleration**: transform and opacity only
2. **RequestAnimationFrame**: Smooth animations
3. **Reduced Motion**: Respect user preferences
4. **Throttling**: Limit animation frequency

## Accessibility Features

### Keyboard Navigation

- Tab order follows visual hierarchy
- Escape key closes modals/panels
- Arrow keys navigate grid
- Enter/Space activate buttons
- Shortcuts for common actions

### Screen Reader Support

- Semantic HTML elements
- ARIA labels and descriptions
- Live regions for dynamic content
- Skip links for navigation

### Visual Accessibility

- High contrast mode support
- Scalable UI (zoom support)
- Focus indicators
- Color-blind friendly palette

## Migration Strategy

### Phase 1: Foundation (Week 1)

- Set up design system
- Create base components (Button, Input, Card)
- Implement new layout structure

### Phase 2: Core Features (Week 2)

- Refactor WallpaperGrid
- Implement new PreviewPanel
- Add search and filters

### Phase 3: Enhanced UX (Week 3)

- Add onboarding flow
- Implement empty states
- Add toast notifications

### Phase 4: Polish (Week 4)

- Animations and transitions
- Settings panel
- Accessibility improvements
- Performance optimizations

### Phase 5: Testing & Launch (Week 5)

- Comprehensive testing
- Bug fixes
- Documentation
- Release
