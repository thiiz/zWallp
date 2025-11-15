# Layout Components

This directory contains the new layout structure components for the Wallpaper Engine UI refactor.

## Components

### AppLayout

The main layout wrapper that provides the overall structure with sidebar, main content, and preview panel.

**Features:**

- Responsive layout with collapsible sidebar
- Optional preview panel that slides in from the right
- Persists layout preferences to localStorage
- Auto-collapses sidebar on small screens (< 768px)

**Usage:**

```tsx
import { AppLayout } from '@/components/app-layout'

;<AppLayout
    sidebarCollapsed={false}
    previewPanelOpen={false}
    onSidebarCollapsedChange={(collapsed) => console.log(collapsed)}
    onPreviewPanelOpenChange={(open) => console.log(open)}
    sidebar={<Sidebar />}
    previewPanel={<PreviewPanel />}
>
    <YourMainContent />
</AppLayout>
```

### Sidebar

Navigation sidebar with collapsible functionality and keyboard shortcuts display.

**Features:**

- Navigation menu with icons
- Active state highlighting with accent color and left border
- Smooth collapse/expand animation (240px → 64px)
- Keyboard shortcuts display when expanded
- Tooltips when collapsed
- Badge support for notification counts

**Usage:**

```tsx
import { Sidebar } from '@/components/layout'

;<Sidebar
    collapsed={false}
    onCollapsedChange={(collapsed) => console.log(collapsed)}
    activeItemId="library"
    onNavigate={(item) => console.log('Navigate to:', item.path)}
/>
```

### TopBar

Top navigation bar with search, view mode toggle, and settings button.

**Features:**

- SearchBar with debounced input (300ms)
- Glass-morphism effect
- Keyboard shortcut (Ctrl+K) to focus search
- View mode toggle (grid/list)
- Settings button
- Clear search button when typing

**Usage:**

```tsx
import { TopBar } from '@/components/layout'

;<TopBar
    searchQuery=""
    onSearchChange={(query) => console.log(query)}
    viewMode="grid"
    onViewModeChange={(mode) => console.log(mode)}
    onSettingsClick={() => console.log('Settings clicked')}
/>
```

## Layout Preferences

Layout preferences are automatically persisted to localStorage under the key `wallpaper-engine-layout-preferences`.

**Stored preferences:**

- `sidebarCollapsed`: boolean
- `previewPanelOpen`: boolean

**Helper functions:**

```tsx
import {
    loadLayoutPreferences,
    saveLayoutPreferences
} from '@/components/app-layout'

// Load preferences
const preferences = loadLayoutPreferences()

// Save preferences
saveLayoutPreferences({
    sidebarCollapsed: true,
    previewPanelOpen: false
})
```

## Demo

See `layout-demo.tsx` for a complete example of how to use all layout components together.

To use the demo:

```tsx
import { LayoutDemo } from '@/components/layout/layout-demo'

// In your app
;<LayoutDemo />
```

## Design Tokens

The layout components use the following design tokens from `global.css`:

**Colors:**

- `bg-primary`, `bg-secondary`, `bg-tertiary`, `bg-elevated`
- `accent-primary`, `accent-hover`, `accent-active`
- `text-primary`, `text-secondary`, `text-tertiary`
- `border-subtle`, `border-default`, `border-strong`

**Effects:**

- `glass` - Glass-morphism with backdrop blur
- `glow-accent` - Accent color glow effect

**Transitions:**

- Duration: 300ms for layout changes
- Easing: ease-out for smooth animations

## Keyboard Shortcuts

| Shortcut | Action                |
| -------- | --------------------- |
| Ctrl+K   | Focus search bar      |
| Ctrl+1   | Navigate to Library   |
| Ctrl+2   | Navigate to Discover  |
| Ctrl+3   | Navigate to Favorites |
| Ctrl+,   | Open Settings         |

## Responsive Behavior

- **Desktop (> 1024px)**: Full layout with expanded sidebar
- **Tablet (768px - 1024px)**: Collapsible sidebar and preview panel
- **Mobile (< 768px)**: Auto-collapsed sidebar, full-width content

## Requirements Satisfied

This implementation satisfies the following requirements from the spec:

- **Requirement 10.1**: Responsive layout with adaptive columns
- **Requirement 10.2**: Collapsible sidebar functionality
- **Requirement 10.3**: Preview panel toggle
- **Requirement 10.5**: Persist layout preferences to localStorage
- **Requirement 2.1**: Sidebar navigation with clear visual hierarchy
- **Requirement 2.2**: Hover effects with smooth transitions
- **Requirement 2.3**: Active section highlighting
- **Requirement 2.4**: Keyboard shortcuts support
- **Requirement 6.1**: Real-time search filtering
- **Requirement 6.2**: Debounced search input
