const { verifyAreaTicket } = require("./_auth");

const HEALTH_AREAS = new Set([
  "radiologia","enfermagem","tecnico","fisioterapia","farmaceutico","laboratorio",
  "nutricao","biomedicina","odontologia","psicologia","acsfiscal","educacaofisica","clinico"
]);

module.exports=async function handler(req,res){
  res.setHeader("Cache-Control","no-store, max-age=0");
  res.setHeader("Pragma","no-cache");
  res.setHeader("Referrer-Policy","no-referrer");
  res.setHeader("X-Content-Type-Options","nosniff");

  if(req.method!=="POST"){
    res.setHeader("Allow","POST");
    return res.status(405).json({ok:false});
  }

  const length=Number(req.headers["content-length"]||0);
  if(length>12288) return res.status(413).json({ok:false});

  try{
    const body=typeof req.body==="string"?JSON.parse(req.body||"{}"):(req.body||{});
    const ticket=String(body.ticket||"");
    if(!ticket || ticket.length>8192) return res.status(400).json({ok:false});

    const data=verifyAreaTicket(ticket);
    const area=String(data?.area||"").trim().toLowerCase();
    if(!data || !HEALTH_AREAS.has(area)) return res.status(401).json({ok:false});

    return res.status(200).json({ok:true,area,exp:Number(data.exp||0)});
  }catch(err){
    return res.status(400).json({ok:false});
  }
};
