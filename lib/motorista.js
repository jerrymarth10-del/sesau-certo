const art=require('./motorista-art.json');
function insertMotorista(html){
  if(html.includes('data-jr-card="motorista"'))return html;
  const anchor=html.indexOf('data-jr-card="assistente-social"');
  const end=html.indexOf('</a>',anchor);
  if(anchor<0||end<0)throw new Error('Card de Assistente Social não encontrado para inserir Motorista');
  const card='<a class="especifica-card-link" data-jr-card="motorista" data-jr-area="motorista" href="/api/area-entry?area=motorista" target="_blank" rel="noopener" aria-label="Acessar Motorista SEMUSA e SESAU"><div class="especifica-card jr-motorista-card"><img src="'+art+'" alt="SEMUSA e SESAU — Motorista" width="1024" height="1536" loading="lazy" decoding="async"><span class="jr-uniform-access-btn">Acessar</span></div></a>';
  return (html.slice(0,end+4)+card+html.slice(end+4)).replace('</head>','<style id="jr-motorista-card-style">#especificas .jr-motorista-card{position:relative;overflow:hidden;background:#050505}#especificas .jr-motorista-card img{object-fit:contain!important;transform:none!important;width:100%;height:100%}</style></head>');
}
module.exports={insertMotorista};
