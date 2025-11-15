# Arquitetura do Layout - zWallp

## 🎯 Estrutura Moderna e Organizada

O layout foi completamente refatorado para uma arquitetura moderna com componentes fixos e áreas scrolláveis bem definidas.

## 📐 Hierarquia de Componentes

```
AppLayout (Fixed Container)
├── Titlebar (Fixed - 40px)
│   ├── Logo + App Name
│   └── WindowControls (Minimize, Maximize, Close)
│
└── Main Content (Flex-1, Scrollable)
    └── AppTabs
        ├── Sidebar (Resizable, 200-300px)
        │   └── Tab List (Scrollable)
        ├── Resize Handle
        └── Content Area (Scrollable)
            └── WallpaperManager
                ├── Header (Fixed)
                ├── Main Content (Scrollable)
                │   ├── Gallery (Scrollable)
                │   └── Preview Panel (Fixed width)
                └── Controls (Fixed at bottom)
```

## 🔧 Componentes Principais

### AppLayout (`src/components/app-layout.tsx`)

Container principal que gerencia a estrutura fixa da aplicação:

- Titlebar sempre visível no topo
- Área de conteúdo que ocupa o espaço restante
- Previne overflow e garante altura correta

### Titlebar (`src/components/titlebar.tsx`)

Barra de título personalizada:

- Altura fixa de 40px
- Área de drag para mover a janela
- Logo e nome do app
- Controles da janela integrados

### WindowControls (`src/components/window-controls.tsx`)

Botões nativos de controle:

- Minimizar
- Maximizar/Restaurar (com detecção de estado)
- Fechar
- Hover states modernos

### AppTabs (`src/app/tabs.tsx`)

Sistema de abas com sidebar redimensionável:

- Sidebar com largura ajustável (200-300px)
- Handle de resize visual
- Área de conteúdo responsiva

### WallpaperManager (`src/features/wallpaper/pages/WallpaperManager.tsx`)

Gerenciador de wallpapers com layout otimizado:

- Header fixo com contador
- Gallery scrollável
- Preview panel com largura fixa
- Controles fixos no rodapé

## 🎨 Princípios de Design

### 1. Elementos Fixos

Elementos que devem permanecer sempre visíveis usam `flex-none`:

```tsx
<div className="flex-none">
    <Titlebar />
</div>
```

### 2. Áreas Scrolláveis

Áreas que podem ter overflow usam `overflow-y-auto` ou `overflow-hidden`:

```tsx
<div className="flex-1 overflow-y-auto">{/* Conteúdo scrollável */}</div>
```

### 3. Prevenção de Overflow

Container principal usa `overflow-hidden` e `min-h-0`:

```tsx
<div className="flex h-screen flex-col overflow-hidden">
    <div className="flex-1 min-h-0">{/* Conteúdo */}</div>
</div>
```

## 🚀 Benefícios

✅ **Titlebar sempre visível** - Controles da janela nunca desaparecem
✅ **Performance otimizada** - Apenas áreas necessárias fazem scroll
✅ **Layout responsivo** - Adapta-se a diferentes tamanhos de janela
✅ **Hierarquia clara** - Fácil de entender e manter
✅ **Moderno e limpo** - Visual profissional

## 🔍 Classes Tailwind Importantes

- `flex-none` - Elemento com tamanho fixo, não cresce nem encolhe
- `flex-1` - Elemento que ocupa espaço disponível
- `min-h-0` - Permite que flex items encolham abaixo do tamanho do conteúdo
- `overflow-hidden` - Previne scroll no container
- `overflow-y-auto` - Permite scroll vertical quando necessário
- `h-screen` - Altura total da viewport
- `h-full` - 100% da altura do pai

## 📝 Notas de Implementação

1. **Sempre use `flex-none` para elementos fixos** como headers e footers
2. **Use `min-h-0` em containers flex** para permitir scroll correto
3. **Evite `h-screen` em componentes aninhados** - use `h-full` ou `flex-1`
4. **Teste o scroll** em diferentes resoluções e com muito conteúdo
