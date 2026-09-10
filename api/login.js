const { safeEqual, createToken, setSessionCookie } = require("./_auth");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ok:false, message:"Método não permitido."});
  }

  const configuredPassword = process.env.JR_PLATFORM_PASSWORD;
  if (!configuredPassword || !process.env.JR_SESSION_SECRET) {
    return res.status(503).json({ok:false, message:"Autenticação ainda não configurada no servidor."});
  }

  const { email, senha } = req.body || {};
  if (!email || !senha) {
    return res.status(400).json({ok:false, message:"Informe e-mail e senha."});
  }

  if (!safeEqual(String(senha), String(configuredPassword))) {
    return res.status(401).json({ok:false, message:"Senha incorreta. Tente novamente."});
  }

  const token = createToken(email);
  setSessionCookie(res, token);
  return res.status(200).json({ok:true});
};
