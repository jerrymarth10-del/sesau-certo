const { verifyToken, parseCookies } = require("./_auth");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false });
  }

  const secret = process.env.JR_SESSION_SECRET;
  const cookies = parseCookies(req);
  const payload = verifyToken(cookies.jr_session, secret);

  res.setHeader("Cache-Control", "no-store");
  if (!payload) return res.status(401).json({ ok: false });

  return res.status(200).json({ ok: true });
};
