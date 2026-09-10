JR APOSTILAS — PWA COMPLETO

ARQUIVOS
- index.html .............. Projeto 1
- especificas.html ....... Projeto 2 / áreas específicas
- manifest.webmanifest ... configuração do aplicativo
- sw.js .................. service worker / cache do aplicativo
- icon-192.png
- icon-512.png
- apple-touch-icon.png
- api/ ................... autenticação do Projeto 1 no servidor Vercel
- vercel.json

DEPLOY
1. Envie TODOS estes arquivos e a pasta api para o mesmo projeto do Vercel.
2. Mantenha no Vercel as variáveis:
   JR_PLATFORM_PASSWORD
   JR_SESSION_SECRET
3. Faça Redeploy.
4. Abra o site via HTTPS.
5. Android/Chrome/Edge: use "Instalar aplicativo".
6. iPhone/iPad: Compartilhar > Adicionar à Tela de Início.

IMPORTANTE
- Projeto 1 e Projeto 2 passam a navegar dentro do mesmo PWA.
- Os 17 cards de áreas específicas do Projeto 1 agora abrem ./especificas.html.
- O botão Voltar do Projeto 2 retorna ao Projeto 1.
- As páginas e recursos locais do aplicativo ficam em cache.
- YouTube e PDFs hospedados em sites externos dependem de internet.
- A autenticação /api não é armazenada no cache do Service Worker.


ATUALIZAÇÃO DE IDENTIDADE VISUAL
- Nome do aplicativo: JR A Prova
- Nova logo oficial aplicada aos ícones do PWA.
- Ícones 144, 180, 192, 256, 384 e 512 px.
- Cache do Service Worker atualizado para a nova versão.
- Projeto 1 + Projeto 2 continuam integrados no mesmo aplicativo.
