const { sessionFromRequest, createAreaTicket } = require("./_auth");

const { HEALTH_AREAS, hasEntitlement } = require("./_entitlement");
const PROJECT2_URL = "https://especificas-premium.vercel.app";

function legacyUrl(area){
  return PROJECT2_URL + "/?area=" + encodeURIComponent(area);
}

module.exports=async function handler(req,res){
  res.setHeader("Cache-Control","no-store, max-age=0");
  res.setHeader("Pragma","no-cache");
  res.setHeader("Referrer-Policy","no-referrer");
  res.setHeader("X-Content-Type-Options","nosniff");

  if(req.method!=="GET"){
    res.setHeader("Allow","GET");
    return res.status(405).send("Método não permitido.");
  }

  const area=String(req.query?.area||"").trim().toLowerCase();
  if(!HEALTH_AREAS.has(area)) return res.status(400).send("Área inválida.");

  const fallback=legacyUrl(area);
  try{
    const session=sessionFromRequest(req);
    const email=String(session?.email||"").trim().toLowerCase();
    if(!email || !/^\S+@\S+\.\S+$/.test(email) || session.purchasedArea!==area){
      res.statusCode=302;
      res.setHeader("Location",fallback);
      return res.end();
    }

    const entitled=await hasEntitlement(email,area,req);
    if(!entitled){
      res.statusCode=302;
      res.setHeader("Location",fallback);
      return res.end();
    }

    const ticket=createAreaTicket(area,Math.min(60*60*24*30, Math.floor((session.exp-Date.now())/1000)),email);
    res.statusCode=302;
    res.setHeader("Location",fallback+"#jr_area_ticket="+encodeURIComponent(ticket));
    return res.end();
  }catch(err){
    console.error("Entrada por área SESAU:",err?.message||err);
    res.statusCode=302;
    res.setHeader("Location",fallback);
    return res.end();
  }
};
