# Como Usar o Wallpaper Engine

## Implementação Completa

O sistema agora está configurado com rotas separadas:

- **Rota `/`** - Interface principal (gerenciador de wallpapers)
- **Rota `/wallpaper`** - Janela de exibição do wallpaper

## Como Funciona

1. **Criar Wallpaper**: Clique no botão "+" para adicionar um novo wallpaper
    - Escolha o tipo: Video, Image ou HTML
    - Forneça o caminho/URL do arquivo

2. **Aplicar Wallpaper**:
    - Selecione um wallpaper da galeria
    - Clique no botão "Apply"
    - Uma nova janela será criada e posicionada atrás do desktop
    - O wallpaper selecionado será exibido nessa janela

3. **Remover Wallpaper**: Clique no botão "Stop" para remover

## Tipos de Wallpaper Suportados

- **Video** (`.mp4`, `.webm`) - Reproduz em loop
- **Image** (`.jpg`, `.png`, `.gif`) - Exibe imagem estática
- **HTML** - Carrega página web via iframe

## Exemplo de Teste Rápido

Para testar rapidamente, você pode usar URLs públicas:

**Imagem:**

```
https://images.unsplash.com/photo-1506905925346-21bda4d32df4
```

**Video:**

```
https://www.w3schools.com/html/mov_bbb.mp4
```

**HTML:**

```
https://codepen.io/moklick/full/OPwqLz
```

## Arquitetura

```
┌─────────────────┐         ┌──────────────────┐
│  Main Window    │         │ Wallpaper Window │
│  (Manager UI)   │ ──────> │  (Display Only)  │
│  Route: /       │  Event  │  Route: /wallpaper│
└─────────────────┘         └──────────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Desktop    │
                              │  Background  │
                              └──────────────┘
```

## Permissões Configuradas

- Main window: Pode criar janelas, emitir eventos, acessar arquivos
- Wallpaper window: Pode receber eventos, acessar arquivos (para mídia)
