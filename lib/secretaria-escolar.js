const art=require('./secretaria-escolar-art.json');
function insertSecretariaEscolar(html){
  if(html.includes('data-jr-card="secretariaescolar"'))return html;
  const anchor=html.indexOf('data-jr-card="cuidadorsocial"');
  const end=html.indexOf('</a>',anchor);
  if(anchor<0||end<0)throw new Error('Card Cuidador Social nao encontrado para Secretaria Escolar');
  const card='<a class="especifica-card-link" data-jr-card="secretariaescolar" data-jr-area="secretariaescolar" href="/api/area-entry?area=secretariaescolar" target="_blank" rel="noopener" aria-label="Acessar Agente de Secretaria Escolar SEMED Porto Velho"><div class="especifica-card jr-secretariaescolar-card"><img src="'+art+'" alt="SEMED Porto Velho — Agente de Secretaria Escolar" width="180" height="270" loading="lazy" decoding="async"><span class="jr-uniform-access-btn">Acessar</span></div></a>';
  return (html.slice(0,end+4)+card+html.slice(end+4)).replace('</head>','<style id="jr-secretariaescolar-card-style">#especificas .jr-secretariaescolar-card{position:relative;overflow:hidden;background:#061f30;aspect-ratio:2/3}#especificas .jr-secretariaescolar-card img{object-fit:contain!important;transform:none!important;width:100%;height:100%;display:block}</style></head>');
}
module.exports={insertSecretariaEscolar};
