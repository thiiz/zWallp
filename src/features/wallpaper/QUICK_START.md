# Quick Start Guide - Wallpaper Gallery Components

Get started with the new wallpaper gallery components in 5 minutes.

## Installation

No installation needed! The components are already part of the project.

## Basic Usage

### 1. Import the Components

```tsx
import { WallpaperGrid } from '@/features/wallpaper'
import { Plus } from 'lucide-react'
```

### 2. Set Up State

```tsx
const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
const [selectedId, setSelectedId] = useState<string>()
const [activeId, setActiveId] = useState<string>()
```

### 3. Render the Grid

```tsx
<WallpaperGrid
    wallpapers={wallpapers}
    selectedId={selectedId}
    activeId={activeId}
    onSelect={(wallpaper) => setSelectedId(wallpaper.id)}
    onDelete={(id) => setWallpapers((prev) => prev.filter((w) => w.id !== id))}
>
    <button
        onClick={handleAdd}
        className="aspect-video bg-bg-tertiary rounded-xl border-2 border-dashed border-border-default hover:border-border-strong flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer"
    >
        <Plus className="w-8 h-8 text-text-tertiary" />
        <span className="text-sm text-text-secondary">Add Wallpaper</span>
    </button>
</WallpaperGrid>
```

## Add Drag-and-Drop

```tsx
const handleFilesDropped = (files: File[]) => {
    files.forEach((file) => {
        const newWallpaper: Wallpaper = {
            id: Date.now().toString(),
            name: file.name,
            type: file.type.startsWith('video/') ? 'video' : 'image',
            thumbnail: URL.createObjectURL(file),
            source: URL.createObjectURL(file),
            createdAt: new Date().toISOString()
        }
        setWallpapers((prev) => [...prev, newWallpaper])
    })
}

;<WallpaperGrid
    // ... other props
    onFilesDropped={handleFilesDropped}
/>
```

## Add Favorites

```tsx
const [favorites, setFavorites] = useState<Set<string>>(new Set())

const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
            next.delete(id)
        } else {
            next.add(id)
        }
        return next
    })
}

;<WallpaperGrid
    // ... other props
    onToggleFavorite={handleToggleFavorite}
/>
```

## Complete Example

```tsx
import { useState } from 'react'
import { WallpaperGrid } from '@/features/wallpaper'
import { Plus } from 'lucide-react'
import type { Wallpaper } from '@/features/wallpaper'

export function MyWallpaperGallery() {
    const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
    const [selectedId, setSelectedId] = useState<string>()
    const [activeId, setActiveId] = useState<string>()
    const [favorites, setFavorites] = useState<Set<string>>(new Set())

    const handleDelete = (id: string) => {
        setWallpapers((prev) => prev.filter((w) => w.id !== id))
        if (selectedId === id) setSelectedId(undefined)
        if (activeId === id) setActiveId(undefined)
    }

    const handleToggleFavorite = (id: string) => {
        setFavorites((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const handleFilesDropped = (files: File[]) => {
        files.forEach((file) => {
            const newWallpaper: Wallpaper = {
                id: Date.now().toString(),
                name: file.name,
                type: file.type.startsWith('video/') ? 'video' : 'image',
                thumbnail: URL.createObjectURL(file),
                source: URL.createObjectURL(file),
                createdAt: new Date().toISOString()
            }
            setWallpapers((prev) => [...prev, newWallpaper])
        })
    }

    return (
        <div className="h-full overflow-y-auto bg-bg-primary">
            <WallpaperGrid
                wallpapers={wallpapers}
                selectedId={selectedId}
                activeId={activeId}
                onSelect={(w) => setSelectedId(w.id)}
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

## Styling Tips

### Custom Grid Spacing

```tsx
<WallpaperGrid className="gap-6 p-8" />
```

### Custom Card Styling

The cards automatically inherit the grid's styling and respond to the design system.

### Dark/Light Mode

Components automatically adapt to the theme using CSS custom properties.

## Common Patterns

### Empty State

```tsx
{
    wallpapers.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-20">
            <p className="text-text-secondary">No wallpapers yet</p>
            <p className="text-text-tertiary text-sm">Add one to get started</p>
        </div>
    ) : (
        <WallpaperGrid wallpapers={wallpapers} {...props} />
    )
}
```

### Loading State

```tsx
{
    isLoading ? (
        <div className="grid grid-cols-3 gap-4 p-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="aspect-video bg-bg-tertiary rounded-xl animate-pulse"
                />
            ))}
        </div>
    ) : (
        <WallpaperGrid wallpapers={wallpapers} {...props} />
    )
}
```

### With Search/Filter

```tsx
const filteredWallpapers = wallpapers.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase())
)

<WallpaperGrid wallpapers={filteredWallpapers} {...props} />
```

## Next Steps

- Read the [Migration Guide](./components/MIGRATION_GUIDE.md) for detailed migration instructions
- Check the [Implementation Summary](./components/IMPLEMENTATION_SUMMARY.md) for technical details
- Review the [Design Document](../../.kiro/specs/wallpaper-ui-refactor/design.md) for design specs

## Need Help?

- Check the component README: `src/features/wallpaper/components/README.md`
- Review the requirements: `.kiro/specs/wallpaper-ui-refactor/requirements.md`
- Look at the design: `.kiro/specs/wallpaper-ui-refactor/design.md`

## Tips

1. **Performance**: For 100+ wallpapers, consider implementing virtual scrolling
2. **Accessibility**: All components are keyboard accessible by default
3. **Animations**: Respect `prefers-reduced-motion` for accessibility
4. **File Size**: Optimize thumbnails for better performance
5. **Error Handling**: Add try-catch blocks for file operations

---

Happy coding! 🚀
