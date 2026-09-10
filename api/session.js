const { sessionFromRequest } = require("./_auth");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({authenticated:false});
  }

  try {
    const session = sessionFromRequest(req);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      authenticated: !!session,
      email: session ? session.email : null
    });
  } catch {
    return res.status(200).json({authenticated:false});
  }
};
