const crypto = require("crypto");
const { createToken, setSessionCookie } = require("./_auth");

const PRODUCT_ID = "sesau-ro-completo";

function verifyPurchaseToken(token){
  try{
    const secret=String(process.env.JR_PURCHASE_BRIDGE_SECRET||"");
    if(secret.length<32) throw new Error("JR_PURCHASE_BRIDGE_SECRET não configurado.");
    const [body,sig]=String(token||"").split(".");
    if(!body||!sig) return null;
    const expected=crypto.createHmac("sha256",secret).update(body).digest("base64url");
    const a=Buffer.from(sig), b=Buffer.from(expected);
    if(a.length!==b.length || !crypto.timingSafeEqual(a,b)) return null;
    const data=JSON.parse(Buffer.from(body,"base64url").toString("utf8"));
    if(!data.exp || Date.now()>Number(data.exp)) return null;
    if(data.typ!=="sesau-access" || data.product!==PRODUCT_ID) return null;
    if(!/^\S+@\S+\.\S+$/.test(String(data.email||""))) return null;
    if(!/^[A-Za-z0-9._:-]{1,160}$/.test(String(data.paymentId||""))) return null;
    return data;
  }catch{return null;}
}

module.exports = async function handler(req,res){
  res.setHeader("Cache-Control","no-store, max-age=0");
  res.setHeader("Referrer-Policy","no-referrer");
  if(req.method!=="POST"){
    res.setHeader("Allow","POST");
    return res.status(405).send("Método não permitido.");
  }
  try{
    const body=typeof req.body==="string"
      ? Object.fromEntries(new URLSearchParams(req.body))
      : (req.body||{});
    const purchase=verifyPurchaseToken(body.token);
    if(!purchase) return res.status(401).send("Liberação inválida ou expirada. Volte ao checkout e confirme o pagamento novamente.");

    const maxAgeSeconds=60*60*24*30;
    const session=createToken(String(purchase.email).toLowerCase(),maxAgeSeconds);
    setSessionCookie(res,session,maxAgeSeconds);
    res.statusCode=303;
    res.setHeader("Location","/");
    return res.end();
  }catch(err){
    console.error("Entrada por compra:",err?.message||err);
    return res.status(500).send("Não foi possível liberar o acesso agora.");
  }
};
