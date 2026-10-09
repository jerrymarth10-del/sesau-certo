const { sessionFromRequest, createAreaTicket } = require("./_auth");
const { HEALTH_AREAS, hasEntitlement } = require("./_entitlement");
const PROJECT2_URL="https://especificas-premium.vercel.app";
const SEMUSA_PRODUCT="semusa-pvh-2026";
const LEGACY_AREAS=new Set(["quimica","prf","penal","sefin","pedagogia","supervisao","jiparana","vigilante"]);

function purchasedTargetAreaFor(product,area){
  if(area==="psicologia"&&product===SEMUSA_PRODUCT)return "psicologiasemusa";
  return area;
}
function requestedTargetAreaFor(area,variant){
  if(area==="acsfiscal"&&variant==="assistentesocial")return "assistentesocial";
  if(area==="psicologia"&&variant==="semusa")return "psicologiasemusa";
  return area;
}
function purchaseProblem(res,status){
  res.statusCode=status;res.setHeader("Content-Type","text/html; charset=utf-8");
  return res.end('<!doctype html><html lang="pt-BR"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Acesso ao preparatório</title><main style="max-width:520px;margin:15vh auto;padding:24px;font-family:system-ui"><h1>Vamos recuperar seu acesso</h1><p>Não foi possível confirmar sua liberação agora. Tente novamente ou recupere o acesso com os dados usados na compra.</p><p><button onclick="location.reload()">Tentar novamente</button></p><a href="https://semusa-sesau-app.vercel.app/">Recuperar acesso na página de compra</a></main></html>');
}
function legacyUrl(area){return PROJECT2_URL+"/?area="+encodeURIComponent(area);}

module.exports=async function handler(req,res){
  res.setHeader("Cache-Control","no-store, max-age=0");res.setHeader("Pragma","no-cache");res.setHeader("Referrer-Policy","no-referrer");res.setHeader("X-Content-Type-Options","nosniff");
  if(req.method!=="GET"){res.setHeader("Allow","GET");return res.status(405).send("Método não permitido.");}

  const requestedArea=String(req.query?.area||"").trim().toLowerCase();
  const variant=String(req.query?.variant||"").trim().toLowerCase();
  const requestedKnown=HEALTH_AREAS.has(requestedArea)||LEGACY_AREAS.has(requestedArea);
  if(!requestedKnown)return res.status(400).send("Área inválida.");

  const requestedTarget=requestedTargetAreaFor(requestedArea,variant);
  const requestedFallback=legacyUrl(requestedTarget);

  try{
    const session=sessionFromRequest(req);
    const email=String(session?.email||"").trim().toLowerCase();
    const product=String(session?.purchasedProduct||"");
    const purchasedArea=String(session?.purchasedArea||"").trim().toLowerCase();

    // Compra confirmada: a área comprada é a única fonte de verdade.
    // Mesmo se o aluno clicar em outro card por engano, ele recebe acesso
    // somente ao bloco que realmente comprou no Projeto 2.
    const hasPurchaseContext=/^\S+@\S+\.\S+$/.test(email)&&HEALTH_AREAS.has(purchasedArea);
    if(!hasPurchaseContext){
      res.statusCode=302;res.setHeader("Location",requestedFallback);return res.end();
    }

    const variantFromSession=String(session?.purchasedVariant||"").trim().toLowerCase();
    const targetArea=variantFromSession==="assistentesocial"&&purchasedArea==="acsfiscal"?"assistentesocial":purchasedTargetAreaFor(product,purchasedArea);
    // The copied catalog shares Fiscal's entitlement; the signed ticket remains canonical.
    const viewArea=targetArea==="acsfiscal"&&requestedTarget==="assistentesocial"?requestedTarget:targetArea;
    const purchasedFallback=legacyUrl(viewArea);
    const entitled=await hasEntitlement(email,purchasedArea,req,product);
    if(!entitled){
      return purchaseProblem(res,403);
    }

    const remaining=Math.max(60,Math.min(60*60*24*30,Math.floor((session.exp-Date.now())/1000)));
    const ticket=createAreaTicket(targetArea,remaining,email,product,purchasedArea);
    res.statusCode=302;
    res.setHeader("Location",purchasedFallback+"#jr_area_ticket="+encodeURIComponent(ticket));
    return res.end();
  }catch(err){
    console.error("Entrada por área SESAU/SEMUSA:",err?.message||err);
    return purchaseProblem(res,503);
  }
};
