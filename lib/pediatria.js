const art=require('./pediatria-art');

function insertPediatria(html){
  if(html.includes('data-jr-card="pediatria"'))return html;
  let anchor=html.indexOf('data-jr-card="servicosgerais"');
  if(anchor<0)anchor=html.indexOf('data-jr-card="motorista"');
  if(anchor<0)anchor=html.indexOf('data-jr-card="assistente-social"');
  const end=html.indexOf('</a>',anchor);
  if(anchor<0||end<0)throw new Error('Card de referência não encontrado para inserir Médico Pediatra');
  const card='<a class="especifica-card-link" data-jr-card="pediatria" data-jr-area="pediatria" href="/api/area-entry?area=pediatria" target="_blank" rel="noopener" aria-label="Acessar Médico Pediatra SEMUSA e SESAU"><div class="especifica-card jr-pediatria-card"><img src="'+art+'" alt="SEMUSA e SESAU — Médico Pediatra" width="180" height="270" loading="lazy" decoding="async"><span class="jr-uniform-access-btn">Acessar</span></div></a>';
  return (html.slice(0,end+4)+card+html.slice(end+4)).replace('</head>','<style id="jr-pediatria-card-style">#especificas .jr-pediatria-card{position:relative;overflow:hidden;background:#050505;aspect-ratio:2/3}#especificas .jr-pediatria-card img{object-fit:contain!important;transform:none!important;width:100%;height:100%;display:block}</style></head>');
}
module.exports={insertPediatria};
