const crypto = require("crypto");

const COOKIE_NAME = "jr_session";
const MAX_AGE_SECONDS = 60 * 60 * 12;

function getSecret() {
  const secret = process.env.JR_SESSION_SECRET;
  if (!secret) throw new Error("JR_SESSION_SECRET não configurado");
  return secret;
}

function safeEqual(a, b) {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

function sign(payload) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function createToken(email) {
  const payload = Buffer.from(JSON.stringify({
    email: String(email || "").slice(0, 180),
    exp: Date.now() + MAX_AGE_SECONDS * 1000
  })).toString("base64url");
  return payload + "." + sign(payload);
}

function verifyToken(token) {
  if (!token || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.exp || Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

function readCookies(req) {
  const raw = req.headers.cookie || "";
  return Object.fromEntries(raw.split(";").map(v => {
    const i = v.indexOf("=");
    if (i < 0) return ["", ""];
    return [v.slice(0,i).trim(), decodeURIComponent(v.slice(i+1).trim())];
  }).filter(([k]) => k));
}

function sessionFromRequest(req) {
  return verifyToken(readCookies(req)[COOKIE_NAME]);
}

function setSessionCookie(res, token) {
  res.setHeader("Set-Cookie",
    `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE_SECONDS}`);
}

function clearSessionCookie(res) {
  res.setHeader("Set-Cookie",
    `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
}

module.exports = {
  COOKIE_NAME,
  safeEqual,
  createToken,
  sessionFromRequest,
  setSessionCookie,
  clearSessionCookie
};
