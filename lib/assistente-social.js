const art = require('./assistente-social-art.json');

function insertAssistenteSocial(html) {
  if (html.includes('data-jr-card="assistente-social"')) return html;
  const source = html.indexOf('alt="Agente de Saúde e Fiscal Sanitário"');
  const end = html.indexOf('</a>', source);
  if (source < 0 || end < 0) throw new Error('Card de Fiscal Sanitário não encontrado');
  const card = `<a class="especifica-card-link" data-jr-card="assistente-social" data-jr-area="acsfiscal" href="/api/area-entry?area=acsfiscal&variant=assistentesocial" target="_blank" rel="noopener" aria-label="Acessar Assistente Social SEMUSA e SESAU">
    <div class="especifica-card jr-assistente-social-card"><img src="${art}" alt="SEMUSA e SESAU — Assistente Social" width="1024" height="1536" loading="lazy" decoding="async"><span class="jr-uniform-access-btn">Acessar</span></div></a>`;
  return (html.slice(0, end + 4) + card + html.slice(end + 4)).replace('</head>', '<style id="jr-assistente-social-card-style">#especificas .jr-assistente-social-card{position:relative;overflow:hidden;background:#050505}#especificas .jr-assistente-social-card img{object-fit:contain!important;transform:none!important;width:100%;height:100%}</style></head>');
}

module.exports = { insertAssistenteSocial };
