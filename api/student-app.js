const { sessionFromRequest } = require("./_auth");
const { HEALTH_AREAS, hasEntitlement } = require("./_entitlement");

const NAMES = Object.freeze({
  radiologia:"Radiologia",enfermagem:"Enfermagem",tecnico:"Técnico em Enfermagem",
  fisioterapia:"Fisioterapia",farmaceutico:"Farmácia",laboratorio:"Técnico de Laboratório",
  nutricao:"Nutrição",biomedicina:"Biomedicina",odontologia:"Odontologia",
  psicologia:"Psicologia",acsfiscal:"Agente de Saúde / Fiscal Sanitário",
  endemias:"Agente de Combate às Endemias",administrativo:"Administrativo",
  prf:"PRF — Administrativo",penal:"Polícia Penal",motorista:"Motorista",
  servicosgerais:"Serviços Gerais",clinico:"Clínico Geral",pediatria:"Médico Pediatra",
  terapiaocupacional:"Terapia Ocupacional",cuidadorsocial:"Cuidador Social"
});
function escapeHtml(v) {
  return String(v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function page(opts){
  const isPaid = Boolean(opts.area);
  const name = isPaid ? escapeHtml(NAMES[opts.area] || "Meu preparatório") : "";
  const url = isPaid ? "/api/area-entry?area=" + encodeURIComponent(opts.area) : "";
  const body = isPaid ?
    '<p class="eyebrow">COMPRA CONFIRMADA</p><h1>Seu preparatório está aqui</h1><p>O aplicativo mostra somente a área vinculada à sua compra aprovada.</p>' +
    '<section class="course"><small>ÁREA ADQUIRIDA</small><h2>' + name + '</h2><a class="primary" href="' + url + '">Abrir minhas aulas específicas →</a></section>' +
    '<p class="secondary">As matérias gerais continuam disponíveis no Projeto 1.</p><a class="outline" href="/#disciplinas">Estudar matérias gerais</a>' :
    '<p class="eyebrow">ACESSO PROTEGIDO</p><h1>Recupere sua compra</h1><p>Não encontramos uma sessão de compra confirmada neste aplicativo. Isso pode acontecer ao instalar no iPhone, quando o app não compartilha a sessão do navegador.</p>' +
    '<p>Use <strong>Já paguei / recuperar acesso</strong> na página em que comprou, com seus dados de pagamento. Após a validação, volte a abrir este aplicativo.</p>' +
    '<a class="primary" href="https://semusa-sesau-app.vercel.app/#checkoutCard">Recuperar compra SEMUSA</a>' +
    '<a class="outline" href="https://apostilas-sesau.vercel.app/#comprar">Recuperar compra SESAU</a>' +
    '<a class="outline" href="/">Acesso com senha anterior</a>';
  return [
    '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
    '<meta name="theme-color" content="#07141a">',
    '<meta name="apple-mobile-web-app-capable" content="yes">',
    '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">',
    '<link rel="manifest" href="/manifest.webmanifest">',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
    '<title>Meu preparatório | JR A Prova</title>',
    '<style>*{box-sizing:border-box}body{margin:0;background:#07141a;color:#effdf8;font-family:system-ui,-apple-system,sans-serif}main{max-width:630px;margin:auto;padding:clamp(26px,6vw,65px) 22px 60px}.brand{color:#58d5ad;font-weight:900;letter-spacing:.1em}.eyebrow{font-size:12px;letter-spacing:.1em;font-weight:800;color:#79dfc4;margin-top:38px}h1{font-size:clamp(29px,6vw,42px);line-height:1.16;margin:14px 0}h2{font-size:24px;margin:12px 0 25px}p{line-height:1.65;color:#c6d8d6}.course{padding:24px;background:#10332f;border:1px solid #376e66;border-radius:20px;margin:28px 0}.course small{color:#90dbc8;font-weight:800}.primary,.outline{display:block;text-decoration:none;text-align:center;border-radius:12px;padding:15px 16px;font-weight:800;margin-top:12px}.primary{color:#07141a;background:#6ce1bd}.outline{border:1px solid #77aaa0;color:#e7fff8}.secondary{font-size:14px}button{font:inherit}.install{margin-top:32px;border:1px solid #355c58;padding:20px;border-radius:16px}.install button{width:100%;padding:13px;border:0;border-radius:10px;background:#e7fef7;color:#12342a;font-weight:800;cursor:pointer}.install p{font-size:14px}.install-status{font-size:13px;color:#d1f4e8}.install details{color:#d1f4e8;font-size:14px}.install summary{cursor:pointer;margin-top:12px}a:focus-visible,button:focus-visible,summary:focus-visible{outline:3px solid white;outline-offset:3px}</style>',
    '</head><body><main><div class="brand">JR A PROVA</div>',
    body,
    '<section class="install"><strong>Aplicativo no celular</strong><p>Adicione a JR A Prova à tela inicial para abrir seu preparatório pelo ícone do aplicativo.</p>',
    '<button id="jr-install" type="button">Instalar aplicativo</button>',
    '<p id="jr-install-status" class="install-status" role="status"></p>',
    '<details id="jr-iphone-help"><summary>Como instalar no iPhone ou iPad?</summary><p>Abra esta página pelo Safari, toque em Compartilhar e escolha Adicionar à Tela de Início. Depois toque em Adicionar.</p></details>',
    '</section><p class="secondary">O acesso fica ligado à compra confirmada no servidor. Uma sessão expirada pode exigir recuperação; salvar o app não libera outros cargos.</p>',
    '</main><script src="/student-install.js" defer></script></body></html>'
  ].join("");
}
module.exports = async function handler(req,res){
  res.setHeader("Cache-Control","private, no-store, max-age=0");
  res.setHeader("Pragma","no-cache");
  res.setHeader("Referrer-Policy","no-referrer");
  res.setHeader("X-Content-Type-Options","nosniff");
  res.setHeader("Content-Type","text/html; charset=utf-8");
  if(req.method!=="GET"){res.setHeader("Allow","GET");return res.status(405).end("Método não permitido.");}
  try {
    const session = sessionFromRequest(req);
    const email = String(session?.email || "").trim().toLowerCase();
    const area = String(session?.purchasedArea || "").trim().toLowerCase();
    const product = String(session?.purchasedProduct || "");
    if (HEALTH_AREAS.has(area) && Object.hasOwn(NAMES, area) &&
        new Set(["semusa-pvh-2026","sesau-ro-completo"]).has(product) &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      // O cookie assinado não basta: a autorização é confirmada no banco a cada abertura.
      const entitled = await hasEntitlement(email,area,req,product);
      if(entitled) return res.status(200).end(page({area}));
    }
    return res.status(200).end(page({area:""}));
  }catch(e) {
    console.error("PWA: falha ao validar a área do aluno:",e?.message||e);
    return res.status(503).end(page({area:""}));
  }
};
