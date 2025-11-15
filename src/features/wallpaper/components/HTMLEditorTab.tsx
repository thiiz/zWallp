import React, { useState } from 'react'
import { Code, Eye, EyeOff, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HTMLEditorTabProps {
    html: string
    onHtmlChange: (html: string) => void
    disabled?: boolean
}

interface Template {
    id: string
    name: string
    description: string
    code: string
    preview: string
}

const templates: Template[] = [
    {
        id: 'gradient',
        name: 'Animated Gradient',
        description: 'Smooth animated gradient background',
        preview: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
        code: `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
        }
        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    </style>
</head>
<body></body>
</html>`
    },
    {
        id: 'particles',
        name: 'Floating Particles',
        description: 'Animated particles floating on dark background',
        preview: 'radial-gradient(circle, #1a1a2e 0%, #0f0f1e 100%)',
        code: `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: #0f0f1e;
        }
        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            animation: float 20s infinite;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-100vh) translateX(50px); }
        }
    </style>
</head>
<body>
    <script>
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            document.body.appendChild(particle);
        }
    </script>
</body>
</html>`
    },
    {
        id: 'waves',
        name: 'Wave Animation',
        description: 'Smooth wave animation with gradient',
        preview: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
        code: `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
        }
        .wave {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100px;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"><path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="rgba(255,255,255,0.1)"/></svg>');
            background-size: cover;
            animation: wave 10s linear infinite;
        }
        @keyframes wave {
            0% { background-position: 0 0; }
            100% { background-position: 1200px 0; }
        }
    </style>
</head>
<body>
    <div class="wave"></div>
</body>
</html>`
    }
]

export function HTMLEditorTab({
    html,
    onHtmlChange,
    disabled = false
}: HTMLEditorTabProps) {
    const [showPreview, setShowPreview] = useState(false)
    const [showTemplates, setShowTemplates] = useState(true)

    const handleTemplateSelect = (template: Template) => {
        onHtmlChange(template.code)
        setShowTemplates(false)
        setShowPreview(true)
    }

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onHtmlChange(e.target.value)
    }

    return (
        <div className="space-y-4">
            {/* Template Gallery */}
            {showTemplates && !html && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-text-primary flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-accent-primary" />
                            Template Gallery
                        </h4>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {templates.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => handleTemplateSelect(template)}
                                disabled={disabled}
                                className={cn(
                                    'group relative rounded-lg overflow-hidden border border-border-default',
                                    'hover:border-accent-primary hover:shadow-lg transition-all duration-200',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary',
                                    disabled && 'opacity-50 cursor-not-allowed'
                                )}
                            >
                                <div
                                    className="aspect-video"
                                    style={{ background: template.preview }}
                                />
                                <div className="p-3 bg-bg-elevated">
                                    <p className="text-sm font-medium text-text-primary text-left">
                                        {template.name}
                                    </p>
                                    <p className="text-xs text-text-secondary text-left mt-1">
                                        {template.description}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="text-center">
                        <button
                            onClick={() => setShowTemplates(false)}
                            disabled={disabled}
                            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                        >
                            or start from scratch
                        </button>
                    </div>
                </div>
            )}

            {/* Code Editor */}
            {(!showTemplates || html) && (
                <>
                    <div className="flex items-center justify-between">
                        <label
                            htmlFor="html-editor"
                            className="text-sm font-medium text-text-primary flex items-center gap-2"
                        >
                            <Code className="h-4 w-4" />
                            HTML Code
                        </label>
                        <div className="flex items-center gap-2">
                            {html && templates.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={Sparkles}
                                    onClick={() => setShowTemplates(true)}
                                    disabled={disabled}
                                >
                                    Templates
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                leftIcon={showPreview ? EyeOff : Eye}
                                onClick={() => setShowPreview(!showPreview)}
                                disabled={disabled || !html}
                            >
                                {showPreview ? 'Hide' : 'Show'} Preview
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {/* Editor */}
                        <div
                            className={cn(
                                showPreview && html && 'grid grid-cols-2 gap-4'
                            )}
                        >
                            <div>
                                <textarea
                                    id="html-editor"
                                    value={html}
                                    onChange={handleCodeChange}
                                    disabled={disabled}
                                    placeholder="<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: linear-gradient(45deg, #667eea, #764ba2);
        }
    </style>
</head>
<body>
    <h1>Your HTML Wallpaper</h1>
</body>
</html>"
                                    className={cn(
                                        'w-full h-[400px] p-4 rounded-lg border border-border-default',
                                        'bg-bg-elevated text-text-primary font-mono text-sm',
                                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary',
                                        'resize-none',
                                        disabled &&
                                            'opacity-50 cursor-not-allowed'
                                    )}
                                    spellCheck={false}
                                />
                            </div>

                            {/* Live Preview */}
                            {showPreview && html && (
                                <div>
                                    <div className="rounded-lg border border-border-default overflow-hidden bg-bg-secondary">
                                        <div className="bg-bg-elevated px-3 py-2 border-b border-border-default">
                                            <p className="text-xs text-text-secondary flex items-center gap-2">
                                                <Eye className="h-3 w-3" />
                                                Live Preview
                                            </p>
                                        </div>
                                        <div className="aspect-video relative">
                                            <iframe
                                                srcDoc={html}
                                                className="w-full h-full border-0"
                                                sandbox="allow-scripts"
                                                title="HTML Preview"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Info */}
            <div className="rounded-lg bg-bg-elevated p-4 border border-border-subtle">
                <h4 className="text-sm font-medium text-text-primary mb-2">
                    HTML Wallpaper Tips
                </h4>
                <ul className="space-y-1 text-xs text-text-secondary">
                    <li>• Use CSS animations for smooth, performant effects</li>
                    <li>• Keep JavaScript minimal for better performance</li>
                    <li>
                        • Test your wallpaper in the preview before applying
                    </li>
                    <li>
                        • Avoid external resources that require internet
                        connection
                    </li>
                    <li>
                        • Use inline styles and scripts for best compatibility
                    </li>
                </ul>
            </div>
        </div>
    )
}
