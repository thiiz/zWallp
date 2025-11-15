# Wallpaper Gallery Refactor - Migration Guide

This guide explains how to migrate from the old `WallpaperGallery` component to the new refactored components.

## What's New

The wallpaper gallery has been refactored into three main components:

1. **WallpaperGrid** - Responsive grid container with drag-and-drop support
2. **WallpaperCard** - Enhanced card with hover effects, animations, and badges
3. **DropZoneOverlay** - Visual feedback for drag-and-drop operations

## Key Features

### WallpaperGrid

- ✅ Responsive grid (1-6 columns based on screen size)
- ✅ Smooth animations for grid changes
- ✅ Drag-and-drop support for adding wallpapers
- ✅ Virtual scrolling ready (can be added later for performance)

### WallpaperCard

- ✅ Hover effects with scale animation
- ✅ Overlay with action buttons (Play, Favorite, Delete)
- ✅ Selection state with glow effect
- ✅ Active badge for currently applied wallpaper
- ✅ Animated thumbnail preview for videos
- ✅ Favorite indicator

### DropZoneOverlay

- ✅ Full-screen overlay when dragging files
- ✅ Visual feedback with animations
- ✅ File type validation
- ✅ Supported formats display

## Migration Steps

### Before (Old Component)

```tsx
import { WallpaperGallery } from '../components/WallpaperGallery'

;<WallpaperGallery
    wallpapers={wallpapers}
    onSelect={setSelectedWallpaper}
    onDelete={handleDeleteWallpaper}
    onAdd={() => setIsDialogOpen(true)}
/>
```

### After (New Components)

```tsx
import { WallpaperGrid } from '../components/WallpaperGrid'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

;<WallpaperGrid
    wallpapers={wallpapers}
    selectedId={selectedWallpaper?.id}
    activeId={activeWallpaperId} // ID of currently applied wallpaper
    onSelect={setSelectedWallpaper}
    onDelete={handleDeleteWallpaper}
    onToggleFavorite={handleToggleFavorite} // Optional
    onFilesDropped={handleFilesDropped} // Optional - enables drag-and-drop
>
    {/* Add button as first child */}
    <button
        onClick={() => setIsDialogOpen(true)}
        className="aspect-video bg-bg-tertiary rounded-xl border-2 border-dashed border-border-default hover:border-border-strong flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer"
    >
        <Plus className="w-8 h-8 text-text-tertiary" />
        <span className="text-sm text-text-secondary">Add Wallpaper</span>
    </button>
</WallpaperGrid>
```

## Example Implementation

Here's a complete example of how to use the new components:

```tsx
import { useState } from 'react'
import { WallpaperGrid } from '../components/WallpaperGrid'
import { Plus } from 'lucide-react'
import type { Wallpaper } from '../types'

export function WallpaperGalleryExample() {
    const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
    const [selectedWallpaper, setSelectedWallpaper] =
        useState<Wallpaper | null>(null)
    const [activeWallpaperId, setActiveWallpaperId] = useState<string | null>(
        null
    )

    const handleDelete = (id: string) => {
        setWallpapers((prev) => prev.filter((w) => w.id !== id))
        if (selectedWallpaper?.id === id) {
            setSelectedWallpaper(null)
        }
    }

    const handleToggleFavorite = (id: string) => {
        // TODO: Implement favorites in state management
        console.log('Toggle favorite:', id)
    }

    const handleFilesDropped = async (files: File[]) => {
        // Process dropped files
        for (const file of files) {
            const newWallpaper: Wallpaper = {
                id: Date.now().toString(),
                name: file.name,
                type: file.type.startsWith('video/') ? 'video' : 'image',
                thumbnail: URL.createObjectURL(file),
                source: URL.createObjectURL(file),
                createdAt: new Date().toISOString()
            }
            setWallpapers((prev) => [...prev, newWallpaper])
        }
    }

    return (
        <div className="h-full overflow-y-auto">
            <WallpaperGrid
                wallpapers={wallpapers}
                selectedId={selectedWallpaper?.id}
                activeId={activeWallpaperId}
                onSelect={setSelectedWallpaper}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                onFilesDropped={handleFilesDropped}
            >
                <button
                    onClick={() => {
                        /* Open add dialog */
                    }}
                    className="aspect-video bg-bg-tertiary rounded-xl border-2 border-dashed border-border-default hover:border-border-strong flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                    <Plus className="w-8 h-8 text-text-tertiary" />
                    <span className="text-sm text-text-secondary">
                        Add Wallpaper
                    </span>
                </button>
            </WallpaperGrid>
        </div>
    )
}
```

## Props Reference

### WallpaperGrid Props

| Prop               | Type                             | Required | Description                                            |
| ------------------ | -------------------------------- | -------- | ------------------------------------------------------ |
| `wallpapers`       | `Wallpaper[]`                    | Yes      | Array of wallpaper objects                             |
| `selectedId`       | `string`                         | No       | ID of selected wallpaper                               |
| `activeId`         | `string`                         | No       | ID of currently applied wallpaper                      |
| `onSelect`         | `(wallpaper: Wallpaper) => void` | Yes      | Called when a wallpaper is selected                    |
| `onDelete`         | `(id: string) => void`           | Yes      | Called when delete button is clicked                   |
| `onToggleFavorite` | `(id: string) => void`           | No       | Called when favorite button is clicked                 |
| `onFilesDropped`   | `(files: File[]) => void`        | No       | Called when files are dropped (enables drag-and-drop)  |
| `className`        | `string`                         | No       | Additional CSS classes                                 |
| `children`         | `React.ReactNode`                | No       | Content to render before wallpapers (e.g., add button) |

### WallpaperCard Props

| Prop               | Type                             | Required | Description                                 |
| ------------------ | -------------------------------- | -------- | ------------------------------------------- |
| `wallpaper`        | `Wallpaper`                      | Yes      | Wallpaper object to display                 |
| `isSelected`       | `boolean`                        | No       | Whether the card is selected                |
| `isActive`         | `boolean`                        | No       | Whether this wallpaper is currently applied |
| `isFavorite`       | `boolean`                        | No       | Whether this wallpaper is favorited         |
| `onSelect`         | `(wallpaper: Wallpaper) => void` | Yes      | Called when card is clicked                 |
| `onDelete`         | `(id: string) => void`           | Yes      | Called when delete button is clicked        |
| `onToggleFavorite` | `(id: string) => void`           | No       | Called when favorite button is clicked      |
| `className`        | `string`                         | No       | Additional CSS classes                      |

## Supported File Types

The drag-and-drop functionality supports:

- **Videos**: MP4, WebM, OGG
- **Images**: JPEG, JPG, PNG, GIF, WebP
- **HTML**: HTML files

## Styling

The components use the design tokens from `src/lib/design-tokens.ts` and Tailwind CSS classes. All colors, spacing, and animations follow the design system.

### Custom Styling

You can customize the appearance by:

1. Passing `className` prop to override styles
2. Modifying design tokens in `src/lib/design-tokens.ts`
3. Updating Tailwind theme in `src/app/global.css`

## Performance Considerations

- Video thumbnails only play on hover to save resources
- Grid uses CSS Grid for optimal performance
- Animations use `transform` and `opacity` for GPU acceleration
- Virtual scrolling can be added for large collections (100+ wallpapers)

## Next Steps

1. Update `WallpaperManager.tsx` to use the new components
2. Implement favorites functionality in state management
3. Add virtual scrolling for large collections (optional)
4. Integrate with Tauri file picker for drag-and-drop
5. Add toast notifications for user feedback

## Breaking Changes

- `onAdd` prop removed - use `children` to render add button
- Hover state is now managed internally in `WallpaperCard`
- Active wallpaper badge requires `activeId` prop
- Favorites require `onToggleFavorite` handler

## Questions?

If you have questions or need help with migration, please refer to:

- Design document: `.kiro/specs/wallpaper-ui-refactor/design.md`
- Requirements: `.kiro/specs/wallpaper-ui-refactor/requirements.md`
- Task list: `.kiro/specs/wallpaper-ui-refactor/tasks.md`
