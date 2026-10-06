function esc(value){
  return String(value||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]});
}

function fallbackArt(title, tag){
  const t=esc(title||'Preparatório');
  const k=esc(tag||'JR Aprova');
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="640" height="960" viewBox="0 0 640 960">'+
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#101827"/><stop offset=".54" stop-color="#070b13"/><stop offset="1" stop-color="#2b090d"/></linearGradient><radialGradient id="r" cx=".75" cy=".18" r=".55"><stop offset="0" stop-color="#ef4444" stop-opacity=".38"/><stop offset="1" stop-color="#ef4444" stop-opacity="0"/></radialGradient></defs>'+
    '<rect width="640" height="960" fill="url(#g)"/><rect width="640" height="960" fill="url(#r)"/>'+
    '<rect x="28" y="28" width="584" height="904" rx="32" fill="none" stroke="#ef4444" stroke-width="4" stroke-opacity=".72"/>'+
    '<circle cx="320" cy="325" r="135" fill="#ef4444" fill-opacity=".10" stroke="#ef4444" stroke-opacity=".38" stroke-width="3"/>'+
    '<path d="M258 325h124M320 263v124" stroke="#fff" stroke-width="26" stroke-linecap="round" opacity=".94"/>'+
    '<text x="320" y="545" text-anchor="middle" fill="#fca5a5" font-family="Arial,Helvetica,sans-serif" font-size="23" font-weight="800">'+k+'</text>'+
    '<foreignObject x="58" y="590" width="524" height="220"><div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial,Helvetica,sans-serif;color:white;font-size:42px;line-height:1.08;font-weight:900;text-align:center;display:flex;align-items:center;justify-content:center;height:220px;">'+t+'</div></foreignObject>'+
    '<text x="320" y="880" text-anchor="middle" fill="#fff" fill-opacity=".72" font-family="Arial,Helvetica,sans-serif" font-size="20" font-weight="700">PLATAFORMA PREMIUM</text>'+
  '</svg>';
  return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
}

function applyFrontHotfix(html){
  html=String(html||'')
    .replace(/<button\b[^>]*id=["']jrPwaInstallBtn["'][^>]*>[\s\S]*?<\/button>/gi,'')
    .replace(/<script\b[^>]*id=["']jr-pwa-runtime["'][^>]*>[\s\S]*?<\/script>/gi,'')
    .replace(/Agente de Saúde e Fiscal Sanitário/g,'Agente Comunitário de Saúde (ACS)')
    .replace(/alt="Agente de Saúde e Fiscal Sanitário"/g,'alt="Agente Comunitário de Saúde (ACS)"');

  const css=`<style id="jr-front-hotfix-v1">
    #especificas .especifica-card-link{
      display:block!important;
      min-width:0!important;
      text-decoration:none!important;
    }
    #especificas .especifica-card{
      position:relative!important;
      overflow:hidden!important;
      width:100%!important;
      height:auto!important;
      min-height:0!important;
      aspect-ratio:2/3!important;
      border-radius:20px!important;
      border:1px solid rgba(239,68,68,.30)!important;
      background:#050609!important;
      box-shadow:0 12px 30px rgba(0,0,0,.28)!important;
      transform:none!important;
      isolation:isolate!important;
    }
    #especificas .especifica-card:hover{transform:translateY(-2px)!important}
    #especificas .especifica-card>img,
    #especificas .especifica-card>.jr-front-art{
      position:absolute!important;
      inset:0!important;
      display:block!important;
      width:100%!important;
      height:100%!important;
      object-fit:cover!important;
      object-position:center!important;
      transform:none!important;
      background:#050609!important;
      border-radius:0!important;
    }
    #especificas .jr-specific-visual,
    #especificas .especifica-admin-shade,
    #especificas .especifica-admin-body,
    #especificas .jr-uniform-access-btn,
    #especificas .jr-new-card-access,
    #especificas .jr-image-card-body,
    #especificas .jr-access-btn{
      display:none!important;
    }
    #especificas .jr-front-access{
      position:absolute!important;
      z-index:8!important;
      left:12px!important;
      right:12px!important;
      bottom:12px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      min-height:46px!important;
      padding:10px 12px!important;
      border-radius:13px!important;
      color:#fff!important;
      background:linear-gradient(135deg,#ef2f36,#bd1219)!important;
      border:1px solid rgba(255,255,255,.18)!important;
      box-shadow:0 9px 22px rgba(220,38,38,.32)!important;
      font-size:14px!important;
      line-height:1!important;
      font-weight:900!important;
      text-align:center!important;
      text-transform:none!important;
      pointer-events:none!important;
    }
    #especificas .jr-front-art-shade{
      position:absolute!important;
      inset:0!important;
      z-index:6!important;
      pointer-events:none!important;
      background:linear-gradient(180deg,transparent 66%,rgba(0,0,0,.42) 100%)!important;
    }
    @media(max-width:760px){
      #especificas .especifica-card{border-radius:16px!important}
      #especificas .jr-front-access{left:9px!important;right:9px!important;bottom:9px!important;min-height:42px!important;font-size:13px!important;border-radius:11px!important}
    }
    @media(max-width:430px){
      #especificas .especifica-card-link{min-width:0!important}
    }
    [data-jr-install-hidden="1"]{display:none!important}
  </style>`;

  const script=`<script id="jr-front-hotfix-script-v1">
  (function(){
    var titlesByCard={
      'quimica-seduc-pa':'Professor de Química',
      'prf-administrativo':'Agente Administrativo PRF',
      'agente-endemias':'Agente de Endemias',
      'sefin-ro':'SEFIN/RO',
      'psicologia-semusa':'Psicologia • SEMUSA',
      'administrativo':'Área Administrativa',
      'assistente-social':'Assistente Social',
      'motorista':'Motorista',
      'servicosgerais':'Serviços Gerais',
      'pediatria':'Médico Pediatra'
    };
    var titlesByArea={
      radiologia:'Técnico em Radiologia',
      enfermagem:'Enfermagem',
      tecnico:'Técnico em Enfermagem',
      fisioterapia:'Fisioterapia',
      farmaceutico:'Farmácia',
      laboratorio:'Técnico de Laboratório',
      nutricao:'Nutrição',
      biomedicina:'Biomedicina',
      odontologia:'Odontologia',
      psicologia:'Psicologia',
      acsfiscal:'Agente Comunitário de Saúde (ACS)',
      endemias:'Agente de Endemias',
      administrativo:'Área Administrativa',
      motorista:'Motorista',
      servicosgerais:'Serviços Gerais',
      clinico:'Médico Clínico Geral',
      pediatria:'Médico Pediatra'
    };
    function svgArt(title,tag){
      var safe=String(title||'Preparatório').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]});
      var safeTag=String(tag||'JR Aprova').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]});
      var svg='<svg xmlns="http://www.w3.org/2000/svg" width="640" height="960" viewBox="0 0 640 960">'+
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#101827"/><stop offset=".54" stop-color="#070b13"/><stop offset="1" stop-color="#2b090d"/></linearGradient></defs>'+
      '<rect width="640" height="960" fill="url(#g)"/><rect x="28" y="28" width="584" height="904" rx="32" fill="none" stroke="#ef4444" stroke-width="4" stroke-opacity=".72"/>'+
      '<circle cx="320" cy="325" r="135" fill="#ef4444" fill-opacity=".10" stroke="#ef4444" stroke-opacity=".38" stroke-width="3"/>'+
      '<path d="M258 325h124M320 263v124" stroke="#fff" stroke-width="26" stroke-linecap="round"/>'+
      '<text x="320" y="545" text-anchor="middle" fill="#fca5a5" font-family="Arial,Helvetica,sans-serif" font-size="23" font-weight="800">'+safeTag+'</text>'+
      '<foreignObject x="58" y="590" width="524" height="220"><div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial,Helvetica,sans-serif;color:white;font-size:42px;line-height:1.08;font-weight:900;text-align:center;display:flex;align-items:center;justify-content:center;height:220px;">'+safe+'</div></foreignObject>'+
      '<text x="320" y="880" text-anchor="middle" fill="#fff" fill-opacity=".72" font-family="Arial,Helvetica,sans-serif" font-size="20" font-weight="700">PLATAFORMA PREMIUM</text></svg>';
      return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
    }
    function infer(link,card){
      var cardKey=String(link.getAttribute('data-jr-card')||'').trim();
      var area=String(link.getAttribute('data-jr-area')||'').trim();
      if(!area){
        var href=String(link.getAttribute('href')||'');
        var m=href.match(/[?&]area=([^&#]+)/);if(m)area=decodeURIComponent(m[1]);
      }
      var img=card.querySelector('img');
      var alt=img?String(img.alt||'').replace(/^SEMUSA e SESAU\s*[—-]\s*/i,'').replace(/^SESAU e SEMUSA\s*[—-]\s*/i,'').trim():'';
      var aria=String(link.getAttribute('aria-label')||'').replace(/^Acessar\s+/i,'').replace(/\s+(SEMUSA|SESAU).*$/i,'').trim();
      var h3=card.querySelector('h3');
      var h=h3?String(h3.textContent||'').trim():'';
      return {title:titlesByCard[cardKey]||titlesByArea[area]||h||alt||aria||'Preparatório',area:area,cardKey:cardKey};
    }
    function ensureAdminCard(){
      var exists=document.querySelector('#especificas a[data-jr-area="administrativo"],#especificas a[href*="area=administrativo"]');
      if(exists){
        if(!exists.getAttribute('data-jr-area'))exists.setAttribute('data-jr-area','administrativo');
        if(!exists.getAttribute('data-jr-card'))exists.setAttribute('data-jr-card','administrativo');
        return exists;
      }
      var grid=document.querySelector('#especificas .especificas-grid');
      if(!grid)return null;
      var link=document.createElement('a');
      link.className='especifica-card-link';
      link.setAttribute('data-jr-card','administrativo');
      link.setAttribute('data-jr-area','administrativo');
      link.href='/api/area-entry?area=administrativo';
      link.target='_blank';
      link.rel='noopener';
      link.setAttribute('aria-label','Acessar Área Administrativa');
      var card=document.createElement('div');
      card.className='especifica-card jr-administrativo-recovered';
      link.appendChild(card);
      grid.appendChild(link);
      return link;
    }
    function ensureCard(link){
      var card=link.querySelector('.especifica-card');if(!card)return;
      var meta=infer(link,card);
      var img=card.querySelector(':scope > img');
      function useFallback(force){
        if(force||!img){
          if(!img){img=document.createElement('img');img.className='jr-front-art';card.insertBefore(img,card.firstChild);}
          img.src=svgArt(meta.title,meta.area==='acsfiscal'?'SEMUSA Porto Velho • ACS':'JR Aprova');
          img.alt=meta.title;
          img.loading='lazy';img.decoding='async';img.dataset.jrFallback='1';
        }
      }
      var forceFallback=meta.area==='administrativo'||meta.cardKey==='policia-penal-ro'||(meta.area==='acsfiscal'&&meta.cardKey!=='assistente-social');
      if(forceFallback)useFallback(true);
      else if(!img)useFallback(true);
      else {
        img.addEventListener('error',function(){useFallback(true)},{once:true});
        if(img.complete&&img.naturalWidth===0)useFallback(true);
        if(!img.alt)img.alt=meta.title;
      }
      card.querySelectorAll('.jr-front-access,.jr-front-art-shade').forEach(function(n){n.remove()});
      var shade=document.createElement('span');shade.className='jr-front-art-shade';shade.setAttribute('aria-hidden','true');card.appendChild(shade);
      var btn=document.createElement('span');btn.className='jr-front-access';btn.textContent='Acessar';card.appendChild(btn);
      link.setAttribute('aria-label','Acessar '+meta.title);
    }
    function hideInstall(){
      document.querySelectorAll('button,a,[role="button"]').forEach(function(el){
        var txt=String(el.textContent||'').replace(/\s+/g,' ').trim();
        if(/instalar aplicativo/i.test(txt)){
          el.setAttribute('data-jr-install-hidden','1');
          var p=el.parentElement;
          if(p){
            try{var pos=getComputedStyle(p).position;if(pos==='fixed'||pos==='sticky')p.setAttribute('data-jr-install-hidden','1')}catch(e){}
          }
        }
      });
    }
    function run(){
      ensureAdminCard();
      document.querySelectorAll('#especificas a.especifica-card-link').forEach(ensureCard);
      hideInstall();
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
    setTimeout(run,300);setTimeout(run,1200);
    window.addEventListener('pageshow',run);
  })();
  <\/script>`;

  if(!html.includes('id="jr-front-hotfix-v1"')) html=html.replace('</head>',css+'</head>');
  if(!html.includes('id="jr-front-hotfix-script-v1"')) html=html.replace('</body>',script+'</body>');
  return html;
}

module.exports={applyFrontHotfix,fallbackArt};
