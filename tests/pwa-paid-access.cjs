const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
process.env.JR_SESSION_SECRET='LOCAL-TEST-ONLY-'+'x'.repeat(40);
const entPath=require.resolve('../api/_entitlement');
const fake={authorized:true};
require.cache[entPath]={id:entPath,filename:entPath,loaded:true,exports:{
 HEALTH_AREAS:new Set(['cuidadorsocial','enfermagem','acsfiscal']),
 hasEntitlement:async(email,area,req,product)=>fake.authorized&&email==='aluno@example.com'&&area==='cuidadorsocial'&&product==='semusa-pvh-2026'
}};
const {createToken}=require('../api/_auth');
const handler=require('../api/pwa-home');
async function call(token){
 const req={method:'GET',headers:{cookie:token?'jr_session='+encodeURIComponent(token):''}};
 const res={statusCode:200,headers:{},setHeader(k,v){this.headers[k.toLowerCase()]=v;return this},status(n){this.statusCode=n;return this},end(v){this.body=v||'';return this}};
 await handler(req,res);
 return res;
}
(async()=>{
 const missing=await call('');
 assert.equal(missing.statusCode,200);
 assert.match(missing.body,/Confirme sua compra/);
 assert.doesNotMatch(missing.body,/Abrir meu cargo/);
 const manual=await call(createToken('aluno@example.com',3600,'cuidadorsocial','semusa-pvh-2026','','manual'));
 assert.doesNotMatch(manual.body,/Abrir meu cargo/);
 fake.authorized=false;
 const denied=await call(createToken('aluno@example.com',3600,'cuidadorsocial','semusa-pvh-2026','','payment'));
 assert.equal(denied.statusCode,403);
 assert.doesNotMatch(denied.body,/Abrir meu cargo/);
 fake.authorized=true;
 const paid=await call(createToken('aluno@example.com',3600,'cuidadorsocial','semusa-pvh-2026','','payment'));
 assert.equal(paid.statusCode,200);
 assert.match(paid.body,/Cuidador Social/);
 assert.match(paid.body,/\/api\/area-entry\?area=cuidadorsocial/);
 assert.match(paid.body,/Instalar aplicativo JR A Prova/);
 assert.doesNotMatch(paid.body,/\/api\/area-entry\?area=enfermagem/);
 assert.match(paid.headers['set-cookie'],/HttpOnly; Secure; SameSite=Lax/);
 assert.match(paid.headers['cache-control'],/no-store/);
 const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'../manifest.webmanifest'),'utf8'));
 assert.equal(manifest.start_url,'/api/pwa-home');
 assert.equal(manifest.id,'/index.html');
 const sw=fs.readFileSync(path.join(__dirname,'../sw.js'),'utf8');
 assert.match(sw,/Nunca guardar navegação em Cache Storage/);
 assert.match(sw,/cache: "no-store"/);
 console.log('PASS: PWA pago individual, bloqueio sem compra, instalação e não-cache de navegação privada');
})().catch(e=>{console.error(e);process.exitCode=1});