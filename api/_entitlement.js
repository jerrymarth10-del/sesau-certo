const VERIFY_URL="https://vendiro.com.br/api/sesau/verify-access";
const HEALTH_AREAS=new Set(["radiologia","enfermagem","tecnico","fisioterapia","farmaceutico","laboratorio","nutricao","biomedicina","odontologia","psicologia","acsfiscal","endemias","clinico"]);
const PRODUCTS=new Set(["sesau-ro-completo","semusa-pvh-2026"]);

function serviceToken(req){const token=String(req.headers["x-vercel-oidc-token"]||process.env.VERCEL_OIDC_TOKEN||"").trim();if(!token&&String(process.env.VERCEL_ENV||"").toLowerCase()==="production")throw new Error("Identidade interna da Vercel indisponível.");return token;}
function clientIp(req){const raw=String(req.headers["x-forwarded-for"]||"").split(",")[0].trim()||String(req.headers["x-real-ip"]||"").trim();return raw.length<=64&&/^[0-9a-fA-F:.]+$/.test(raw)?raw:"unknown";}

async function hasEntitlement(email,area,req,product=""){
  if(!HEALTH_AREAS.has(String(area||"")))return false;
  const products=PRODUCTS.has(String(product||""))?[String(product)]:Array.from(PRODUCTS);
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),10000);
  try{
    const oidc=serviceToken(req);
    for(const currentProduct of products){
      const response=await fetch(VERIFY_URL,{method:"POST",cache:"no-store",signal:controller.signal,headers:{"Content-Type":"application/json","Accept":"application/json",...(oidc?{"Authorization":"Bearer "+oidc}:{}),"X-JR-Client-IP":clientIp(req)},body:JSON.stringify({mode:"entitlement",email,area,product:currentProduct})});
      const data=await response.json().catch(()=>null);
      if(response.ok&&data?.ok&&data?.entitled&&data?.area===area&&data?.product===currentProduct)return true;
    }
    return false;
  }finally{clearTimeout(timer);}
}
module.exports={HEALTH_AREAS,hasEntitlement};
