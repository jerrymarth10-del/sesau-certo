const art = require('./card-art.json');

function applyCardLayout(html) {
  const cards = {
    'quimica-seduc-pa': ['quimica', 'SEDUC PA — Professor de Química'],
    'prf-administrativo': ['prf', 'PRF — Agente Administrativo'],
    'agente-endemias': ['endemias', 'Agente de Combate às Endemias'],
    'sefin-ro': ['sefin', 'SEFIN/RO — Material Geral']
  };
  for (const [id,[key,title]] of Object.entries(cards)) {
    const pattern = new RegExp('(<a\\b[^>]*data-jr-card="' + id + '"[^>]*>)[\\s\\S]*?<\\/a>');
    html = html.replace(pattern, `$1<div class="especifica-card jr-repaired-card">
      <img src="${art[key]}" alt="${title}" width="640" height="960" loading="lazy" decoding="async">
      <span class="jr-access-btn">Acessar</span>
    </div></a>`);
  }
  return html.replace('</head>', `<style id="jr-card-layout-v1">
    #especificas .jr-repaired-card{background:#050609!important}
    #especificas .jr-repaired-card img{object-fit:contain!important;transform:none!important}
    #especificas .jr-repaired-card .jr-access-btn{position:absolute;z-index:2;left:14px;right:14px;bottom:14px;display:block;padding:12px 8px;text-align:center;border-radius:12px;color:#fff;font-size:13px;font-weight:900;text-transform:uppercase;background:linear-gradient(135deg,#ef4444,#991b1b);box-shadow:0 8px 22px rgba(220,38,38,.28);overflow:hidden;animation:jrAccessPulse 2.1s infinite}
    #especificas .jr-access-btn::before{content:"";position:absolute;top:0;bottom:0;left:-90%;width:60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.3),transparent);transform:skewX(-20deg);animation:jrAccessShine 2.7s linear infinite}
    #especificas a:focus-visible .jr-repaired-card{outline:2px solid #f87171;outline-offset:3px}
    @keyframes jrAccessPulse{50%{box-shadow:0 8px 26px rgba(239,68,68,.46)}}
    @keyframes jrAccessShine{to{left:160%}}
    @media(prefers-reduced-motion:reduce){#especificas .jr-access-btn,#especificas .jr-access-btn::before{animation:none!important}}
  </style></head>`);
}

module.exports = { applyCardLayout };
