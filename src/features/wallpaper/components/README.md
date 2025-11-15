# Wallpaper Components

Modern, responsive wallpaper gallery components with drag-and-drop support.

## Components

### 🎨 WallpaperGrid

Responsive grid container that adapts from 1 to 6 columns based on screen size.

**Features**:

- Adaptive columns (mobile → ultrawide)
- Smooth grid animations
- Drag-and-drop support
- Custom children support

**Usage**:

```tsx
<WallpaperGrid
    wallpapers={wallpapers}
    selectedId={selectedId}
    activeId={activeId}
    onSelect={handleSelect}
    onDelete={handleDelete}
    onFilesDropped={handleDrop}
>
    <AddButton />
</WallpaperGrid>
```

---

### 🃏 WallpaperCard

Enhanced card with hover effects, animations, and interactive states.

**Features**:

- Scale animation on hover (1.02x)
- Action buttons overlay (Play, Favorite, Delete)
- Selection state with glow effect
- Active badge with pulse animation
- Video auto-play on hover
- Favorite indicator

**States**:

- Default: Clean card with thumbnail
- Hover: Scaled with action buttons
- Selected: Accent ring + glow + checkmark
- Active: Green ring + "Active" badge
- Favorite: Heart icon indicator

---

### 📤 DropZoneOverlay

Full-screen overlay for drag-and-drop visual feedback.

**Features**:

- Backdrop blur effect
- Animated upload icon
- Dashed border with accent color
- Supported formats display
- Smooth transitions

---

### 🎣 useDragAndDrop

Custom hook for drag-and-drop functionality.

**Features**:

- Drag state management
- File type validation
- Nested drag event handling
- Clean callback API

**Supported Types**:

- Videos: MP4, WebM, OGG
- Images: JPEG, PNG, GIF, WebP
- HTML: HTML files

---

## File Structure

```
components/
├── WallpaperGrid.tsx          - Main grid container
├── WallpaperCard.tsx          - Enhanced card component
├── DropZoneOverlay.tsx        - Drag-and-drop overlay
├── MIGRATION_GUIDE.md         - Migration documentation
├── IMPLEMENTATION_SUMMARY.md  - Implementation details
└── README.md                  - This file

hooks/
└── useDragAndDrop.ts          - Drag-and-drop hook
```

## Design System

All components use design tokens from `src/lib/design-tokens.ts`:

- **Colors**: bg-_, text-_, accent-_, border-_
- **Animations**: 150ms (fast), 250ms (normal), 350ms (slow)
- **Easing**: cubic-bezier functions for smooth motion
- **Effects**: glass-morphism, glow effects

## Responsive Breakpoints

| Breakpoint | Columns | Screen Size |
| ---------- | ------- | ----------- |
| Mobile     | 1       | < 640px     |
| Tablet     | 2       | 640px+      |
| Desktop    | 3-4     | 768px+      |
| Wide       | 5       | 1280px+     |
| Ultrawide  | 6       | 1536px+     |

## Performance

- ✅ GPU-accelerated animations (transform, opacity)
- ✅ Memoized grid classes
- ✅ Conditional video playback
- ✅ Optimized event handling
- ✅ Virtual scrolling ready

## Accessibility

- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Semantic HTML
- ✅ Alt text for images
- ✅ ARIA labels

## Browser Support

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Electron/Tauri

## Documentation

- **Migration Guide**: See `MIGRATION_GUIDE.md` for upgrading from old components
- **Implementation**: See `IMPLEMENTATION_SUMMARY.md` for technical details
- **Design**: See `.kiro/specs/wallpaper-ui-refactor/design.md` for design specs
- **Requirements**: See `.kiro/specs/wallpaper-ui-refactor/requirements.md` for requirements

## Examples

See `MIGRATION_GUIDE.md` for complete examples and usage patterns.

## Status

✅ **Complete** - All features implemented and tested

- Task 4.1: WallpaperGrid ✅
- Task 4.2: WallpaperCard ✅
- Task 4.3: Drag-and-drop ✅

---

**Last Updated**: 2025-11-15
**Version**: 1.0.0
