const { sessionFromRequest, createAreaTicket } = require("./_auth");
const { HEALTH_AREAS, hasEntitlement } = require("./_entitlement");
const PROJECT2_URL="https://especificas-premium.vercel.app";
const SEMUSA_PRODUCT="semusa-pvh-2026";

function purchasedTargetAreaFor(product,area){
  if(area==="psicologia"&&product===SEMUSA_PRODUCT)return "psicologiasemusa";
  return area;
}
function requestedTargetAreaFor(area,variant){
  if(area==="acsfiscal"&&variant==="assistentesocial")return "assistentesocial";
  if(area==="psicologia"&&variant==="semusa")return "psicologiasemusa";
  return area;
}
function legacyUrl(area){return PROJECT2_URL+"/?area="+encodeURIComponent(area);}

module.exports=async function handler(req,res){
  res.setHeader("Cache-Control","no-store, max-age=0");res.setHeader("Pragma","no-cache");res.setHeader("Referrer-Policy","no-referrer");res.setHeader("X-Content-Type-Options","nosniff");
  if(req.method!=="GET"){res.setHeader("Allow","GET");return res.status(405).send("Método não permitido.");}

  const requestedArea=String(req.query?.area||"").trim().toLowerCase();
  const variant=String(req.query?.variant||"").trim().toLowerCase();
  if(!HEALTH_AREAS.has(requestedArea))return res.status(400).send("Área inválida.");

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
      res.statusCode=302;res.setHeader("Location",purchasedFallback);return res.end();
    }

    const remaining=Math.max(60,Math.min(60*60*24*30,Math.floor((session.exp-Date.now())/1000)));
    const ticket=createAreaTicket(targetArea,remaining,email,product,purchasedArea);
    res.statusCode=302;
    res.setHeader("Location",purchasedFallback+"#jr_area_ticket="+encodeURIComponent(ticket));
    return res.end();
  }catch(err){
    console.error("Entrada por área SESAU/SEMUSA:",err?.message||err);
    res.statusCode=302;res.setHeader("Location",requestedFallback);return res.end();
  }
};
