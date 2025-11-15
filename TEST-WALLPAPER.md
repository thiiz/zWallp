# Teste Rápido do Wallpaper

## 1. Reinicie o servidor de desenvolvimento

```bash
# Pare o servidor atual (Ctrl+C)
# Inicie novamente
bun tauri dev
```

## 2. Teste a página wallpaper diretamente

Abra no navegador: `http://localhost:1420/wallpaper.html`

Você deve ver:

- Fundo preto
- Spinner branco girando
- Texto "Waiting for wallpaper..."

Se isso funcionar, a página está OK.

## 3. Teste o wallpaper na aplicação

1. Na aplicação, clique no botão "+" para adicionar wallpaper
2. Preencha:
    - **Nome**: Test Image
    - **Tipo**: image
    - **Source**: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920`
3. Clique em "Create"
4. Selecione o wallpaper criado
5. Abra o DevTools (F12) para ver os logs
6. Clique em "Apply"

## O que deve acontecer:

1. Console mostra:

    ```
    Creating wallpaper window...
    Sending wallpaper config: {...}
    Applying wallpaper to desktop...
    Wallpaper applied successfully
    ```

2. Uma nova janela em fullscreen aparece
3. A janela mostra o spinner por 1 segundo
4. A janela mostra a imagem
5. A janela é movida para trás do desktop

## Se a janela continuar branca:

1. Verifique se `http://localhost:1420/wallpaper.html` funciona no navegador
2. Abra o DevTools na janela wallpaper (clique nela e pressione F12)
3. Veja se há erros no console
4. Verifique se o evento está sendo recebido

## Teste alternativo com arquivo local:

Se URLs externas não funcionarem, teste com um arquivo local:

1. Coloque uma imagem na pasta `public/` (ex: `public/test.jpg`)
2. Use como source: `test.jpg`
3. Tente aplicar novamente
