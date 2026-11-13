const { safeEqual, createToken, setSessionCookie } = require("./_auth");

// Local login throttling for the migrated Vercel project. The previous
// remote guard was bound to the former Vercel OIDC identity and rejected
// legitimate first-time logins after the account migration.
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;

function clientIp(req) {
  const raw = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim()
    || String(req.headers["x-real-ip"] || "").trim();
  return raw.length <= 64 && /^[0-9a-fA-F:.]+$/.test(raw) ? raw : "unknown";
}
function attemptKey(req, email) {
  return clientIp(req) + "|" + email;
}
function isBlocked(key) {
  const now = Date.now();
  const record = attempts.get(key);
  if (!record || now - record.startedAt >= WINDOW_MS) {
    attempts.delete(key);
    return false;
  }
  return record.failures >= MAX_FAILURES;
}
function recordFailure(key) {
  const now = Date.now();
  const record = attempts.get(key);
  if (!record || now - record.startedAt >= WINDOW_MS) {
    attempts.set(key, { startedAt: now, failures: 1 });
  } else {
    record.failures += 1;
  }
  if (attempts.size > 5000) {
    for (const [k, v] of attempts) {
      if (now - v.startedAt >= WINDOW_MS) attempts.delete(k);
    }
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
  const manualPassword = process.env.JR_MANUAL_PLATFORM_PASSWORD;
  if (!configuredPassword || !process.env.JR_SESSION_SECRET) {
    return res.status(503).json({ok:false, message:"Autenticação ainda não configurada no servidor."});
  }

  const { email, senha, lembrar } = req.body || {};
  const normalizedEmail=String(email||"")
    .replace(/[\u200B-\u200D\uFEFF]/g,"")
    .trim()
    .toLowerCase()
    .slice(0,180);
  const rawPassword=String(senha||"")
    .replace(/[\u200B-\u200D\uFEFF]/g,"")
    .trim();

  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail) || !rawPassword || rawPassword.length>256) {
    return res.status(400).json({ok:false, message:"Informe e-mail e senha válidos."});
  }

  const key = attemptKey(req, normalizedEmail);
  if (isBlocked(key)) {
    return res.status(429).json({ok:false,message:"Muitas tentativas. Aguarde 15 minutos e tente novamente."});
  }

  const matchesConfigured = safeEqual(rawPassword, String(configuredPassword));
  const matchesManual = !!manualPassword && safeEqual(rawPassword, String(manualPassword));
  if (!matchesConfigured && !matchesManual) {
    recordFailure(key);
    return res.status(401).json({ok:false, message:"E-mail ou senha incorretos."});
  }

  attempts.delete(key);
  const maxAgeSeconds = lembrar === true ? 60 * 60 * 24 * 30 : 60 * 60 * 12;
  // Manual/WhatsApp login is independent of payment entitlement.
  // Its signed session never impersonates a paid purchase.
  const token = createToken(normalizedEmail, maxAgeSeconds, "", "", "", "manual");
  setSessionCookie(res, token, maxAgeSeconds);
  return res.status(200).json({ok:true});
};
