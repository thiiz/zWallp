import { convertFileSrc } from '@tauri-apps/api/core'

/**
 * Converts a local file path to a Tauri-compatible asset URL
 * @param filePath - The local file path (e.g., "D:/path/to/file.mp4")
 * @returns A Tauri asset:// URL that can be used in the webview
 */
export function convertToAssetUrl(filePath: string): string {
    return convertFileSrc(filePath)
}
