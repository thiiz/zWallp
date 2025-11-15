import React, { useState, useRef } from 'react'
import {
    Upload,
    FileVideo,
    FileImage,
    X,
    CheckCircle2,
    AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadTabProps {
    onFileSelect: (file: File) => void
    selectedFile: File | null
    onClearFile: () => void
    disabled?: boolean
}

const ACCEPTED_FILE_TYPES = {
    video: ['video/mp4', 'video/webm', 'video/ogg'],
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
}

const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB

export function FileUploadTab({
    onFileSelect,
    selectedFile,
    onClearFile,
    disabled = false
}: FileUploadTabProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const validateFile = (file: File): string | null => {
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            return `File size exceeds 500MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`
        }

        // Check file type
        const allAcceptedTypes = [
            ...ACCEPTED_FILE_TYPES.video,
            ...ACCEPTED_FILE_TYPES.image
        ]
        if (!allAcceptedTypes.includes(file.type)) {
            return `Unsupported file type: ${file.type}. Please use MP4, WebM, OGG, JPEG, PNG, GIF, or WebP.`
        }

        return null
    }

    const handleFile = (file: File) => {
        setError(null)
        const validationError = validateFile(file)

        if (validationError) {
            setError(validationError)
            return
        }

        // Simulate upload progress
        setUploadProgress(0)
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + 10
            })
        }, 50)

        onFileSelect(file)
    }

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!disabled) {
            setIsDragging(true)
        }
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (disabled) return

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            handleFile(files[0])
        }
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            handleFile(files[0])
        }
    }

    const handleBrowseClick = () => {
        fileInputRef.current?.click()
    }

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('video/')) {
            return <FileVideo className="h-12 w-12 text-accent-primary" />
        }
        return <FileImage className="h-12 w-12 text-accent-primary" />
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
        return `${(bytes / 1024 / 1024).toFixed(2)} MB`
    }

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={cn(
                    'relative rounded-lg border-2 border-dashed transition-all duration-200',
                    'flex flex-col items-center justify-center p-8 min-h-[240px]',
                    isDragging && !disabled
                        ? 'border-accent-primary bg-accent-primary/10 scale-[1.02]'
                        : 'border-border-default hover:border-border-strong',
                    disabled && 'opacity-50 cursor-not-allowed',
                    !disabled && 'cursor-pointer'
                )}
                onClick={
                    !disabled && !selectedFile ? handleBrowseClick : undefined
                }
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={[
                        ...ACCEPTED_FILE_TYPES.video,
                        ...ACCEPTED_FILE_TYPES.image
                    ].join(',')}
                    onChange={handleFileInputChange}
                    className="hidden"
                    disabled={disabled}
                />

                {!selectedFile ? (
                    <>
                        <div
                            className={cn(
                                'rounded-full p-4 mb-4 transition-all duration-200',
                                isDragging
                                    ? 'bg-accent-primary/20 scale-110'
                                    : 'bg-bg-elevated'
                            )}
                        >
                            <Upload
                                className={cn(
                                    'h-8 w-8 transition-colors duration-200',
                                    isDragging
                                        ? 'text-accent-primary'
                                        : 'text-text-secondary'
                                )}
                            />
                        </div>

                        <p className="text-base font-medium text-text-primary mb-1">
                            {isDragging
                                ? 'Drop file here'
                                : 'Drag and drop your file here'}
                        </p>
                        <p className="text-sm text-text-secondary mb-4">or</p>
                        <button
                            type="button"
                            onClick={handleBrowseClick}
                            disabled={disabled}
                            className={cn(
                                'px-4 py-2 rounded-lg bg-accent-primary text-white font-medium',
                                'hover:bg-accent-hover active:bg-accent-active transition-colors duration-200',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2',
                                disabled && 'opacity-50 cursor-not-allowed'
                            )}
                        >
                            Browse Files
                        </button>
                    </>
                ) : (
                    <div className="w-full">
                        <div className="flex items-start gap-4">
                            <div className="shrink-0">
                                {getFileIcon(selectedFile)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-medium text-text-primary truncate">
                                            {selectedFile.name}
                                        </p>
                                        <p className="text-sm text-text-secondary">
                                            {formatFileSize(selectedFile.size)}{' '}
                                            • {selectedFile.type}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onClearFile()
                                            setUploadProgress(0)
                                        }}
                                        disabled={disabled}
                                        className="shrink-0 p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Progress Bar */}
                                {uploadProgress > 0 && uploadProgress < 100 && (
                                    <div className="mt-3">
                                        <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-accent-primary transition-all duration-300 ease-out"
                                                style={{
                                                    width: `${uploadProgress}%`
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs text-text-tertiary mt-1">
                                            Uploading... {uploadProgress}%
                                        </p>
                                    </div>
                                )}

                                {uploadProgress === 100 && (
                                    <div className="mt-3 flex items-center gap-2 text-success">
                                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                                        <p className="text-sm">File ready</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-error/10 border border-error/20">
                    <AlertCircle className="h-5 w-5 text-error shrink-0 mt-0.5" />
                    <p className="text-sm text-error">{error}</p>
                </div>
            )}

            {/* Supported Formats */}
            <div className="text-xs text-text-tertiary">
                <p className="font-medium mb-1">Supported formats:</p>
                <p>Videos: MP4, WebM, OGG (max 500MB)</p>
                <p>Images: JPEG, PNG, GIF, WebP (max 500MB)</p>
            </div>
        </div>
    )
}
