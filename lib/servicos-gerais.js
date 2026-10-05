const art=require('./servicos-gerais-art.json');
function insertServicosGerais(html){
  if(html.includes('data-jr-card="servicosgerais"'))return html;
  let anchor=html.indexOf('data-jr-card="motorista"');
  if(anchor<0)anchor=html.indexOf('data-jr-card="assistente-social"');
  const end=html.indexOf('</a>',anchor);
  if(anchor<0||end<0)throw new Error('Card de referência não encontrado para inserir Serviços Gerais');
  const card='<a class="especifica-card-link" data-jr-card="servicosgerais" data-jr-area="servicosgerais" href="/api/area-entry?area=servicosgerais" target="_blank" rel="noopener" aria-label="Acessar Serviços Gerais SEMUSA e SESAU"><div class="especifica-card jr-servicos-gerais-card"><img src="'+art+'" alt="SEMUSA e SESAU — Serviços Gerais" width="480" height="720" loading="lazy" decoding="async"><span class="jr-uniform-access-btn">Acessar</span></div></a>';
  return (html.slice(0,end+4)+card+html.slice(end+4)).replace('</head>','<style id="jr-servicos-gerais-card-style">#especificas .jr-servicos-gerais-card{position:relative;overflow:hidden;background:#050505}#especificas .jr-servicos-gerais-card img{object-fit:contain!important;transform:none!important;width:100%;height:100%}</style></head>');
}
module.exports={insertServicosGerais};
