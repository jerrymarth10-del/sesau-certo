const crypto = require("crypto");

const COOKIE_NAME = "jr_session";
const MAX_AGE_SECONDS = 60 * 60 * 12;
const PRODUCTS = new Set(["sesau-ro-completo","semusa-pvh-2026"]);

function getSecret() {
  const secret = process.env.JR_SESSION_SECRET;
  if (!secret) throw new Error("JR_SESSION_SECRET não configurado");
  return secret;
}
function safeEqual(a,b){const aa=Buffer.from(String(a));const bb=Buffer.from(String(b));if(aa.length!==bb.length)return false;return crypto.timingSafeEqual(aa,bb);}
function sign(payload){return crypto.createHmac("sha256",getSecret()).update(payload).digest("base64url");}
function signArea(payload){return crypto.createHmac("sha256",getSecret()).update("jr-area-ticket-v1."+payload).digest("base64url");}

function createAreaTicket(area,maxAgeSeconds=60*60*24*30,email="",product="",entitlementArea=""){
  const buyerEmail=String(email).trim().toLowerCase();
  if(!/^\S+@\S+\.\S+$/.test(buyerEmail))throw new Error("Comprador inválido");
  const p=PRODUCTS.has(String(product||""))?String(product):"";
  const source=String(entitlementArea||area||"").slice(0,80);
  const payload=Buffer.from(JSON.stringify({
    typ:"area-access",
    email:buyerEmail,
    area:String(area||"").slice(0,80),
    entitlementArea:source,
    product:p,
    jti:crypto.randomBytes(12).toString("base64url"),
    exp:Date.now()+maxAgeSeconds*1000
  })).toString("base64url");
  return payload+"."+signArea(payload);
}

function verifyAreaTicket(token){
  if(!token||!token.includes("."))return null;
  const parts=String(token).split(".");
  if(parts.length!==2)return null;
  const [payload,signature]=parts;
  if(!payload||!signature||!safeEqual(signature,signArea(payload)))return null;
  try{
    const data=JSON.parse(Buffer.from(payload,"base64url").toString("utf8"));
    if(data.typ!=="area-access"||!data.area||!/^\S+@\S+\.\S+$/.test(String(data.email||""))||
       !Number.isFinite(data.exp)||Date.now()>=data.exp)return null;
    if(data.product && !PRODUCTS.has(String(data.product)))return null;
    return data;
  }catch{return null;}
}

function createToken(email,maxAgeSeconds=MAX_AGE_SECONDS,purchasedArea="",purchasedProduct="",purchasedVariant=""){
  const product=PRODUCTS.has(String(purchasedProduct||""))?String(purchasedProduct):"";
  const payload=Buffer.from(JSON.stringify({
    email:String(email||"").slice(0,180),
    purchasedArea:String(purchasedArea||"").slice(0,80),
    purchasedProduct:product,
    purchasedVariant:String(purchasedVariant||"").slice(0,40),
    exp:Date.now()+maxAgeSeconds*1000
  })).toString("base64url");
  return payload+"."+sign(payload);
}
function verifyToken(token){
  if(!token||!token.includes("."))return null;
  const [payload,signature]=token.split(".");
  if(!payload||!signature||!safeEqual(signature,sign(payload)))return null;
  try{const data=JSON.parse(Buffer.from(payload,"base64url").toString("utf8"));if(!data.exp||Date.now()>data.exp)return null;return data;}catch{return null;}
}
function readCookies(req){
  const raw=req.headers.cookie||"";
  return Object.fromEntries(raw.split(";").map(v=>{const i=v.indexOf("=");if(i<0)return ["",""];return [v.slice(0,i).trim(),decodeURIComponent(v.slice(i+1).trim())];}).filter(([k])=>k));
}
function sessionFromRequest(req){return verifyToken(readCookies(req)[COOKIE_NAME]);}
function setSessionCookie(res,token,maxAgeSeconds=MAX_AGE_SECONDS){res.setHeader("Set-Cookie",`${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAgeSeconds}`);}
function clearSessionCookie(res){res.setHeader("Set-Cookie",`${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);}

module.exports={COOKIE_NAME,safeEqual,createToken,createAreaTicket,verifyAreaTicket,sessionFromRequest,setSessionCookie,clearSessionCookie};
