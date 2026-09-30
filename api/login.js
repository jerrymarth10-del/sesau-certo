const { safeEqual, createToken, setSessionCookie } = require("./_auth");

const GUARD_URL = "https://vendiro.com.br/api/sesau/login-guard";

function clientIp(req){
  const raw=String(req.headers["x-forwarded-for"]||"").split(",")[0].trim() || String(req.headers["x-real-ip"]||"").trim();
  return raw.length<=64 && /^[0-9a-fA-F:.]+$/.test(raw) ? raw : "unknown";
}

function serviceToken(req){
  const token=String(req.headers["x-vercel-oidc-token"]||process.env.VERCEL_OIDC_TOKEN||"").trim();
  if(!token && String(process.env.VERCEL_ENV||"").toLowerCase()==="production"){
    throw new Error("Identidade interna da Vercel indisponível.");
  }
  return token;
}

async function allowAttempt(req){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),8000);
  try{
    const oidc=serviceToken(req);
    const response=await fetch(GUARD_URL,{
      method:"POST",
      cache:"no-store",
      signal:controller.signal,
      headers:{
        "Content-Type":"application/json",
        "Accept":"application/json",
        ...(oidc?{"Authorization":"Bearer "+oidc}:{}),
        "X-JR-Client-IP":clientIp(req)
      },
      body:"{}"
    });
    return response.ok;
  }finally{
    clearTimeout(timer);
  }
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control","no-store, max-age=0");
  res.setHeader("Pragma","no-cache");
  res.setHeader("X-Content-Type-Options","nosniff");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ok:false, message:"Método não permitido."});
  }

  const length=Number(req.headers["content-length"]||0);
  if(length>8192) return res.status(413).json({ok:false,message:"Requisição muito grande."});

  const configuredPassword = process.env.JR_PLATFORM_PASSWORD;
  if (!configuredPassword || !process.env.JR_SESSION_SECRET) {
    return res.status(503).json({ok:false, message:"Autenticação ainda não configurada no servidor."});
  }

  try{
    if(!(await allowAttempt(req))){
      return res.status(429).json({ok:false,message:"Muitas tentativas. Aguarde alguns minutos e tente novamente."});
    }
  }catch{
    return res.status(503).json({ok:false,message:"Não foi possível validar o acesso agora."});
  }

  const { email, senha, lembrar } = req.body || {};
  const normalizedEmail=String(email||"").trim().toLowerCase().slice(0,180);
  const rawPassword=String(senha||"");

  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail) || !rawPassword || rawPassword.length>256) {
    return res.status(400).json({ok:false, message:"Informe e-mail e senha válidos."});
  }

  if (!safeEqual(rawPassword, String(configuredPassword))) {
    return res.status(401).json({ok:false, message:"E-mail ou senha incorretos."});
  }

  const maxAgeSeconds = lembrar === true ? 60 * 60 * 24 * 30 : 60 * 60 * 12;
  const token = createToken(normalizedEmail, maxAgeSeconds);
  setSessionCookie(res, token, maxAgeSeconds);
  return res.status(200).json({ok:true});
};
