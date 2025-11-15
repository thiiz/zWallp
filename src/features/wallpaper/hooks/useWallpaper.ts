import { invoke } from '@tauri-apps/api/core'
import { emit } from '@tauri-apps/api/event'
import { useState } from 'react'
import type { Wallpaper } from '../types'

export function useWallpaper() {
    const [isActive, setIsActive] = useState(false)
    const [loading, setLoading] = useState(false)

    const applyWallpaper = async (wallpaper: Wallpaper) => {
        try {
            setLoading(true)
            console.log('Creating and applying wallpaper atomically...')

            // Use the new atomic command that creates and positions the window
            await invoke('create_and_apply_wallpaper')

            // Wait for window to be ready
            await new Promise((resolve) => setTimeout(resolve, 500))

            console.log('Sending wallpaper config:', wallpaper)
            await emit('wallpaper-config', {
                type: wallpaper.type,
                source: wallpaper.source
            })

            setIsActive(true)
            console.log('Wallpaper applied successfully')
        } catch (error) {
            console.error('Failed to apply wallpaper:', error)
            // Provide user-friendly error message
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to apply wallpaper. Please try again.'
            throw new Error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const removeWallpaper = async () => {
        try {
            setLoading(true)
            await invoke('remove_wallpaper')
            setIsActive(false)
        } catch (error) {
            console.error('Failed to remove wallpaper:', error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    return {
        isActive,
        loading,
        applyWallpaper,
        removeWallpaper
    }
}
