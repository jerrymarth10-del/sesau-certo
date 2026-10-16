const assert=require('node:assert/strict');
const {insertCuidadorSocial}=require('../lib/cuidador-social');
const html='<html><head></head><body><section id="especificas"><a data-jr-card="servicosgerais"><div>Serviços Gerais</div></a></section></body></html>';
const out=insertCuidadorSocial(html);
assert.match(out,/data-jr-card="cuidadorsocial"/);
assert.match(out,/\/api\/area-entry\?area=cuidadorsocial/);
assert.equal(insertCuidadorSocial(out),out);
console.log('OK: Cuidador Social Projeto 1');
