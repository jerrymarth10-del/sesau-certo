# Validação SEMED e catálogo — 20/10/2026

Branch: `fix/semed-cards-20261020`.

Execute da raiz do repositório: `node scripts/check-catalog.cjs`.
O comando monta a resposta real da função, verifica catálogo e JavaScript e encerra com código diferente de zero quando encontra uma regressão. Não usa credenciais reais nem faz compras.

## Resultado local

- Montagem HTTP 200; 31 links de cards (o navegador já consolida o Administrativo legado).
- Professor SEMED usa a imagem JPEG Base64 de 78.490 bytes e o identificador pedagógica legado `pedagogia`.
- Redirecionamento real de `area-entry` confirmado para o bloco `pedagogia` do Projeto 2.
- Cuidador e Secretaria incluídos no mapa de artes reais, preservando as imagens Base64 existentes.
- 30 imagens embutidas da resposta decodificadas sem erro em verificação auxiliar.

## Limites e publicação

Não houve alteração em checkout, pagamento, credenciais ou regras de compra.
Testes locais de montagem, sintaxe, imagens e invariantes aprovados. Validação visual da nova versão em preview e testes no iPhone ainda pendentes. A inspeção da versão atualmente publicada não equivale a validar a branch nova.
Envio ao GitHub autorizado explicitamente pelo usuário em 20/10/2026, após a revisão automática solicitar confirmação dos destinos. Validação de preview em andamento; nenhum deploy de produção realizado.

Após autorização: enviar a branch, aguardar preview, verificar imagens, botões e navegação em desktop/celular; publicar somente depois da validação.
