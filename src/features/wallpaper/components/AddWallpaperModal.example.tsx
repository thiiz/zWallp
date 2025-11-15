/**
 * Example usage of AddWallpaperModal component
 *
 * This file demonstrates how to integrate the AddWallpaperModal
 * into your application.
 */

import React, { useState } from 'react'
import { AddWallpaperModal } from './AddWallpaperModal'
import { Button } from '@/components/ui/button'
import type { Wallpaper } from '../types'

export function AddWallpaperModalExample() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])

    const handleAddWallpaper = async (
        wallpaperData: Omit<Wallpaper, 'id' | 'createdAt'>
    ) => {
        // Simulate API call or storage operation
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const newWallpaper: Wallpaper = {
            ...wallpaperData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString()
        }

        setWallpapers((prev) => [...prev, newWallpaper])
        console.log('Wallpaper added:', newWallpaper)
    }

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-text-primary mb-2">
                    Add Wallpaper Modal Example
                </h1>
                <p className="text-text-secondary">
                    Click the button below to open the Add Wallpaper modal
                </p>
            </div>

            <Button onClick={() => setIsModalOpen(true)}>Add Wallpaper</Button>

            <AddWallpaperModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddWallpaper}
            />

            {/* Display added wallpapers */}
            {wallpapers.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">
                        Added Wallpapers ({wallpapers.length})
                    </h2>
                    <div className="space-y-3">
                        {wallpapers.map((wallpaper) => (
                            <div
                                key={wallpaper.id}
                                className="p-4 rounded-lg bg-bg-elevated border border-border-default"
                            >
                                <h3 className="font-medium text-text-primary">
                                    {wallpaper.name}
                                </h3>
                                <p className="text-sm text-text-secondary mt-1">
                                    Type: {wallpaper.type}
                                </p>
                                {wallpaper.tags &&
                                    wallpaper.tags.length > 0 && (
                                        <p className="text-sm text-text-secondary mt-1">
                                            Tags: {wallpaper.tags.join(', ')}
                                        </p>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
