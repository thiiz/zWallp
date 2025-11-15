# Debug do Wallpaper

## Mudanças Implementadas

1. **Janela wallpaper agora tem tamanho do monitor** - Não mais transparente, mas com tamanho correto
2. **Logs de console adicionados** - Para debug
3. **Página wallpaper com feedback visual** - Mostra estado de carregamento
4. **Rust busca a janela corretamente** - Usa `get_webview_window("wallpaper")`

## Como Testar

### 1. Abra o DevTools

Pressione `F12` na janela principal para ver os logs do console.

### 2. Crie um Wallpaper de Teste

- Clique no botão "+"
- Nome: "Test"
- Tipo: "image"
- Source: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920`

### 3. Aplique o Wallpaper

- Selecione o wallpaper criado
- Clique em "Apply"
- Observe os logs no console:
    ```
    Creating wallpaper window...
    Sending wallpaper config: {...}
    Applying wallpaper to desktop...
    Wallpaper applied successfully
    ```

### 4. Verifique a Janela Wallpaper

A janela deve:

- Aparecer em tela cheia
- Mostrar "Waiting for wallpaper..." com animação
- Depois mostrar a imagem
- Ficar atrás do desktop (Win+D deve mostrar ela)

## Problemas Conhecidos

### Janela não fica atrás do desktop (Win+D faz sumir)

Isso acontece porque o Windows tem proteções contra aplicações que tentam se colocar atrás do desktop. O código atual usa a API do Windows para:

1. Encontrar o "Program Manager" (Progman)
2. Criar um WorkerW
3. Colocar a janela como filha do WorkerW

Se não funcionar, pode ser:

- Permissões do Windows
- Antivírus bloqueando
- Versão do Windows diferente

### Janela branca

Se a janela continuar branca:

1. Verifique se a rota `/wallpaper` está carregando (abra http://localhost:1420/wallpaper no navegador)
2. Verifique os logs do console
3. Tente com uma imagem local em vez de URL

## Teste Manual da Página Wallpaper

Abra no navegador: `http://localhost:1420/wallpaper.html`

Você deve ver a tela de "Waiting for wallpaper..." com animação.

## Mudança de Arquitetura

A janela wallpaper agora usa um arquivo HTML separado (`wallpaper.html`) em vez de rotas React. Isso resolve o problema de roteamento com múltiplas janelas no Tauri.

## Próximos Passos

Se ainda não funcionar, precisamos:

1. Verificar se a janela está sendo criada (logs Rust)
2. Verificar se o evento está sendo recebido (logs na página wallpaper)
3. Testar com arquivo local em vez de URL
