// Run with: node scripts/check-catalog.cjs. Uses local index, no production requests.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
(async()=>{
 const originalFetch=global.fetch;
 global.fetch=async url=>{assert.match(String(url),/^https:\/\/[^/]+\/index\.html$/);return {ok:true,text:async()=>fs.readFileSync(root+'/index.html','utf8')}};
 let html='';const res={statusCode:200,setHeader(){},end(v){html=v}};
 try{await require(root+'/api/inject-quimica')({headers:{},query:{}},res)}finally{global.fetch=originalFetch}
 assert.equal(res.statusCode,200,html.slice(0,200));
 const cards=Array.from(html.matchAll(/<a\b[^>]*class="especifica-card-link"[^>]*>[\s\S]*?<\/a>/g),m=>m[0]);
 assert.equal(cards.length,31,'Unexpected catalog size');
 for(const key of ['pedagogia','cuidadorsocial','secretariaescolar','policia-penal-ro']){
  const matches=cards.filter(c=>c.includes('data-jr-card="'+key+'"'));
  assert.equal(matches.length,1,'Missing/duplicate '+key);
  assert.match(matches[0],/<img\b[^>]*src="data:image\/(jpeg|png|svg\+xml);base64,/,'Missing artwork '+key);
 }
 const teacher=cards.find(c=>c.includes('data-jr-card="pedagogia"'));
 assert.match(teacher,/href="\/api\/area-entry\?area=pedagogia"/);
 assert.match(teacher,/Professor SEMED — Séries Iniciais/);
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(!/application\/ld\+json/.test(m[1]))new vm.Script(m[2]);}
 let location='';const redirect={statusCode:200,setHeader(k,v){if(k==='Location')location=v},end(){}};
 await require(root+'/api/area-entry')({method:'GET',headers:{},query:{area:'pedagogia'}},redirect);
 assert.equal(redirect.statusCode,302);assert.equal(location,'https://especificas-premium.vercel.app/?area=pedagogia');
 console.log(JSON.stringify({ok:true,cards:31,targetCardArt:'embedded',scripts:'valid',teacherRedirect:location}));
})().catch(e=>{console.error('CATALOG_CHECK_FAILED:',e.message);process.exitCode=1});
