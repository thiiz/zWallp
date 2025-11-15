import React, { useState } from 'react'
import { Upload, Link as LinkIcon, Code } from 'lucide-react'
import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalContent,
    ModalFooter
} from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FileUploadTab } from './FileUploadTab'
import { URLInputTab } from './URLInputTab'
import { HTMLEditorTab } from './HTMLEditorTab'
import { MetadataForm } from './MetadataForm'
import type { Wallpaper } from '../types'

export interface AddWallpaperModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (wallpaper: Omit<Wallpaper, 'id' | 'createdAt'>) => Promise<void>
}

type TabType = 'file' | 'url' | 'html'

interface Tab {
    id: TabType
    label: string
    icon: React.ElementType
}

const tabs: Tab[] = [
    { id: 'file', label: 'File', icon: Upload },
    { id: 'url', label: 'URL', icon: LinkIcon },
    { id: 'html', label: 'HTML', icon: Code }
]

export function AddWallpaperModal({
    isOpen,
    onClose,
    onAdd
}: AddWallpaperModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>('file')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // File tab state
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    // URL tab state
    const [url, setUrl] = useState('')

    // HTML tab state
    const [html, setHtml] = useState('')

    // Metadata state
    const [name, setName] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [description, setDescription] = useState('')

    const resetForm = () => {
        setActiveTab('file')
        setSelectedFile(null)
        setUrl('')
        setHtml('')
        setName('')
        setTags([])
        setDescription('')
    }

    const handleClose = () => {
        if (!isSubmitting) {
            resetForm()
            onClose()
        }
    }

    const getWallpaperType = (): 'video' | 'image' | 'html' => {
        if (activeTab === 'html') return 'html'

        if (activeTab === 'file' && selectedFile) {
            return selectedFile.type.startsWith('video/') ? 'video' : 'image'
        }

        if (activeTab === 'url' && url) {
            const lowerUrl = url.toLowerCase()
            if (lowerUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/)) return 'video'
            return 'image'
        }

        return 'image'
    }

    const getWallpaperSource = (): string => {
        if (activeTab === 'file' && selectedFile) {
            // In a real app, you would upload the file and return the path
            return URL.createObjectURL(selectedFile)
        }
        if (activeTab === 'url') return url
        if (activeTab === 'html') return html
        return ''
    }

    const getAutoFillName = (): string => {
        if (activeTab === 'file' && selectedFile) {
            return selectedFile.name.replace(/\.[^/.]+$/, '') // Remove extension
        }
        if (activeTab === 'url' && url) {
            try {
                const urlObj = new URL(url)
                const pathname = urlObj.pathname
                const filename = pathname.substring(
                    pathname.lastIndexOf('/') + 1
                )
                return filename.replace(/\.[^/.]+$/, '') || 'URL Wallpaper'
            } catch {
                return 'URL Wallpaper'
            }
        }
        if (activeTab === 'html') {
            return 'HTML Wallpaper'
        }
        return ''
    }

    const isFormValid = (): boolean => {
        if (!name.trim()) return false

        if (activeTab === 'file' && !selectedFile) return false
        if (activeTab === 'url' && !url.trim()) return false
        if (activeTab === 'html' && !html.trim()) return false

        return true
    }

    const handleSubmit = async () => {
        if (!isFormValid()) return

        setIsSubmitting(true)

        try {
            const wallpaperData: Omit<Wallpaper, 'id' | 'createdAt'> = {
                name: name.trim(),
                type: getWallpaperType(),
                source: getWallpaperSource(),
                thumbnail: getWallpaperSource(), // In real app, generate proper thumbnail
                tags,
                isFavorite: false,
                isActive: false,
                metadata: selectedFile
                    ? {
                          fileSize: selectedFile.size
                      }
                    : undefined
            }

            await onAdd(wallpaperData)
            resetForm()
            onClose()
        } catch (error) {
            console.error('Failed to add wallpaper:', error)
            // Error handling would show a toast notification in real app
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="lg"
            closeOnBackdrop={!isSubmitting}
            closeOnEscape={!isSubmitting}
            showCloseButton={!isSubmitting}
        >
            <ModalHeader>
                <ModalTitle>Add Wallpaper</ModalTitle>
                <ModalDescription>
                    Add a new wallpaper from a file, URL, or HTML code
                </ModalDescription>
            </ModalHeader>

            <ModalContent className="max-h-[70vh] overflow-y-auto">
                {/* Tab Navigation */}
                <div className="mb-6 flex gap-2 border-b border-border-default sticky top-0 bg-bg-primary z-10">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                disabled={isSubmitting}
                                className={cn(
                                    'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200',
                                    'border-b-2 -mb-px',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2',
                                    isActive
                                        ? 'border-accent-primary text-accent-primary'
                                        : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-strong',
                                    isSubmitting &&
                                        'opacity-50 cursor-not-allowed'
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {activeTab === 'file' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                            <FileUploadTab
                                onFileSelect={setSelectedFile}
                                selectedFile={selectedFile}
                                onClearFile={() => setSelectedFile(null)}
                                disabled={isSubmitting}
                            />
                        </div>
                    )}
                    {activeTab === 'url' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                            <URLInputTab
                                url={url}
                                onUrlChange={setUrl}
                                disabled={isSubmitting}
                            />
                        </div>
                    )}
                    {activeTab === 'html' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                            <HTMLEditorTab
                                html={html}
                                onHtmlChange={setHtml}
                                disabled={isSubmitting}
                            />
                        </div>
                    )}

                    {/* Metadata Form */}
                    <MetadataForm
                        name={name}
                        onNameChange={setName}
                        tags={tags}
                        onTagsChange={setTags}
                        description={description}
                        onDescriptionChange={setDescription}
                        disabled={isSubmitting}
                        autoFillName={getAutoFillName()}
                    />
                </div>
            </ModalContent>

            <ModalFooter>
                <Button
                    variant="secondary"
                    onClick={handleClose}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    loading={isSubmitting}
                    disabled={isSubmitting || !isFormValid()}
                    onClick={handleSubmit}
                >
                    Add Wallpaper
                </Button>
            </ModalFooter>
        </Modal>
    )
}
