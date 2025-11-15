import { invoke } from '@tauri-apps/api/core'
import { useState } from 'react'

export function useWallpaper() {
    const [isActive, setIsActive] = useState(false)
    const [loading, setLoading] = useState(false)

    const applyWallpaper = async () => {
        try {
            setLoading(true)
            await invoke('create_wallpaper_window')
            await new Promise((resolve) => setTimeout(resolve, 500))
            await invoke('apply_wallpaper')
            setIsActive(true)
        } catch (error) {
            console.error('Failed to apply wallpaper:', error)
            throw error
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
