import React, { useState } from 'react'
import {
    Link as LinkIcon,
    Eye,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface URLInputTabProps {
    url: string
    onUrlChange: (url: string) => void
    disabled?: boolean
}

export function URLInputTab({
    url,
    onUrlChange,
    disabled = false
}: URLInputTabProps) {
    const [isValidating, setIsValidating] = useState(false)
    const [validationStatus, setValidationStatus] = useState<
        'idle' | 'valid' | 'invalid'
    >('idle')
    const [error, setError] = useState<string | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const validateUrl = (urlString: string): boolean => {
        try {
            const urlObj = new URL(urlString)
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
        } catch {
            return false
        }
    }

    const getSupportedExtensions = (): string[] => {
        return [
            '.mp4',
            '.webm',
            '.ogg',
            '.jpg',
            '.jpeg',
            '.png',
            '.gif',
            '.webp'
        ]
    }

    const getFileTypeFromUrl = (
        urlString: string
    ): 'video' | 'image' | null => {
        const lowerUrl = urlString.toLowerCase()

        if (lowerUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/)) {
            return 'video'
        }

        if (lowerUrl.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/)) {
            return 'image'
        }

        return null
    }

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value
        onUrlChange(newUrl)
        setValidationStatus('idle')
        setError(null)
        setPreviewUrl(null)
    }

    const handleValidate = async () => {
        if (!url.trim()) {
            setError('Please enter a URL')
            return
        }

        if (!validateUrl(url)) {
            setError('Please enter a valid HTTP or HTTPS URL')
            setValidationStatus('invalid')
            return
        }

        const fileType = getFileTypeFromUrl(url)
        if (!fileType) {
            setError(
                'URL must point to a supported media file (MP4, WebM, OGG, JPEG, PNG, GIF, WebP)'
            )
            setValidationStatus('invalid')
            return
        }

        setIsValidating(true)
        setError(null)

        try {
            // Simulate validation (in real app, you might want to check if URL is accessible)
            await new Promise((resolve) => setTimeout(resolve, 1000))

            setValidationStatus('valid')
            setPreviewUrl(url)
        } catch (err) {
            setError(
                'Failed to validate URL. Please check if the URL is accessible.'
            )
            setValidationStatus('invalid')
        } finally {
            setIsValidating(false)
        }
    }

    const handlePreview = () => {
        if (url && validateUrl(url)) {
            window.open(url, '_blank', 'noopener,noreferrer')
        }
    }

    return (
        <div className="space-y-4">
            {/* URL Input */}
            <div>
                <label
                    htmlFor="wallpaper-url"
                    className="block text-sm font-medium text-text-primary mb-2"
                >
                    Media URL
                </label>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <Input
                            id="wallpaper-url"
                            type="url"
                            placeholder="https://example.com/wallpaper.mp4"
                            value={url}
                            onChange={handleUrlChange}
                            disabled={disabled || isValidating}
                            leftIcon={LinkIcon}
                            error={error || undefined}
                            success={
                                validationStatus === 'valid'
                                    ? 'URL is valid'
                                    : undefined
                            }
                        />
                    </div>
                    <Button
                        variant="secondary"
                        onClick={handleValidate}
                        disabled={disabled || !url.trim() || isValidating}
                        loading={isValidating}
                    >
                        Validate
                    </Button>
                </div>
            </div>

            {/* Preview Button */}
            {validationStatus === 'valid' && previewUrl && (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={Eye}
                        onClick={handlePreview}
                        disabled={disabled}
                    >
                        Preview in Browser
                    </Button>
                </div>
            )}

            {/* Validation Status */}
            {validationStatus === 'valid' && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-success">
                            URL is valid
                        </p>
                        <p className="text-xs text-text-secondary mt-1">
                            Type: {getFileTypeFromUrl(url)}
                        </p>
                    </div>
                </div>
            )}

            {/* Preview */}
            {validationStatus === 'valid' && previewUrl && (
                <div className="rounded-lg border border-border-default overflow-hidden bg-bg-secondary">
                    <div className="aspect-video relative">
                        {getFileTypeFromUrl(previewUrl) === 'video' ? (
                            <video
                                src={previewUrl}
                                className="w-full h-full object-contain"
                                controls
                                muted
                                loop
                            />
                        ) : (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-full object-contain"
                                onError={() => {
                                    setError(
                                        'Failed to load preview. The URL might be invalid or inaccessible.'
                                    )
                                    setValidationStatus('invalid')
                                }}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Supported Formats Info */}
            <div className="rounded-lg bg-bg-elevated p-4 border border-border-subtle">
                <h4 className="text-sm font-medium text-text-primary mb-2">
                    Supported Formats
                </h4>
                <div className="space-y-2 text-xs text-text-secondary">
                    <div>
                        <p className="font-medium text-text-primary mb-1">
                            Video URLs:
                        </p>
                        <p>MP4 (.mp4), WebM (.webm), OGG (.ogg)</p>
                    </div>
                    <div>
                        <p className="font-medium text-text-primary mb-1">
                            Image URLs:
                        </p>
                        <p>
                            JPEG (.jpg, .jpeg), PNG (.png), GIF (.gif), WebP
                            (.webp)
                        </p>
                    </div>
                    <div className="pt-2 border-t border-border-subtle">
                        <p className="text-text-tertiary">
                            💡 The URL must point directly to a media file with
                            a supported extension
                        </p>
                    </div>
                </div>
            </div>

            {/* Examples */}
            <div className="rounded-lg bg-bg-elevated p-4 border border-border-subtle">
                <h4 className="text-sm font-medium text-text-primary mb-2">
                    Example URLs
                </h4>
                <div className="space-y-1 text-xs text-text-tertiary font-mono">
                    <p>https://example.com/video.mp4</p>
                    <p>https://example.com/image.jpg</p>
                    <p>https://cdn.example.com/media/wallpaper.webm</p>
                </div>
            </div>
        </div>
    )
}
