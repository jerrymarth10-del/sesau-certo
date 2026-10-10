const { sessionFromRequest } = require('./_auth');
const { HEALTH_AREAS } = require('./_entitlement');

module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Método não permitido.');
  }
  let session;
  try { session = sessionFromRequest(req); } catch {}
  if (!session || !HEALTH_AREAS.has(session.purchasedArea)) {
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
  }
  const specificUrl = '/api/area-entry?area=' + encodeURIComponent(session.purchasedArea);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.end(`<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Meu preparatório | JR Aprova</title>
<style>*{box-sizing:border-box}body{margin:0;background:#071924;color:#edf6fa;font-family:system-ui,-apple-system,sans-serif}main{max-width:880px;margin:0 auto;padding:64px 24px}.brand{color:#58d5ad;font-weight:800;letter-spacing:.08em}h1{font-size:clamp(28px,5vw,42px);line-height:1.15;margin:20px 0 14px}p{color:#bed0da;line-height:1.65}.cards{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:32px 0}.card{display:flex;flex-direction:column;background:#102b39;border:1px solid #254654;border-radius:20px;padding:28px}small{color:#58d5ad;font-weight:700}h2{font-size:24px;margin:12px 0}.card p{flex:1;margin:0 0 24px}a{display:block;text-align:center;padding:15px 18px;border-radius:12px;background:#58d5ad;color:#071924;font-weight:800;text-decoration:none}a:focus-visible{outline:3px solid white;outline-offset:4px}.note{font-size:14px}@media(max-width:600px){main{padding:36px 20px}.cards{grid-template-columns:1fr}.card{padding:24px}}</style></head>
<body><main><div class="brand">JR APROVA</div><h1>Seu preparatório em dois espaços</h1><p>Acesse as matérias gerais e as específicas do seu cargo pelos botões abaixo.</p>
<div class="cards"><section class="card"><small>SESAU CERTO</small><h2>Matérias gerais</h2><p>Português e as demais disciplinas gerais, com videoaulas e materiais organizados por matéria.</p><a href="/#disciplinas">Acessar matérias gerais</a></section>
<section class="card"><small>ESPECÍFICAS PREMIUM</small><h2>Específicas do meu cargo</h2><p>Videoaulas específicas para o seu cargo, provas e materiais da sua área.</p><a href="${specificUrl}">Acessar específicas</a></section></div>
<p class="note">Você pode voltar a esta página para alternar entre os dois espaços. O acesso às específicas usa o cargo confirmado na sua compra.</p></main></body></html>`);
};
