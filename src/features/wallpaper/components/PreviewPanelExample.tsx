/**
 * PreviewPanel Usage Example
 *
 * This file demonstrates how to use the PreviewPanel component
 * with all its features and callbacks.
 */

import React, { useState } from 'react'
import { PreviewPanel } from './PreviewPanel'
import type { Wallpaper } from '../types'

export function PreviewPanelExample() {
    const [isOpen, setIsOpen] = useState(false)
    const [isApplying, setIsApplying] = useState(false)
    const [isRemoving, setIsRemoving] = useState(false)
    const [selectedWallpaper, setSelectedWallpaper] =
        useState<Wallpaper | null>(null)

    // Example wallpaper data
    const exampleWallpaper: Wallpaper = {
        id: '1',
        name: 'Mountain Sunset',
        type: 'video',
        thumbnail: '/thumbnails/mountain-sunset.jpg',
        source: '/wallpapers/mountain-sunset.mp4',
        createdAt: new Date().toISOString(),
        metadata: {
            resolution: '1920x1080',
            fileSize: 15728640, // 15 MB
            duration: 30,
            fps: 60
        },
        tags: ['nature', 'sunset', 'mountains'],
        isFavorite: false,
        isActive: false
    }

    const handleApply = async () => {
        setIsApplying(true)
        try {
            // Simulate API call to apply wallpaper
            await new Promise((resolve) => setTimeout(resolve, 2000))
            console.log('Wallpaper applied:', selectedWallpaper?.name)

            // Update wallpaper state
            if (selectedWallpaper) {
                setSelectedWallpaper({
                    ...selectedWallpaper,
                    isActive: true
                })
            }
        } catch (error) {
            console.error('Failed to apply wallpaper:', error)
        } finally {
            setIsApplying(false)
        }
    }

    const handleRemove = async () => {
        setIsRemoving(true)
        try {
            // Simulate API call to remove wallpaper
            await new Promise((resolve) => setTimeout(resolve, 1500))
            console.log('Wallpaper removed:', selectedWallpaper?.name)

            // Update wallpaper state
            if (selectedWallpaper) {
                setSelectedWallpaper({
                    ...selectedWallpaper,
                    isActive: false
                })
            }
        } catch (error) {
            console.error('Failed to remove wallpaper:', error)
        } finally {
            setIsRemoving(false)
        }
    }

    const handleDelete = () => {
        console.log('Delete wallpaper:', selectedWallpaper?.name)
        // Implement delete logic
        setIsOpen(false)
        setSelectedWallpaper(null)
    }

    const handleEdit = () => {
        console.log('Edit wallpaper:', selectedWallpaper?.name)
        // Implement edit logic
    }

    const handleShare = () => {
        console.log('Share wallpaper:', selectedWallpaper?.name)
        // Implement share logic
    }

    const handleToggleFavorite = () => {
        if (selectedWallpaper) {
            setSelectedWallpaper({
                ...selectedWallpaper,
                isFavorite: !selectedWallpaper.isFavorite
            })
        }
    }

    const handleUpdateName = (name: string) => {
        if (selectedWallpaper) {
            setSelectedWallpaper({
                ...selectedWallpaper,
                name
            })
        }
    }

    const handleUpdateTags = (tags: string[]) => {
        if (selectedWallpaper) {
            setSelectedWallpaper({
                ...selectedWallpaper,
                tags
            })
        }
    }

    const handleOpenPreview = () => {
        setSelectedWallpaper(exampleWallpaper)
        setIsOpen(true)
    }

    return (
        <div className="p-8">
            <button
                onClick={handleOpenPreview}
                className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-hover"
            >
                Open Preview Panel
            </button>

            <PreviewPanel
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
        </div>
    )
}
