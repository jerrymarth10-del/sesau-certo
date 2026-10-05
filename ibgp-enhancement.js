(function(){
'use strict';
function init(){
  try{
    if(typeof quizBank==='undefined'||typeof data==='undefined')return;
    quizBank.ibgp=[
      {q:'Na frase “Os candidatos estudaram, portanto chegaram mais preparados”, a palavra “portanto” indica:',o:['causa','conclusão','oposição','condição'],a:1,e:'“Portanto” introduz uma conclusão.'},
      {q:'Assinale a concordância verbal adequada:',o:['Houveram muitos inscritos.','Fazem dois meses que estudo.','Existem boas estratégias de revisão.','Deve haverem novas provas.'],a:2,e:'O verbo existir concorda com o sujeito: “Existem boas estratégias”.'},
      {q:'A negação lógica de “João estuda e Maria revisa” é:',o:['João não estuda e Maria não revisa.','João não estuda ou Maria não revisa.','João estuda ou Maria revisa.','João não estuda se Maria revisa.'],a:1,e:'Pela lei de De Morgan, a negação de P e Q é não P ou não Q.'},
      {q:'Um material de R$ 120 recebe desconto de 15%. O novo valor é:',o:['R$ 102','R$ 105','R$ 108','R$ 114'],a:0,e:'15% de 120 é 18; 120 - 18 = 102.'},
      {q:'No SUS, o acesso às ações e serviços de saúde em todos os níveis relaciona-se ao princípio da:',o:['universalidade','publicidade','licitação','hierarquia administrativa'],a:0,e:'A universalidade assegura acesso às ações e aos serviços de saúde.'},
      {q:'A participação da comunidade no SUS ocorre, entre outros meios, por:',o:['conselhos e conferências de saúde','cartórios','juntas comerciais','tribunais eleitorais'],a:0,e:'Conselhos e conferências são instrumentos de participação social no SUS.'},
      {q:'Uma mensagem falsa que tenta obter senha do usuário é exemplo de:',o:['backup','phishing','compactação','cache'],a:1,e:'Phishing é uma tentativa de fraude para obter dados sensíveis.'},
      {q:'Uma cópia de segurança para recuperação de arquivos é chamada de:',o:['firewall','backup','cookie','cache'],a:1,e:'Backup é a cópia destinada à recuperação de dados.'},
      {q:'Ao resolver uma questão objetiva, uma estratégia segura é:',o:['ignorar o comando','identificar o comando e eliminar alternativas incompatíveis','escolher sempre a maior alternativa','trocar a resposta sempre que houver dúvida'],a:1,e:'Ler o comando com atenção e eliminar alternativas incompatíveis reduz erros.'},
      {q:'Depois da teoria, uma forma eficiente de consolidar o conteúdo é:',o:['evitar exercícios','resolver questões, revisar erros e retornar aos pontos fracos','estudar só conteúdos novos','abandonar revisões'],a:1,e:'Questões e revisão dos erros ajudam a consolidar o aprendizado.'}
    ];

    var portugues=data.find(function(item){return item&&item.id==='portugues';});
    if(portugues&&Array.isArray(portugues.lessons)&&!portugues.lessons.some(function(a){return /IBGP/i.test(String(a.title||''));})){
      portugues.desc='Interpretação, gramática, revisão e questões, com reforço direcionado às bancas IDECAN e IBGP.';
      portugues.badge='Aulas + PDFs + Quiz • IBGP';
      portugues.lessons.splice(2,0,
        {icon:'🎯',title:'Questões de Português — Banca IBGP',note:'Resolução comentada e perfil de cobrança',url:'https://www.youtube.com/watch?v=cXqcBFu5fbQ'},
        {icon:'🎯',title:'Desafios de Português — IBGP',note:'Treino complementar de interpretação e gramática',url:'https://www.youtube.com/watch?v=QUl6nd_lunQ'}
      );
    }

    var rlm=data.find(function(item){return item&&item.id==='rlm';});
    if(rlm&&Array.isArray(rlm.lessons)&&!rlm.lessons.some(function(a){return /Banca IBGP/i.test(String(a.title||''));})){
      rlm.desc='Sequências, proposições, porcentagem e lógica de argumentação, com questões IDECAN e IBGP.';
      rlm.badge='Aulas + PDF + Quiz • IBGP';
      rlm.lessons.splice(1,0,
        {icon:'🎯',title:'Raciocínio Lógico — Questões Banca IBGP',note:'Aula comentada focada na banca IBGP',url:'https://www.youtube.com/watch?v=MTkILgPm6Gs'},
        {icon:'🎯',title:'Raciocínio Lógico — Prova IBGP comentada',note:'Treino complementar com questões anteriores',url:'https://www.youtube.com/watch?v=v73riA8AvWY'}
      );
    }

    if(!data.some(function(item){return item&&item.id==='ibgp';})){
      var ibgpModule={
        id:'ibgp',icon:'🎯',title:'Banca IBGP — aulas e Quiz estratégico',
        desc:'Reforço para treinar Português, Raciocínio Lógico, SUS e Informática com foco no estilo de prova da IBGP.',
        badge:'Aulas IBGP + Quiz',embed:'cXqcBFu5fbQ',openVideo:'https://www.youtube.com/watch?v=cXqcBFu5fbQ',
        extraEmbed:'MTkILgPm6Gs',extraVideo:'https://www.youtube.com/watch?v=MTkILgPm6Gs',quizKey:'ibgp',
        lessons:[
          {icon:'🎥',title:'Português — Questões Banca IBGP',note:'Resolução comentada',url:'https://www.youtube.com/watch?v=cXqcBFu5fbQ'},
          {icon:'🎥',title:'Português — Desafios IBGP',note:'Interpretação e gramática',url:'https://www.youtube.com/watch?v=QUl6nd_lunQ'},
          {icon:'🎥',title:'Raciocínio Lógico — Questões IBGP',note:'Treino comentado',url:'https://www.youtube.com/watch?v=MTkILgPm6Gs'},
          {icon:'🎥',title:'Raciocínio Lógico — Prova IBGP comentada',note:'Questões anteriores',url:'https://www.youtube.com/watch?v=v73riA8AvWY'}
        ],pdfs:[]
      };
      var idx=data.findIndex(function(item){return item&&item.id==='entendendo-idecan';});
      if(idx>=0)data.splice(idx,0,ibgpModule);else data.push(ibgpModule);
    }
  }catch(e){console.warn('JR IBGP enhancement:',e&&e.message?e.message:e);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();