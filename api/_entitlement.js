const VERIFY_ENTITLEMENT_URL = "https://vendiro.com.br/api/sesau/verify-entitlement";
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

module.exports = { HEALTH_AREAS, hasEntitlement };
