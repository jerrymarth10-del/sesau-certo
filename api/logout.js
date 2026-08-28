module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false });
  }

  res.setHeader(
    "Set-Cookie",
    "jr_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"
  );
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ ok: true });
};
