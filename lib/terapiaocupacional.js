const art=require('./terapiaocupacional-art');

function insertTerapiaOcupacional(html){
  if(html.includes('data-jr-card="terapiaocupacional"'))return html;
  let anchor=html.indexOf('data-jr-card="servicosgerais"');
  if(anchor<0)anchor=html.indexOf('data-jr-card="motorista"');
  if(anchor<0)anchor=html.indexOf('data-jr-card="assistente-social"');
  const end=html.indexOf('</a>',anchor);
  if(anchor<0||end<0)throw new Error('Card de referência não encontrado para inserir Terapia Ocupacional');
  const card='<a class="especifica-card-link" data-jr-card="terapiaocupacional" data-jr-area="terapiaocupacional" href="/api/area-entry?area=terapiaocupacional" target="_blank" rel="noopener" aria-label="Acessar Terapia Ocupacional SEMUSA e SESAU"><div class="especifica-card jr-terapiaocupacional-card"><img src="'+art+'" alt="SEMUSA e SESAU — Terapia Ocupacional" width="180" height="270" loading="lazy" decoding="async"><span class="jr-uniform-access-btn">Acessar</span></div></a>';
  return (html.slice(0,end+4)+card+html.slice(end+4)).replace('</head>','<style id="jr-terapiaocupacional-card-style">#especificas .jr-terapiaocupacional-card{position:relative;overflow:hidden;background:#050505;aspect-ratio:2/3}#especificas .jr-terapiaocupacional-card img{object-fit:contain!important;transform:none!important;width:100%;height:100%;display:block}</style></head>');
}
module.exports={insertTerapiaOcupacional};
