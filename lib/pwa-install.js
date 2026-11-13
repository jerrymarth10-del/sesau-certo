// Install UI for the student platform; access and authentication stay unchanged.
function applyPwaInstall(html) {
  html = html
    .replace(/<style id="jr-pwa-install-style">[\s\S]*?<\/style>/, '')
    .replace(/<button id="jrPwaInstallBtn"[^>]*>[\s\S]*?<\/button>/, '')
    .replace(/<script id="jr-pwa-runtime">[\s\S]*?<\/script>/, '')
    .replace('href="./manifest.webmanifest"', 'href="/manifest.webmanifest"')
    .replace('href="./apple-touch-icon.png"', 'href="/apple-touch-icon.png"');
  const style = `<style id="jr-install-v2-style">
#jr-install-v2{position:fixed;z-index:2147483000;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));width:min(350px,calc(100vw - 32px));padding:18px;border:1px solid #365864;border-radius:18px;background:#10232d;color:#f4fbfd;box-shadow:0 12px 36px #0007;font:14px/1.5 Arial,sans-serif;box-sizing:border-box}
#jr-install-v2[hidden],#jr-install-help[hidden]{display:none!important}
#jr-install-v2 strong{display:block;font-size:17px;padding-right:34px}
#jr-install-v2 p{margin:7px 0 12px;color:#c8dce5}
#jr-install-close{position:absolute;right:8px;top:6px;width:44px;height:44px;border:0;background:transparent;color:#dceef5;font-size:27px;cursor:pointer}
#jr-install-action{width:100%;min-height:44px;border:0;border-radius:10px;background:#22c55e;color:#052215;font-size:15px;font-weight:700;padding:11px;cursor:pointer}
#jr-install-v2 button:focus-visible{outline:3px solid #fff;outline-offset:3px}
#jr-install-help{margin:12px 0 0;padding-top:12px;border-top:1px solid #365864;color:#e2f1f7}
#jr-install-help ol{padding-left:21px;margin:6px 0}#jr-install-help li{margin:6px 0}
</style>`;
  const script = `<script id="jr-install-v2-script">
(function(){
  var pending=null, installed=false, box, action, help;
  var key='jr_install_dismissed_v2';
  var ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  var mobile=ios||/Android|Mobile/i.test(navigator.userAgent);
  var mode=window.matchMedia('(display-mode: standalone)');
  function standalone(){return installed||mode.matches||navigator.standalone===true;}
  function dismissed(){try{return sessionStorage.getItem(key)==='1';}catch(e){return false;}}
  function refresh(){if(box)box.hidden=standalone()||dismissed()||(!mobile&&!pending);}
  window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();pending=e;refresh();});
  window.addEventListener('appinstalled',function(){installed=true;pending=null;refresh();});
  window.addEventListener('pageshow',refresh);
  if(mode.addEventListener)mode.addEventListener('change',refresh);
  function instructions(){
    help.hidden=false;
    if(ios){
      help.innerHTML='<strong>No iPhone ou iPad</strong><ol><li>Abra este link no <b>Safari</b>.</li><li>Toque em <b>Compartilhar</b> (quadrado com seta para cima, às vezes dentro do menu ⋯).</li><li>Escolha <b>Adicionar à Tela de Início</b> e confirme em <b>Adicionar</b>.</li></ol>';
    }else{
      help.innerHTML='<strong>Adicionar à tela inicial</strong><ol><li>Se abriu pelo WhatsApp ou Instagram, abra o link no <b>Chrome</b>.</li><li>Toque no menu <b>⋮</b> do navegador.</li><li>Escolha <b>Instalar aplicativo</b> ou <b>Adicionar à tela inicial</b> e confirme.</li></ol>';
    }
    action.setAttribute('aria-expanded','true');
  }
  function init(){
    if(document.getElementById('jr-install-v2'))return;
    box=document.createElement('aside');box.id='jr-install-v2';box.hidden=true;box.setAttribute('aria-label','Instalar aplicativo JR Aprova');
    box.innerHTML='<button id="jr-install-close" type="button" aria-label="Fechar aviso de instalação">×</button><strong>Seu preparatório no celular</strong><p>Adicione o JR Aprova à tela inicial e acesse seus estudos com um toque.</p><button id="jr-install-action" type="button" aria-controls="jr-install-help" aria-expanded="false">↓ Instalar aplicativo</button><div id="jr-install-help" hidden aria-live="polite"></div>';
    document.body.appendChild(box);action=document.getElementById('jr-install-action');help=document.getElementById('jr-install-help');
    document.getElementById('jr-install-close').addEventListener('click',function(){box.hidden=true;try{sessionStorage.setItem(key,'1');}catch(e){} });
    action.addEventListener('click',async function(){
      if(standalone()){refresh();return;}
      if(!pending){instructions();return;}
      var prompt=pending;pending=null;action.disabled=true;
      try{await prompt.prompt();var choice=await prompt.userChoice;if(choice.outcome==='accepted'){installed=true;refresh();}}
      catch(e){instructions();}
      finally{action.disabled=false;}
    });
    refresh();
    if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js',{scope:'/'}).catch(function(e){console.warn('PWA: não foi possível registrar o aplicativo.',e);});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
</script>`;
  return html.replace('</head>', style + script + '</head>');
}
module.exports = { applyPwaInstall };
