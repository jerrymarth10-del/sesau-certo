(function(){
  "use strict";
  var installButton=document.getElementById("jr-install");
  var status=document.getElementById("jr-install-status");
  var iphoneGuide=document.getElementById("jr-iphone-help");
  var deferred=null;
  function tell(msg){if(status)status.textContent=msg;}
  var isStandalone=window.matchMedia && window.matchMedia("(display-mode: standalone)").matches ||
                   window.navigator.standalone===true;
  if (isStandalone) {
    if(installButton)installButton.hidden=true;
    tell("O aplicativo já está instalado.");
  }
  window.addEventListener("beforeinstallprompt",function(event){
    event.preventDefault();
    deferred=event;
    if(installButton&&!isStandalone)installButton.hidden=false;
    tell("O aplicativo pode ser instalado neste dispositivo.");
  });
  window.addEventListener("appinstalled",function(){
    deferred=null;
    if(installButton)installButton.hidden=true;
    tell("Aplicativo adicionado à tela inicial.");
  });
  if(installButton){
    installButton.addEventListener("click",async function(){
      if(deferred){
        var prompt=deferred;
        deferred=null;
        try{await prompt.prompt();await prompt.userChoice;}
        catch(e){tell("Não foi possível abrir o instalador. Use o menu do navegador.");}
        return;
      }
      if(iphoneGuide)iphoneGuide.open=true;
      tell("No iPhone, use Safari → Compartilhar → Adicionar à Tela de Início. Em outros navegadores, abra o menu e escolha Instalar app.");
    });
  }
  if("serviceWorker" in navigator){
    window.addEventListener("load",function(){
      navigator.serviceWorker.register("/sw.js",{scope:"/"}).catch(function(){
        tell("Instalação automática indisponível. Verifique as opções do seu navegador.");
      });
    });
  }
})();
