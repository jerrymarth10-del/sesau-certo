const { sessionFromRequest, createAreaTicket } = require("./_auth");

const VERIFY_ENTITLEMENT_URL = "https://vendiro.com.br/api/sesau/verify-entitlement";
const PROJECT2_URL = "https://especificas-premium.vercel.app";
const HEALTH_AREAS = new Set([
  "radiologia","enfermagem","tecnico","fisioterapia","farmaceutico","laboratorio",
  "nutricao","biomedicina","odontologia","psicologia","acsfiscal","endemias","clinico"
]);

function serviceToken(req){
  const token=String(req.headers["x-vercel-oidc-token"]||process.env.VERCEL_OIDC_TOKEN||"").trim();
  if(!token && String(process.env.VERCEL_ENV||"").toLowerCase()==="production"){
    throw new Error("Identidade interna da Vercel indisponível.");
  }
  return token;
}

function clientIp(req){
  const raw=String(req.headers["x-forwarded-for"]||"").split(",")[0].trim() || String(req.headers["x-real-ip"]||"").trim();
  return raw.length<=64 && /^[0-9a-fA-F:.]+$/.test(raw) ? raw : "unknown";
}

function legacyUrl(area){
  return PROJECT2_URL + "/?area=" + encodeURIComponent(area);
}

async function hasEntitlement(email,area,req){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),10000);
  try{
    const oidc=serviceToken(req);
    const response=await fetch(VERIFY_ENTITLEMENT_URL,{
      method:"POST",
      cache:"no-store",
      signal:controller.signal,
      headers:{
        "Content-Type":"application/json",
        "Accept":"application/json",
        ...(oidc?{"Authorization":"Bearer "+oidc}:{}),
        "X-JR-Client-IP":clientIp(req)
      },
      body:JSON.stringify({email,area})
    });
    const data=await response.json().catch(()=>null);
    return !!(response.ok && data?.ok && data?.entitled && data?.area===area);
  }finally{
    clearTimeout(timer);
  }
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

    const ticket=createAreaTicket(area,60*60*24*30);
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
