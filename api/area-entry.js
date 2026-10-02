const { sessionFromRequest, createAreaTicket } = require("./_auth");
const { HEALTH_AREAS, hasEntitlement } = require("./_entitlement");
const PROJECT2_URL="https://especificas-premium.vercel.app";
const SEMUSA_PRODUCT="semusa-pvh-2026";

function targetAreaFor(product,area,variant){
  if(area==="psicologia"&&(product===SEMUSA_PRODUCT||variant==="semusa"))return "psicologiasemusa";
  return area;
}
function legacyUrl(area){return PROJECT2_URL+"/?area="+encodeURIComponent(area);}

module.exports=async function handler(req,res){
  res.setHeader("Cache-Control","no-store, max-age=0");res.setHeader("Pragma","no-cache");res.setHeader("Referrer-Policy","no-referrer");res.setHeader("X-Content-Type-Options","nosniff");
  if(req.method!=="GET"){res.setHeader("Allow","GET");return res.status(405).send("Método não permitido.");}
  const area=String(req.query?.area||"").trim().toLowerCase();
  if(!HEALTH_AREAS.has(area))return res.status(400).send("Área inválida.");
  try{
    const session=sessionFromRequest(req);
    const email=String(session?.email||"").trim().toLowerCase();
    const product=String(session?.purchasedProduct||"");
    const variant=String(req.query?.variant||"").trim().toLowerCase();
    const semusaVariant=area==="psicologia"&&variant==="semusa";
    const targetArea=targetAreaFor(product,area,variant);
    const fallback=legacyUrl(targetArea);
    if(semusaVariant&&product!==SEMUSA_PRODUCT){
      res.statusCode=302;res.setHeader("Location",fallback);return res.end();
    }
    if(!email||!/^\S+@\S+\.\S+$/.test(email)||session.purchasedArea!==area){
      res.statusCode=302;res.setHeader("Location",fallback);return res.end();
    }
    const entitled=await hasEntitlement(email,area,req,product);
    if(!entitled){res.statusCode=302;res.setHeader("Location",fallback);return res.end();}
    const remaining=Math.max(60,Math.min(60*60*24*30,Math.floor((session.exp-Date.now())/1000)));
    const ticket=createAreaTicket(targetArea,remaining,email,product,area);
    res.statusCode=302;res.setHeader("Location",fallback+"#jr_area_ticket="+encodeURIComponent(ticket));return res.end();
  }catch(err){
    console.error("Entrada por área SESAU/SEMUSA:",err?.message||err);
    const fallback=legacyUrl(area);res.statusCode=302;res.setHeader("Location",fallback);return res.end();
  }
};
