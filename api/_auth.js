const crypto = require("crypto");

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function makeToken(email, secret) {
  const payload = {
    email,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 12)
  };
  const encoded = base64url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded, secret)}`;
}

function verifyToken(token, secret) {
  if (!token || !secret || !token.includes(".")) return null;
  const [encoded, signature] = token.split(".");
  const expected = sign(encoded, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

function parseCookies(req) {
  const raw = req.headers.cookie || "";
  return Object.fromEntries(
    raw.split(";").map(v => v.trim()).filter(Boolean).map(v => {
      const i = v.indexOf("=");
      return [decodeURIComponent(v.slice(0, i)), decodeURIComponent(v.slice(i + 1))];
    })
  );
}

module.exports = { makeToken, verifyToken, parseCookies };
