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
            console.log('Creating wallpaper window...')
            await invoke('create_wallpaper_window')

            await new Promise((resolve) => setTimeout(resolve, 1000))

            console.log('Sending wallpaper config:', wallpaper)
            await emit('wallpaper-config', {
                type: wallpaper.type,
                source: wallpaper.source
            })

            await new Promise((resolve) => setTimeout(resolve, 1000))

            console.log('Applying wallpaper to desktop...')
            await invoke('apply_wallpaper')

            setIsActive(true)
            console.log('Wallpaper applied successfully')
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
