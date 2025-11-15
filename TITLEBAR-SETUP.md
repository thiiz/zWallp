# Configuração da Titlebar Personalizada

## ✅ Implementação Completa

Titlebar personalizada criada usando a API nativa do Tauri (compatível com React 19):

### Componentes Criados

- ✅ `WindowControls` - Botões de minimizar, maximizar e fechar
- ✅ `Titlebar` - Barra de título com drag region

### Configuração

- ✅ Janela configurada sem decorações no `tauri.conf.json`
- ✅ Usa API nativa do Tauri 2.x (@tauri-apps/api/window)
- ✅ Totalmente compatível com React 19

## 📦 Componentes

### WindowControls (`src/components/window-controls.tsx`)

Botões de controle da janela com funcionalidade nativa:

- Minimizar
- Maximizar/Restaurar (detecta estado automaticamente)
- Fechar

### Titlebar (`src/components/titlebar.tsx`)

Barra de título completa com:

- Área de drag (data-tauri-drag-region)
- Nome do app
- Controles da janela

```tsx
import { Titlebar } from '@/components/titlebar'

// Já integrado em src/app/tabs.tsx
;<Titlebar />
```

## 🎨 Personalização

### Modificar WindowControls

```tsx
// src/components/window-controls.tsx
// Personalize cores, ícones e comportamento
<button onClick={handleClose} className="h-full w-12 hover:bg-red-600">
    <X className="w-4 h-4" />
</button>
```

### Modificar Titlebar

```tsx
// src/components/titlebar.tsx
// Adicione logo, menus, etc.
<div className="flex h-full items-center px-3">
    <img src="logo.png" />
    <span>zWallp</span>
</div>
```

## 🚀 Uso

A titlebar já está integrada no `src/app/tabs.tsx`. Para testar:

```bash
bun tauri dev
```

## 📝 Notas

- A janela está configurada com `decorations: false` no `tauri.conf.json`
- Use `data-tauri-drag-region` em elementos que devem permitir arrastar a janela
- Os controles usam a API nativa do Tauri: `getCurrentWindow()`
- Funciona perfeitamente com React 19
- Ícones do lucide-react (já instalado no projeto)

## 🔧 API Tauri Usada

```tsx
import { getCurrentWindow } from '@tauri-apps/api/window'

const appWindow = getCurrentWindow()

// Métodos disponíveis:
await appWindow.minimize()
await appWindow.toggleMaximize()
await appWindow.close()
await appWindow.isMaximized()
appWindow.onResized(callback)
```
