import { useState, useCallback, DragEvent } from 'react'

interface UseDragAndDropOptions {
    onFilesDropped: (files: File[]) => void
    acceptedTypes?: string[]
}

interface UseDragAndDropReturn {
    isDragging: boolean
    handleDragEnter: (e: DragEvent) => void
    handleDragLeave: (e: DragEvent) => void
    handleDragOver: (e: DragEvent) => void
    handleDrop: (e: DragEvent) => void
}

const DEFAULT_ACCEPTED_TYPES = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'text/html'
]

export function useDragAndDrop({
    onFilesDropped,
    acceptedTypes = DEFAULT_ACCEPTED_TYPES
}: UseDragAndDropOptions): UseDragAndDropReturn {
    const [isDragging, setIsDragging] = useState(false)
    const [dragCounter, setDragCounter] = useState(0)

    const validateFiles = useCallback(
        (files: File[]): File[] => {
            return files.filter((file) => {
                // Check if file type is accepted
                const isAccepted = acceptedTypes.some((type) => {
                    if (type.endsWith('/*')) {
                        const baseType = type.split('/')[0]
                        return file.type.startsWith(baseType + '/')
                    }
                    return file.type === type
                })

                return isAccepted
            })
        },
        [acceptedTypes]
    )

    const handleDragEnter = useCallback((e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        setDragCounter((prev) => prev + 1)
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        setDragCounter((prev) => {
            const newCounter = prev - 1
            if (newCounter === 0) {
                setIsDragging(false)
            }
            return newCounter
        })
    }, [])

    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const handleDrop = useCallback(
        (e: DragEvent) => {
            e.preventDefault()
            e.stopPropagation()

            setIsDragging(false)
            setDragCounter(0)

            const files = Array.from(e.dataTransfer.files)
            const validFiles = validateFiles(files)

            if (validFiles.length > 0) {
                onFilesDropped(validFiles)
            }
        },
        [onFilesDropped, validateFiles]
    )

    return {
        isDragging,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop
    }
}
