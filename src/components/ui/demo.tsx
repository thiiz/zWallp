/**
 * Demo file showcasing all base UI components
 * This file demonstrates the usage of Button, Input, Card, Modal, and Toast components
 *
 * Usage: Import this component in your app to see all components in action
 */

import React, { useState } from 'react'
import { Play, Search, Heart, Trash2 } from 'lucide-react'
import { Button } from './button'
import { Input } from './input'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from './card'
import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalContent,
    ModalFooter
} from './modal'
import { ToastProvider, useToastContext } from '@/lib/providers/toast-provider'

function DemoContent() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToastContext()

    const handleLoadingDemo = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success('Action completed!', {
                message: 'The operation finished successfully.'
            })
        }, 2000)
    }

    return (
        <div className="min-h-screen bg-bg-primary p-8">
            <div className="mx-auto max-w-6xl space-y-8">
                <h1 className="text-4xl font-bold text-text-primary">
                    UI Components Demo
                </h1>

                {/* Button Variants */}
                <Card>
                    <CardHeader>
                        <CardTitle>Button Variants</CardTitle>
                        <CardDescription>
                            Different button styles and states
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-3">
                            <Button variant="primary">Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="danger">Danger</Button>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button size="sm">Small</Button>
                            <Button size="md">Medium</Button>
                            <Button size="lg">Large</Button>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button leftIcon={Play}>With Left Icon</Button>
                            <Button rightIcon={Heart}>With Right Icon</Button>
                            <Button
                                loading={isLoading}
                                onClick={handleLoadingDemo}
                            >
                                {isLoading ? 'Loading...' : 'Click to Load'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Input Variants */}
                <Card>
                    <CardHeader>
                        <CardTitle>Input Variants</CardTitle>
                        <CardDescription>
                            Text inputs with different states
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input placeholder="Default input" />
                        <Input placeholder="Search..." leftIcon={Search} />
                        <Input
                            placeholder="With right icon"
                            rightIcon={Heart}
                        />
                        <Input
                            placeholder="Error state"
                            error="This field is required"
                        />
                        <Input
                            placeholder="Success state"
                            success="Looks good!"
                        />
                        <Input
                            type="number"
                            placeholder="Number input"
                            inputSize="lg"
                        />
                    </CardContent>
                </Card>

                {/* Card Variants */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card variant="default">
                        <CardHeader>
                            <CardTitle>Default Card</CardTitle>
                            <CardDescription>
                                Standard card style
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-text-secondary">
                                This is a default card with standard styling.
                            </p>
                        </CardContent>
                    </Card>

                    <Card variant="elevated" elevation="lg">
                        <CardHeader>
                            <CardTitle>Elevated Card</CardTitle>
                            <CardDescription>Card with shadow</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-text-secondary">
                                This card has elevation and shadow.
                            </p>
                        </CardContent>
                    </Card>

                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle>Glass Card</CardTitle>
                            <CardDescription>
                                Glass-morphism effect
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-text-secondary">
                                This card uses glass-morphism styling.
                            </p>
                        </CardContent>
                    </Card>

                    <Card variant="default" interactive>
                        <CardHeader>
                            <CardTitle>Interactive Card</CardTitle>
                            <CardDescription>
                                Hover to see effect
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-text-secondary">
                                This card has hover and click effects.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Modal Demo */}
                <Card>
                    <CardHeader>
                        <CardTitle>Modal Component</CardTitle>
                        <CardDescription>
                            Click to open modal dialog
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => setIsModalOpen(true)}>
                            Open Modal
                        </Button>
                    </CardContent>
                </Card>

                {/* Toast Demo */}
                <Card>
                    <CardHeader>
                        <CardTitle>Toast Notifications</CardTitle>
                        <CardDescription>
                            Click buttons to show different toast types
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-3">
                        <Button
                            variant="primary"
                            onClick={() =>
                                toast.success('Success!', {
                                    message: 'Operation completed successfully.'
                                })
                            }
                        >
                            Show Success
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() =>
                                toast.error('Error!', {
                                    message: 'Something went wrong.'
                                })
                            }
                        >
                            Show Error
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() =>
                                toast.warning('Warning!', {
                                    message: 'Please be careful.'
                                })
                            }
                        >
                            Show Warning
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() =>
                                toast.info('Info', {
                                    message: 'Here is some information.'
                                })
                            }
                        >
                            Show Info
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() =>
                                toast.success('With Action', {
                                    message: 'Click the action button',
                                    action: {
                                        label: 'Undo',
                                        handler: () =>
                                            console.log('Undo clicked')
                                    }
                                })
                            }
                        >
                            With Action
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalHeader>
                    <ModalTitle>Example Modal</ModalTitle>
                    <ModalDescription>
                        This is a modal dialog with backdrop blur and animations
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    <p className="text-text-secondary">
                        You can press Escape to close this modal, or click the
                        backdrop. The modal includes smooth animations and
                        keyboard handling.
                    </p>
                    <div className="mt-4 space-y-3">
                        <Input placeholder="Try typing something..." />
                        <Input placeholder="Another input field" />
                    </div>
                </ModalContent>
                <ModalFooter>
                    <Button
                        variant="ghost"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            toast.success('Saved!', {
                                message: 'Your changes have been saved.'
                            })
                            setIsModalOpen(false)
                        }}
                    >
                        Save Changes
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export function UIComponentsDemo() {
    return (
        <ToastProvider>
            <DemoContent />
        </ToastProvider>
    )
}
