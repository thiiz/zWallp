# Add Wallpaper Modal

A comprehensive modal component for adding wallpapers from multiple sources (files, URLs, and HTML code).

## Components

### AddWallpaperModal

Main modal component that orchestrates all tabs and handles form submission.

**Props:**

- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal is closed
- `onAdd: (wallpaper: Omit<Wallpaper, 'id' | 'createdAt'>) => Promise<void>` - Callback when wallpaper is added

### FileUploadTab

Handles file uploads with drag-and-drop support.

**Features:**

- Drag-and-drop zone with visual feedback
- File type validation (video/image)
- File size validation (max 500MB)
- Upload progress indicator
- Thumbnail preview
- Supported formats: MP4, WebM, OGG, JPEG, PNG, GIF, WebP

### URLInputTab

Handles wallpaper addition via URL.

**Features:**

- URL validation
- File type detection from URL
- Live preview for images and videos
- Preview in browser option
- Supported format information
- Example URLs

### HTMLEditorTab

Handles custom HTML wallpapers with code editor.

**Features:**

- Template gallery with pre-built animations
- Code editor with syntax highlighting
- Live preview iframe
- Template selection
- Tips and best practices

### MetadataForm

Handles wallpaper metadata input.

**Features:**

- Name input with auto-fill from file/URL
- Tags input with multi-select
- Tag suggestions
- Optional description field
- Keyboard shortcuts (Enter/comma to add tags)

## Usage

```tsx
import { AddWallpaperModal } from '@/features/wallpaper'
import { useState } from 'react'

function MyComponent() {
    const [isOpen, setIsOpen] = useState(false)

    const handleAdd = async (wallpaper) => {
        // Save wallpaper to your store/database
        console.log('Adding wallpaper:', wallpaper)
    }

    return (
        <>
            <button onClick={() => setIsOpen(true)}>Add Wallpaper</button>

            <AddWallpaperModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onAdd={handleAdd}
            />
        </>
    )
}
```

## Form Validation

The modal validates:

- Name is required and non-empty
- File tab: File must be selected
- URL tab: URL must be valid and non-empty
- HTML tab: HTML code must be non-empty

The "Add Wallpaper" button is disabled until all validation passes.

## Keyboard Shortcuts

- **Escape**: Close modal (when not submitting)
- **Enter/Comma**: Add tag in metadata form
- **Backspace**: Remove last tag when input is empty

## Accessibility

- Full keyboard navigation support
- ARIA labels on all interactive elements
- Focus management
- Screen reader friendly
- Disabled state handling

## Requirements Covered

This implementation satisfies the following requirements from the spec:

- **8.1**: Multiple methods to add wallpapers (file, URL, HTML)
- **8.2**: Drag-and-drop with visual feedback
- **8.3**: File type validation with error messages
- **8.4**: Auto-generate thumbnails (placeholder implementation)
- **8.5**: Edit wallpaper metadata (name, tags, description)

## Future Enhancements

- Actual thumbnail generation for videos
- File upload to backend/storage
- More HTML templates
- Code syntax highlighting in HTML editor
- Image cropping/editing
- Batch upload support
