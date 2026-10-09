const { createToken, setSessionCookie } = require("./_auth");

const VERIFY_URLS=[
  "https://vendiro.com.br/api/sesau/verify-access",
  "https://vendiro.com.br/api/semusa/verify-access"
];
const PRODUCT_IDS=new Set(["sesau-ro-completo","semusa-pvh-2026"]);

function clientIp(req){const raw=String(req.headers["x-forwarded-for"]||"").split(",")[0].trim()||String(req.headers["x-real-ip"]||"").trim();return raw.length<=64&&/^[0-9a-fA-F:.]+$/.test(raw)?raw:"unknown";}
function serviceToken(req){const token=String(req.headers["x-vercel-oidc-token"]||process.env.VERCEL_OIDC_TOKEN||"").trim();if(!token&&String(process.env.VERCEL_ENV||"").toLowerCase()==="production")throw new Error("Identidade interna da Vercel indisponível.");return token;}

async function verifyPurchase(token,buyerIp,req){
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
  try{
    const oidc=serviceToken(req);
    for(const verifyUrl of VERIFY_URLS){
      let response;
      try{
        response=await fetch(verifyUrl,{method:"POST",cache:"no-store",signal:controller.signal,headers:{"Content-Type":"application/json","Accept":"application/json",...(oidc?{"Authorization":"Bearer "+oidc}:{}),"X-JR-Client-IP":buyerIp},body:JSON.stringify({token:String(token||"")})});
      }catch(err){if(err?.name==="AbortError")throw err;continue;}
      const data=await response.json().catch(()=>null);
      if(!response.ok||!data?.ok)continue;
      const email=String(data.email||"").trim().toLowerCase();
      const product=String(data.product||"");
      if(!PRODUCT_IDS.has(product)||!/^\S+@\S+\.\S+$/.test(email))continue;
      return {email,paymentId:String(data.paymentId||""),area:String(data.area||"").trim().toLowerCase(),product,variant:String(data.variant||"").trim().toLowerCase()};
    }
    return null;
  }finally{clearTimeout(timer);}
}

module.exports=async function handler(req,res){
  res.setHeader("Cache-Control","no-store, max-age=0");res.setHeader("Pragma","no-cache");res.setHeader("Referrer-Policy","no-referrer");res.setHeader("X-Content-Type-Options","nosniff");
  if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).send("Método não permitido.");}
  const length=Number(req.headers["content-length"]||0);if(length>12288)return res.status(413).send("Requisição muito grande.");
  try{
    const body=typeof req.body==="string"?Object.fromEntries(new URLSearchParams(req.body)):(req.body||{});
    const token=String(body.token||"");
    if(!token||token.length>8192)return res.status(401).send("Liberação inválida ou expirada. Volte ao checkout e confirme o pagamento novamente.");
    const purchase=await verifyPurchase(token,clientIp(req),req);
    if(!purchase)return res.status(401).send("Pagamento não confirmado ou liberação expirada. Volte ao checkout e confirme novamente.");
    const maxAgeSeconds=60*60*24*30;
    const session=createToken(purchase.email,maxAgeSeconds,purchase.area,purchase.product,purchase.variant);
    setSessionCookie(res,session,maxAgeSeconds);
    const directAreas=new Set(["farmaceutico","acsfiscal","psicologia","administrativo","motorista","servicosgerais","clinico","pediatria"]);
    const directAreaEntry=directAreas.has(purchase.area);
    const directVariant=purchase.variant?"&variant="+encodeURIComponent(purchase.variant):"";
    const directUrl="/api/area-entry?area="+encodeURIComponent(purchase.area)+directVariant;
    res.statusCode=303;res.setHeader("Location",directAreaEntry?directUrl:"/");return res.end();
  }catch(err){console.error("Entrada por compra:",err?.message||err);return res.status(500).send("Não foi possível liberar o acesso agora.");}
};
