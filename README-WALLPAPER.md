# Wallpaper Engine - Tauri v2

Sistema de wallpapers animados para Windows, similar ao Wallpaper Engine.

## 🚀 Funcionalidades

- ✅ Aplicar vídeos como wallpaper
- ✅ Aplicar imagens como wallpaper
- ✅ Criar wallpapers com HTML/CSS/JS
- ✅ Galeria de wallpapers
- ✅ Preview em tempo real
- ✅ Controles de reprodução
- ✅ Interface moderna com Tailwind v4

## 🛠️ Tecnologias

- **Tauri v2**: Framework para aplicações desktop
- **React 19**: Interface do usuário
- **Tailwind CSS v4**: Estilização
- **TypeScript**: Tipagem estática
- **Rust**: Backend e integração com Windows API

## 📦 Instalação

```bash
# Instalar dependências
bun install

# Executar em desenvolvimento
bun tauri dev

# Build para produção
bun tauri build
```

## 🎯 Como Usar

1. **Abrir o Wallpaper Manager**: Clique no botão na tela inicial
2. **Adicionar Wallpaper**: Clique no botão "+" e selecione um arquivo
3. **Selecionar Wallpaper**: Clique em um wallpaper da galeria
4. **Aplicar**: Clique no botão "Apply" para definir como wallpaper
5. **Parar**: Clique em "Stop" para remover o wallpaper

## 📁 Estrutura do Projeto

```
src/
├── features/wallpaper/
│   ├── components/
│   │   ├── WallpaperControls.tsx    # Controles de reprodução
│   │   ├── WallpaperGallery.tsx     # Galeria de wallpapers
│   │   ├── WallpaperPreview.tsx     # Preview do wallpaper
│   │   └── CreateWallpaperDialog.tsx # Dialog para adicionar
│   ├── hooks/
│   │   └── useWallpaper.ts          # Hook para gerenciar wallpapers
│   ├── pages/
│   │   └── WallpaperManager.tsx     # Página principal
│   └── types.ts                      # Tipos TypeScript
│
src-tauri/
├── src/
│   ├── main.rs                       # Entry point
│   └── wallpaper.rs                  # Integração Windows API
```

## 🔧 Funcionalidades Técnicas

### Backend (Rust)

- **WallpaperManager**: Gerencia a janela de wallpaper
- **Windows API Integration**: Usa `FindWindowW`, `SetParent` para integrar com o desktop
- **Tauri Commands**: Expõe funções para o frontend

### Frontend (React)

- **useWallpaper Hook**: Gerencia estado e comunicação com backend
- **WallpaperGallery**: Grid responsivo de wallpapers
- **WallpaperPreview**: Suporta vídeo, imagem e HTML
- **CreateWallpaperDialog**: Interface para adicionar novos wallpapers

## 🎨 Tipos de Wallpaper Suportados

1. **Vídeo**: MP4, WebM, MOV
2. **Imagem**: JPG, PNG, GIF, WebP
3. **HTML**: Wallpapers interativos com HTML/CSS/JS

## 🔐 Permissões

O app requer as seguintes permissões:

- `dialog`: Para selecionar arquivos
- `fs`: Para acessar arquivos do sistema
- `asset-protocol`: Para carregar recursos locais

## 📝 Próximas Funcionalidades

- [ ] Configurações de volume
- [ ] Velocidade de reprodução
- [ ] Qualidade de vídeo
- [ ] Múltiplos monitores
- [ ] Playlist de wallpapers
- [ ] Editor HTML integrado
- [ ] Efeitos e filtros
- [ ] Sincronização com música
- [ ] Workshop/Marketplace

## 🐛 Troubleshooting

### Wallpaper não aparece

- Verifique se o arquivo existe
- Tente reiniciar o Explorer.exe
- Execute como administrador

### Vídeo não reproduz

- Verifique o codec do vídeo
- Use MP4 com H.264

### Performance ruim

- Reduza a resolução do vídeo
- Use qualidade "low" nas configurações

## 📄 Licença

MIT License - veja LICENSE para detalhes
