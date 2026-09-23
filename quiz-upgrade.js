(function(){
  "use strict";

  const ROUND_SIZE = 20;
  const HARD_PER_ROUND = 6;
  const STORAGE_PREFIX = "jr_quiz_rotation_v2_";

  const JR_HARD_BANK = {
    portugues: [
      {q:"Assinale a alternativa integralmente de acordo com a norma-padrão de regência verbal.",o:["O candidato aspirava o cargo e assistiu o julgamento.","O candidato aspirava ao cargo e assistiu ao julgamento.","O candidato aspirava ao cargo e assistiu o julgamento.","O candidato aspirava o cargo e assistiu ao julgamento."],a:1,e:"No sentido de desejar, aspirar rege a preposição 'a'; no sentido de ver/presenciar, assistir também rege 'a'."},
      {q:"Assinale a frase em que o emprego do acento indicativo de crase está correto.",o:["Esta é a norma a qual me referi.","Esta é a norma à qual me referi.","Esta é a norma à que me referi.","Esta é a norma a cuja me referi."],a:1,e:"O verbo referir-se rege a preposição 'a', e o pronome relativo 'a qual' admite a fusão: 'à qual'."},
      {q:"Assinale a alternativa em que a concordância verbal está inteiramente correta.",o:["Fazem três anos que não se publicam editais semelhantes.","Faz três anos que não se publica editais semelhantes.","Faz três anos que não se publicam editais semelhantes.","Fazem três anos que não se publica editais semelhantes."],a:2,e:"Fazer indicando tempo decorrido é impessoal e fica no singular; 'editais semelhantes' é sujeito paciente de 'publicam-se', exigindo plural."},
      {q:"Em qual alternativa a pontuação preserva uma oração adjetiva restritiva, sem separar sujeito e predicado?",o:["Os candidatos, que apresentaram recurso no prazo terão a documentação reanalisada.","Os candidatos que apresentaram recurso no prazo, terão a documentação reanalisada.","Os candidatos que apresentaram recurso no prazo terão a documentação reanalisada.","Os candidatos, que apresentaram recurso no prazo, terão a documentação reanalisada."],a:2,e:"A oração 'que apresentaram recurso no prazo' restringe o grupo de candidatos e não deve ser isolada por vírgulas; também não se separa o sujeito do predicado."},
      {q:"Assinale a alternativa correta quanto à colocação pronominal na norma-padrão.",o:["Nunca disseram-me o motivo da alteração.","Nunca me disseram o motivo da alteração.","Nunca disseram o motivo-me da alteração.","Me nunca disseram o motivo da alteração."],a:1,e:"O advérbio de sentido negativo 'nunca' atrai o pronome oblíquo, exigindo próclise: 'Nunca me disseram'."},
      {q:"Assinale a alternativa em que 'iminente' e 'eminente' foram empregados corretamente.",o:["O pesquisador era iminente, e o risco era eminente.","O pesquisador era eminente, e o risco era iminente.","O pesquisador era eminente, e o risco era eminente.","O pesquisador era iminente, e o risco era iminente."],a:1,e:"Eminente significa ilustre, elevado; iminente significa que está prestes a ocorrer."},
      {q:"Em 'É indispensável que os candidatos leiam atentamente o comando da questão', a oração destacada exerce função de:",o:["objeto direto","sujeito","complemento nominal","adjunto adverbial"],a:1,e:"A oração 'que os candidatos leiam...' funciona como sujeito da expressão 'é indispensável', sendo subordinada substantiva subjetiva."},
      {q:"Assinale a frase em que a crase é obrigatória nas duas ocorrências.",o:["A reunião começa a 14h e termina a 16h.","A reunião começa às 14h e termina às 16h.","A reunião começa à 14h e termina à 16h.","A reunião começa as 14h e termina as 16h."],a:1,e:"Na indicação de horas determinadas, emprega-se crase: 'às 14h' e 'às 16h'."}
    ],
    rlm: [
      {q:"Três questões independentes têm probabilidade de 1/2 de serem acertadas ao acaso. A probabilidade de acertar exatamente duas delas é:",o:["1/8","1/4","3/8","1/2"],a:2,e:"Há C(3,2)=3 maneiras de acertar exatamente duas; cada sequência tem probabilidade (1/2)^3=1/8. Logo, 3/8."},
      {q:"Em um grupo de 120 candidatos, 70 estudam Português, 55 estudam Raciocínio Lógico e 30 estudam ambas as matérias. Quantos não estudam nenhuma das duas?",o:["15","20","25","35"],a:2,e:"Pelo princípio da inclusão-exclusão, 70+55-30=95 estudam ao menos uma. Portanto, 120-95=25 não estudam nenhuma."},
      {q:"Um valor sofre aumento de 20% e, em seguida, redução de 20% sobre o novo valor. Em relação ao valor inicial, o resultado final representa:",o:["aumento de 4%","redução de 4%","nenhuma alteração","redução de 2%"],a:1,e:"Tomando 100 como base: 100×1,20=120 e 120×0,80=96. O resultado é 4% menor que o inicial."},
      {q:"Considere a proposição: 'Se o candidato revisou o conteúdo, então resolveu o simulado'. Sabendo que ele não resolveu o simulado, qual conclusão é logicamente válida?",o:["Ele revisou o conteúdo.","Ele não revisou o conteúdo.","Ele resolveu apenas parte do simulado.","Nada pode ser concluído."],a:1,e:"Pela contrapositiva de P→Q, de ¬Q conclui-se ¬P. Portanto, se não resolveu o simulado, não revisou o conteúdo, dentro das condições da proposição."},
      {q:"Se 6 servidores, com a mesma produtividade, concluem uma tarefa em 15 dias, em quantos dias 10 servidores concluiriam a mesma tarefa, mantida a produtividade?",o:["6","8","9","10"],a:2,e:"O trabalho total é 6×15=90 servidor-dias. Com 10 servidores, 90÷10=9 dias."},
      {q:"A sequência 2, 6, 12, 20, 30 segue a lei n(n+1), para n=1,2,3,... Qual é o próximo termo?",o:["36","40","42","44"],a:2,e:"Para n=6, o termo é 6×7=42."},
      {q:"Um candidato obteve notas 7, 8 e 9 em três avaliações de pesos 2, 3 e 5, respectivamente. Sua média ponderada é:",o:["8,0","8,2","8,3","8,5"],a:2,e:"A soma ponderada é 7×2+8×3+9×5=14+24+45=83. A soma dos pesos é 10; 83÷10=8,3."},
      {q:"Cinco pessoas distintas formarão uma fila. Se duas pessoas específicas devem permanecer juntas, quantas filas diferentes são possíveis?",o:["24","36","48","60"],a:2,e:"Trate as duas pessoas como um bloco: há 4! formas de ordenar o bloco e as outras três pessoas, e 2 formas internas do bloco. Total: 4!×2=48."}
    ],
    informatica: [
      {q:"Na estratégia de backup 3-2-1, qual configuração atende corretamente à regra?",o:["3 cópias dos dados, em 2 tipos de mídia, com 1 cópia fora do local principal.","3 cópias na mesma unidade, 2 senhas e 1 antivírus.","3 usuários, 2 discos no mesmo computador e 1 pasta compartilhada.","3 backups incrementais, 2 completos e 1 diferencial."],a:0,e:"A regra 3-2-1 recomenda três cópias dos dados, em dois tipos de mídia, mantendo ao menos uma cópia fora do local principal."},
      {q:"Sobre funções hash criptográficas, assinale a alternativa correta.",o:["São reversíveis quando a chave privada é conhecida.","Servem principalmente para garantir confidencialidade do conteúdo.","Produzem um resumo usado, entre outras finalidades, para verificar integridade.","Substituem obrigatoriamente a criptografia assimétrica em conexões TLS."],a:2,e:"Hash criptográfico produz um resumo não destinado à reversão e é amplamente usado para detectar alterações e verificar integridade."},
      {q:"Um usuário recebe mensagem que imita seu banco e o direciona a uma página falsa para capturar credenciais. O ataque descrito é, principalmente:",o:["phishing","desfragmentação","virtualização","indexação"],a:0,e:"Phishing utiliza mensagens e páginas fraudulentas para induzir a vítima a entregar informações sensíveis."},
      {q:"Ao acessar um site por HTTPS, qual afirmação é tecnicamente correta?",o:["HTTPS garante que todo conteúdo do site é verdadeiro.","HTTPS impede qualquer tipo de phishing.","HTTPS protege a comunicação em trânsito, mas não garante que o conteúdo do site seja legítimo.","HTTPS elimina a necessidade de verificar o domínio acessado."],a:2,e:"TLS/HTTPS protege a comunicação e autentica o endpoint conforme o certificado, mas um site malicioso também pode usar HTTPS; o usuário ainda deve conferir o domínio e o contexto."},
      {q:"Para reduzir o impacto de ransomware sobre backups, qual prática é mais adequada?",o:["Manter todas as cópias permanentemente conectadas e graváveis.","Usar apenas uma cópia no mesmo computador.","Manter cópias segregadas, com ao menos uma offline ou imutável.","Desativar versionamento para economizar espaço."],a:2,e:"Cópias offline, imutáveis ou devidamente segregadas reduzem a chance de o ransomware criptografar também os backups."},
      {q:"Qual alternativa representa autenticação multifator com fatores de categorias diferentes?",o:["Senha + PIN.","Senha + pergunta secreta.","Senha + impressão digital.","Duas senhas diferentes."],a:2,e:"Senha é fator de conhecimento; impressão digital é fator biométrico. Combinar categorias diferentes caracteriza MFA."},
      {q:"Em redes Wi-Fi públicas, qual medida reduz o risco de interceptação de tráfego sem tornar o dispositivo invulnerável?",o:["Desativar HTTPS para evitar conflito de certificados.","Utilizar conexões HTTPS e, quando apropriado, uma VPN confiável.","Compartilhar arquivos publicamente para melhorar descoberta da rede.","Desabilitar atualizações de segurança durante a conexão."],a:1,e:"HTTPS e uma VPN confiável ajudam a proteger dados em trânsito; ainda assim, é necessário manter outras práticas de segurança."},
      {q:"O princípio do menor privilégio determina que:",o:["cada usuário receba apenas as permissões necessárias para executar suas funções.","todos os usuários tenham perfil administrativo para evitar bloqueios.","permissões sejam concedidas por tempo indeterminado.","contas compartilhadas sejam preferidas para simplificar auditoria."],a:0,e:"Menor privilégio reduz a superfície de risco ao limitar permissões ao estritamente necessário para a função."}
    ],
    sus: [
      {q:"Um município organiza atendimento de modo que qualquer pessoa possa acessar o SUS, mas direciona mais recursos a grupos com maior risco e necessidade. Os princípios evidenciados são, respectivamente:",o:["universalidade e equidade","integralidade e descentralização","equidade e regionalização","universalidade e hierarquização"],a:0,e:"Universalidade assegura acesso a todos; equidade orienta a alocação diferenciada segundo necessidades distintas."},
      {q:"Segundo a Lei nº 8.142/1990, assinale a alternativa correta.",o:["A Conferência de Saúde é permanente e deliberativa.","O Conselho de Saúde reúne-se obrigatoriamente apenas a cada quatro anos.","A Conferência de Saúde reúne-se a cada quatro anos, e o Conselho de Saúde tem caráter permanente e deliberativo.","Conferência e Conselho têm exatamente a mesma periodicidade e função."],a:2,e:"A Lei 8.142/1990 prevê Conferência de Saúde a cada quatro anos e Conselho de Saúde permanente e deliberativo."},
      {q:"A participação da iniciativa privada no SUS, nos termos da Lei nº 8.080/1990, pode ocorrer de forma complementar quando:",o:["a iniciativa privada desejar substituir integralmente a rede pública.","as disponibilidades do SUS forem insuficientes para garantir cobertura assistencial à população de determinada área.","o município extinguir seu fundo de saúde.","houver proibição de contratação de entidades filantrópicas."],a:1,e:"O art. 24 da Lei 8.080/1990 admite participação complementar quando as disponibilidades do SUS forem insuficientes para garantir a cobertura assistencial."},
      {q:"Assinale a alternativa compatível com a organização do SUS prevista na Lei nº 8.080/1990.",o:["Centralização político-administrativa exclusiva na União.","Descentralização político-administrativa, com direção única em cada esfera de governo.","Direção colegiada obrigatória e idêntica em todos os municípios.","Ausência de hierarquização da rede de serviços."],a:1,e:"A Lei 8.080/1990 estabelece descentralização político-administrativa, com direção única em cada esfera de governo, além de regionalização e hierarquização."},
      {q:"A vigilância epidemiológica, no âmbito do SUS, está relacionada principalmente a:",o:["conjunto de ações que proporciona conhecimento, detecção ou prevenção de mudanças nos fatores determinantes e condicionantes de saúde, visando recomendar e adotar medidas de prevenção e controle.","fiscalização exclusivamente contábil dos hospitais privados.","controle apenas de medicamentos importados.","gestão exclusiva de folha de pagamento das secretarias de saúde."],a:0,e:"A definição legal de vigilância epidemiológica envolve conhecer, detectar ou prevenir mudanças nos fatores determinantes e condicionantes para recomendar e adotar medidas de prevenção e controle."},
      {q:"Qual conjunto apresenta apenas fatores reconhecidos pela Lei nº 8.080/1990 como determinantes e condicionantes da saúde?",o:["alimentação, moradia, saneamento básico, meio ambiente, trabalho e renda.","somente genética e idade.","apenas atendimento hospitalar e medicamentos.","exclusivamente renda e escolaridade."],a:0,e:"A Lei 8.080/1990 inclui, entre outros, alimentação, moradia, saneamento básico, meio ambiente, trabalho, renda, educação, transporte, lazer e acesso a bens e serviços essenciais."},
      {q:"Nos Conselhos e Conferências de Saúde, a representação dos usuários, segundo a Lei nº 8.142/1990, deve ser:",o:["inferior à representação governamental.","paritária em relação ao conjunto dos demais segmentos.","limitada a profissionais de saúde.","definida exclusivamente pelo Ministério da Saúde."],a:1,e:"A Lei 8.142/1990 determina paridade da representação dos usuários em relação ao conjunto dos demais segmentos."},
      {q:"O Conselho de Saúde atua, segundo a Lei nº 8.142/1990:",o:["apenas na execução direta de procedimentos clínicos.","na formulação de estratégias e no controle da execução da política de saúde, inclusive nos aspectos econômicos e financeiros.","somente na convocação de eleições municipais.","exclusivamente na contratação de servidores."],a:1,e:"O Conselho de Saúde é órgão permanente e deliberativo que participa da formulação de estratégias e controla a execução da política de saúde, inclusive em seus aspectos econômicos e financeiros."}
    ],
    rondonia: [
      {q:"A sequência histórica correta sobre a formação político-administrativa de Rondônia é:",o:["Estado de Rondônia em 1943 → Território do Guaporé em 1956 → instalação em 1981.","Território Federal do Guaporé em 1943 → denominação Rondônia em 1956 → criação do Estado em 1981 → instalação em 1982.","Território de Rondônia em 1943 → Estado do Guaporé em 1956 → instalação em 1982.","Território Federal do Guaporé em 1956 → Estado de Rondônia em 1960 → instalação em 1981."],a:1,e:"O Território Federal do Guaporé foi criado em 1943, passou a se chamar Rondônia em 1956, foi elevado a Estado em 1981 e instalado em 4 de janeiro de 1982."},
      {q:"O Território Federal do Guaporé, criado em 1943, foi formado a partir de áreas desmembradas principalmente de:",o:["Acre e Pará.","Amazonas e Mato Grosso.","Goiás e Mato Grosso.","Amazonas e Acre."],a:1,e:"O Território Federal do Guaporé foi constituído a partir de áreas desmembradas dos estados do Amazonas e de Mato Grosso."},
      {q:"A mudança do nome Território Federal do Guaporé para Rondônia, em 1956, homenageou:",o:["Jorge Teixeira de Oliveira.","Aluízio Ferreira.","Cândido Mariano da Silva Rondon.","Getúlio Vargas."],a:2,e:"O nome Rondônia homenageia o marechal Cândido Mariano da Silva Rondon."},
      {q:"A Lei Complementar nº 41, de 22 de dezembro de 1981, está diretamente relacionada a:",o:["criação do Território Federal do Guaporé.","mudança do nome Guaporé para Rondônia.","elevação do Território Federal de Rondônia à categoria de Estado.","construção da Estrada de Ferro Madeira-Mamoré."],a:2,e:"A Lei Complementar nº 41/1981 elevou o então Território Federal de Rondônia à categoria de Estado."},
      {q:"A instalação oficial do Estado de Rondônia ocorreu em:",o:["13 de setembro de 1943.","17 de fevereiro de 1956.","22 de dezembro de 1981.","4 de janeiro de 1982."],a:3,e:"Embora a criação tenha ocorrido em 22 de dezembro de 1981, a instalação oficial do novo Estado ocorreu em 4 de janeiro de 1982."},
      {q:"Quem tomou posse como primeiro governador do recém-instalado Estado de Rondônia em janeiro de 1982?",o:["Aluízio Ferreira.","Jorge Teixeira de Oliveira.","Cândido Rondon.","Roquette-Pinto."],a:1,e:"Jorge Teixeira de Oliveira tomou posse como primeiro governador do Estado de Rondônia na instalação de 4 de janeiro de 1982."},
      {q:"A Estrada de Ferro Madeira-Mamoré, marco histórico da ocupação regional, teve sua construção concentrada no período de:",o:["1880–1885.","1907–1912.","1939–1945.","1964–1970."],a:1,e:"Fontes oficiais do Governo de Rondônia situam a construção da Estrada de Ferro Madeira-Mamoré entre 1907 e 1912."},
      {q:"A BR-364 teve papel central na história recente de Rondônia porque:",o:["reduziu os fluxos migratórios e isolou a região.","favoreceu a colonização agrícola e intensificou fluxos migratórios nas décadas de 1960 e 1970.","substituiu a criação do Território Federal do Guaporé em 1943.","foi construída exclusivamente para transporte ferroviário."],a:1,e:"A abertura e consolidação da BR-364 impulsionaram a migração e a colonização agrícola, sobretudo nas décadas de 1960 e 1970."}
    ],
    idecan: [
      {q:"Em uma questão de múltipla escolha, o comando pede a alternativa INCORRETA. Qual procedimento reduz mais o risco de erro por leitura automática?",o:["Ler somente as alternativas e ignorar o comando.","Identificar explicitamente a palavra de negação no comando e testar cada alternativa contra a regra cobrada.","Marcar a primeira alternativa familiar.","Escolher a opção mais longa."],a:1,e:"Em comandos negativos, destacar mentalmente a negação e confrontar cada alternativa com a regra evita responder a pergunta oposta à que foi feita."},
      {q:"Uma questão apresenta quatro assertivas I, II, III e IV e pede a combinação correta. Qual estratégia é logicamente mais segura?",o:["Avaliar cada assertiva isoladamente antes de comparar as combinações oferecidas.","Começar pelas combinações e presumir verdadeiras as assertivas repetidas.","Eliminar automaticamente a alternativa mais extensa.","Considerar correta toda assertiva que use termos absolutos."],a:0,e:"Julgar cada assertiva com base no conteúdo antes de olhar as combinações reduz vieses e permite eliminar alternativas de forma consistente."},
      {q:"Em uma questão com texto-base longo e comando específico sobre inferência, a resposta deve ser escolhida com base:",o:["no conhecimento de mundo, mesmo que contradiga o texto.","no que pode ser deduzido do texto sem acrescentar informação incompatível.","na opinião pessoal do candidato.","na alternativa com vocabulário mais técnico."],a:1,e:"Inferência exige conclusão sustentada pelo texto e pelas relações nele presentes, sem inserir premissas que o texto não autoriza."},
      {q:"Uma alternativa afirma que determinado evento ocorre 'sempre', enquanto a regra estudada admite exceções expressas. Qual análise é adequada?",o:["A presença de 'sempre' é irrelevante.","A alternativa pode estar errada justamente por transformar uma regra não absoluta em afirmação universal.","Toda alternativa com 'sempre' é necessariamente falsa.","Exceções nunca interferem na validade de uma proposição."],a:1,e:"Quando a norma admite exceções, uma formulação universal pode ultrapassar o alcance da regra. O termo absoluto deve ser confrontado com as exceções previstas."},
      {q:"Em prova objetiva, duas alternativas parecem plausíveis, mas uma reproduz a regra geral e outra descreve uma exceção sem que o enunciado forneça os requisitos dessa exceção. Qual tende a atender melhor ao comando?",o:["A exceção, porque é mais específica.","A regra geral, salvo se o enunciado trouxer os pressupostos que acionam a exceção.","Ambas obrigatoriamente estão corretas.","A opção com mais palavras."],a:1,e:"Uma exceção só deve prevalecer quando seus requisitos estão presentes. Sem eles, aplica-se a regra geral pertinente ao caso."},
      {q:"Ao revisar uma questão errada, qual ação produz informação mais útil para evitar repetição do erro?",o:["Registrar apenas a letra correta.","Identificar o ponto do conteúdo ou do comando que levou ao erro e revisar a regra correspondente.","Apagar a questão do histórico.","Memorizar a posição da alternativa correta."],a:1,e:"Classificar a causa do erro e voltar à regra permite corrigir a lacuna de conteúdo ou de leitura, em vez de apenas memorizar uma resposta."},
      {q:"Se uma questão pede 'a alternativa correta segundo a lei seca', qual fonte deve prevalecer na resolução?",o:["A redação normativa aplicável ao tema.","Uma opinião doutrinária que contrarie o texto legal.","Uma postagem sem referência.","Uma lembrança aproximada de outra prova."],a:0,e:"Quando o comando remete à lei seca, a redação normativa aplicável é o parâmetro principal de julgamento."},
      {q:"Uma alternativa mistura duas afirmações ligadas por 'e'. Para ser considerada integralmente correta, é necessário que:",o:["ao menos uma das duas afirmações seja verdadeira.","as duas afirmações sejam verdadeiras dentro das condições do enunciado.","a primeira seja verdadeira, independentemente da segunda.","a segunda seja mais específica que a primeira."],a:1,e:"A conjunção 'e' forma uma proposição conjuntiva: a alternativa completa só é verdadeira quando os dois componentes são verdadeiros."}
    ]
  };

  function shuffle(list){
    const a = list.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }

  function sig(item){
    let h=2166136261;
    const s=String(item.q||"");
    for(let i=0;i<s.length;i++){
      h ^= s.charCodeAt(i);
      h = Math.imul(h,16777619);
    }
    return (h>>>0).toString(36);
  }

  function loadSeen(key){
    try{
      const v=JSON.parse(localStorage.getItem(STORAGE_PREFIX+key)||"[]");
      return Array.isArray(v)?v:[];
    }catch(e){ return []; }
  }

  function saveSeen(key, seen){
    try{ localStorage.setItem(STORAGE_PREFIX+key, JSON.stringify(seen.slice(-180))); }catch(e){}
  }

  function isTooEasy(item){
    const q=String(item.q||"");
    const opts=Array.isArray(item.o)?item.o:[];
    const knownAmbiguous =
      q==="A regência verbal está correta em:" ||
      (q==="Assinale a alternativa correta." &&
       opts.includes("Assisti ao filme.") &&
       opts.includes("Aspirava ao cargo, no sentido de desejar."));
    return knownAmbiguous ||
           /^A palavra corretamente grafada é:/i.test(q) ||
           /^Um produto de R\$/i.test(q) ||
           /^Em um grupo de \d+ pessoas, \d+% faltaram/i.test(q) ||
           q.length < 38;
  }

  function freshPick(pool, count, key, seen){
    const unique = [];
    const used = new Set();
    pool.forEach(item=>{
      const id=sig(item);
      if(!used.has(id)){ used.add(id); unique.push(item); }
    });
    let candidates=unique.filter(item=>!seen.includes(sig(item)));
    if(candidates.length<count) candidates=unique.slice();
    const picked=shuffle(candidates).slice(0,Math.min(count,candidates.length));
    picked.forEach(item=>seen.push(sig(item)));
    return picked;
  }

  function shuffleOptions(item){
    const packed=item.o.map((label,index)=>({label,correct:index===item.a}));
    const mixed=shuffle(packed);
    return {
      q:item.q,
      o:mixed.map(x=>x.label),
      a:mixed.findIndex(x=>x.correct),
      e:item.e
    };
  }

  function buildRound(quizKey){
    const baseRaw=(typeof quizBank!=="undefined" && quizBank[quizKey]) ? quizBank[quizKey] : [];
    const hard=JR_HARD_BANK[quizKey]||[];
    const seen=loadSeen(quizKey);
    const hardPick=freshPick(hard, Math.min(HARD_PER_ROUND, hard.length), quizKey, seen);
    const preferred=baseRaw.filter(x=>!isTooEasy(x));
    const basePool=preferred.length >= (ROUND_SIZE-hardPick.length) ? preferred : baseRaw;
    const basePick=freshPick(basePool, ROUND_SIZE-hardPick.length, quizKey, seen);
    saveSeen(quizKey, seen);
    return shuffle(hardPick.concat(basePick)).map(shuffleOptions);
  }

  function updateIntro(subjectId){
    const box=document.getElementById("quiz-box-"+subjectId);
    const panel=box && box.closest(".quiz-panel");
    if(!panel) return;
    const head=panel.querySelector(".quiz-head span:last-child");
    if(head) head.textContent=ROUND_SIZE+" questões por rodada • renovação automática • nível IDECAN";
    const p=panel.querySelector(".quiz-intro p");
    if(p) p.textContent="Cada rodada combina questões em ordem diferente, prioriza itens mais exigentes e inclui desafios inéditos inspirados no estilo IDECAN, com correção imediata.";
  }

  window.startQuiz=function(subjectId, quizKey){
    const questions=buildRound(quizKey);
    if(!questions.length) return;
    quizState[subjectId]={index:0,score:0,answered:false,quizKey,questions};
    updateIntro(subjectId);
    document.getElementById("quiz-result-"+subjectId).classList.add("hidden");
    document.getElementById("quiz-box-"+subjectId).classList.remove("hidden");
    window.jrRenderQuestion(subjectId);
  };

  window.jrRenderQuestion=function(subjectId){
    const state=quizState[subjectId];
    const quiz=state.questions||[];
    const item=quiz[state.index];
    if(!item) return;
    document.getElementById("quiz-title-"+subjectId).textContent="Desafio • "+findSubjectTitle(subjectId)+" • estilo IDECAN";
    document.getElementById("quiz-progress-"+subjectId).textContent="Questão "+(state.index+1)+" de "+quiz.length;
    document.getElementById("quiz-bar-"+subjectId).style.width=(((state.index+1)/quiz.length)*100)+"%";
    document.getElementById("quiz-question-"+subjectId).textContent=item.q;
    const options=document.getElementById("quiz-options-"+subjectId);
    const feedback=document.getElementById("quiz-feedback-"+subjectId);
    const nextBtn=document.getElementById("quiz-next-"+subjectId);
    feedback.classList.add("hidden");
    feedback.innerHTML="";
    nextBtn.classList.add("hidden");
    options.innerHTML="";
    state.answered=false;
    item.o.forEach((label,idx)=>{
      const btn=document.createElement("button");
      btn.className="quiz-option";
      btn.textContent=String.fromCharCode(65+idx)+") "+label;
      btn.onclick=function(){ window.jrSelectQuizAnswer(subjectId,idx,btn); };
      options.appendChild(btn);
    });
  };

  window.jrSelectQuizAnswer=function(subjectId,selectedIndex,selectedButton){
    const state=quizState[subjectId];
    if(!state || state.answered) return;
    state.answered=true;
    const quiz=state.questions||[];
    const item=quiz[state.index];
    const options=document.querySelectorAll("#quiz-options-"+subjectId+" .quiz-option");
    const feedback=document.getElementById("quiz-feedback-"+subjectId);
    const nextBtn=document.getElementById("quiz-next-"+subjectId);
    options.forEach((btn,idx)=>{
      btn.disabled=true;
      if(idx===item.a) btn.classList.add("correct");
    });
    if(selectedIndex===item.a){
      state.score++;
      feedback.innerHTML="<strong>Resposta correta.</strong><br>"+item.e;
    }else{
      selectedButton.classList.add("wrong");
      feedback.innerHTML="<strong>Resposta incorreta.</strong><br>"+item.e;
    }
    feedback.classList.remove("hidden");
    nextBtn.classList.remove("hidden");
    nextBtn.textContent=state.index===quiz.length-1?"Ver resultado":"Próxima";
  };

  window.nextQuestion=function(subjectId){
    const state=quizState[subjectId];
    if(!state) return;
    const quiz=state.questions||[];
    if(state.index<quiz.length-1){
      state.index++;
      window.jrRenderQuestion(subjectId);
    }else{
      window.jrShowQuizResult(subjectId);
    }
  };

  window.jrShowQuizResult=function(subjectId){
    const state=quizState[subjectId];
    const quiz=state.questions||[];
    const total=quiz.length||1;
    const percent=Math.round((state.score/total)*100);
    document.getElementById("quiz-box-"+subjectId).classList.add("hidden");
    const result=document.getElementById("quiz-result-"+subjectId);
    result.classList.remove("hidden");
    let performance=percent>=85
      ?"Excelente desempenho nesta rodada de nível elevado."
      : percent>=65
        ?"Bom desempenho. Revise os erros e faça uma nova rodada, que virá com outra combinação."
        :"Revise os pontos errados e tente uma nova rodada; as questões serão reorganizadas.";
    result.innerHTML=
      "<h4>Resultado da rodada</h4>"+
      "<p>Você acertou <strong>"+state.score+" de "+total+"</strong> questões em <strong>"+findSubjectTitle(subjectId)+"</strong>.</p>"+
      "<p>Aproveitamento: <strong>"+percent+"%</strong>. "+performance+"</p>"+
      '<div class="quiz-actions">'+
      '<button class="btn btn-primary btn-small" onclick="startQuiz(\''+subjectId+'\',\''+state.quizKey+'\')">Nova rodada</button>'+
      '<button class="btn btn-outline btn-small" onclick="closeQuiz(\''+subjectId+'\')">Fechar</button>'+
      "</div>";
  };

  function refreshVisibleCopy(){
    document.querySelectorAll(".quiz-panel").forEach(panel=>{
      const box=panel.querySelector('[id^="quiz-box-"]');
      if(box) updateIntro(box.id.replace("quiz-box-",""));
    });
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",refreshVisibleCopy,{once:true});
  else refreshVisibleCopy();
})();