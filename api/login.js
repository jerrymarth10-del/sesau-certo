const crypto = require("crypto");
const { makeToken } = require("./_auth");

function safeEqual(a, b) {
  const aa = Buffer.from(String(a || ""));
  const bb = Buffer.from(String(b || ""));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Método não permitido." });
  }

  const password = process.env.JR_PLATFORM_PASSWORD;
  const secret = process.env.JR_SESSION_SECRET;

  if (!password || !secret) {
    return res.status(500).json({ ok: false, error: "Autenticação ainda não configurada no servidor." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const email = String(body?.email || "").trim().slice(0, 180);
  const senha = String(body?.senha || "");

  if (!email || !senha) {
    return res.status(400).json({ ok: false, error: "Informe e-mail e senha." });
  }

  if (!safeEqual(senha, password)) {
    // resposta genérica: não revela detalhes da credencial
    return res.status(401).json({ ok: false, error: "Senha incorreta. Tente novamente." });
  }

  const token = makeToken(email, secret);
  res.setHeader(
    "Set-Cookie",
    `jr_session=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200`
  );
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ ok: true });
};
