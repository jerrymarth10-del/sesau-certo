const art=require('./cuidador-social-art');

function insertCuidadorSocial(html){
  if(html.includes('data-jr-card="cuidadorsocial"'))return html;
  let anchor=html.indexOf('data-jr-card="servicosgerais"');
  if(anchor<0)anchor=html.indexOf('data-jr-card="motorista"');
  if(anchor<0)anchor=html.indexOf('data-jr-card="assistente-social"');
  const end=html.indexOf('</a>',anchor);
  if(anchor<0||end<0)throw new Error('Card de referência não encontrado para inserir Cuidador Social');
  const card='<a class="especifica-card-link" data-jr-card="cuidadorsocial" data-jr-area="cuidadorsocial" href="/api/area-entry?area=cuidadorsocial" target="_blank" rel="noopener" aria-label="Acessar Cuidador Social SEMUSA Porto Velho"><div class="especifica-card jr-cuidadorsocial-card"><img src="'+art+'" alt="SEMUSA Porto Velho — Cuidador Social" width="180" height="270" loading="lazy" decoding="async"><span class="jr-uniform-access-btn">Acessar</span></div></a>';
  return (html.slice(0,end+4)+card+html.slice(end+4)).replace('</head>','<style id="jr-cuidadorsocial-card-style">#especificas .jr-cuidadorsocial-card{position:relative;overflow:hidden;background:#050505;aspect-ratio:2/3}#especificas .jr-cuidadorsocial-card img{object-fit:contain!important;transform:none!important;width:100%;height:100%;display:block}</style></head>');
}
module.exports={insertCuidadorSocial};
