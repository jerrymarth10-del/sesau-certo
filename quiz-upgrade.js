(function(){
  "use strict";

  const ROUND_SIZE = 12;
  const HARD_PER_ROUND = 12;
  const AUTO_NEXT_MS = 6500;
  const STORAGE_PREFIX = "jr_quiz_rotation_v5_";
  const SUBJECT_QUIZ_KEY = Object.freeze({
    portugues:"portugues",
    rlm:"rlm",
    informatica:"informatica",
    sus:"sus",
    rondonia:"rondonia",
    idecan:"idecan"
  });

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

  const JR_HARD_EXTRA = {"portugues":[{"q":"Assinale a alternativa em que a concordância com o pronome apassivador 'se' está correta.","o":["Publicou-se os resultados finais.","Publicaram-se os resultados finais.","Precisam-se de técnicos experientes.","Tratam-se de recursos administrativos."],"a":1,"e":"Em 'publicaram-se os resultados', 'se' é pronome apassivador e o verbo concorda com o sujeito paciente 'os resultados'. Em 'precisa-se de' e 'trata-se de', o sujeito é indeterminado e o verbo fica no singular."},{"q":"Assinale a alternativa correta quanto ao emprego do pronome relativo.","o":["O candidato cujo o recurso foi deferido tomou posse.","O candidato cujo recurso foi deferido tomou posse.","O candidato que cujo recurso foi deferido tomou posse.","O candidato cujo do recurso foi deferido tomou posse."],"a":1,"e":"O pronome relativo 'cujo' indica posse e concorda com o termo possuído; não admite artigo imediatamente depois dele: 'cujo recurso'."},{"q":"Assinale a frase correta quanto ao emprego de 'onde' e 'aonde'.","o":["Aonde fica a sede da banca?","Onde você pretende chegar com esse recurso?","Aonde você pretende chegar com esse recurso?","Onde você vai, após a prova?"],"a":2,"e":"Com verbo que expressa movimento e rege a preposição 'a', usa-se 'aonde': 'aonde pretende chegar'. Para permanência/localização, usa-se 'onde'."},{"q":"Assinale a alternativa correta quanto ao emprego de 'há' e 'a'.","o":["O edital foi publicado há três dias, e a prova ocorrerá daqui há dois meses.","O edital foi publicado a três dias, e a prova ocorrerá daqui a dois meses.","O edital foi publicado há três dias, e a prova ocorrerá daqui a dois meses.","O edital foi publicado a três dias, e a prova ocorrerá daqui há dois meses."],"a":2,"e":"Para tempo decorrido, emprega-se 'há'; para tempo futuro, usa-se 'a': 'há três dias' e 'daqui a dois meses'."},{"q":"Assinale a alternativa em que os quatro empregos de por que/porque/por quê/porquê estão corretos.","o":["Não sei por que ele faltou; faltou porque adoeceu; você sabe por quê?; explicou o porquê da ausência.","Não sei porque ele faltou; faltou por que adoeceu; você sabe porquê?; explicou o por quê da ausência.","Não sei por quê ele faltou; faltou porquê adoeceu; você sabe porque?; explicou o por que da ausência.","Não sei por que ele faltou; faltou por quê adoeceu; você sabe por que?; explicou o porque da ausência."],"a":0,"e":"Em pergunta indireta usa-se 'por que'; em causa, 'porque'; no fim de pergunta, 'por quê'; como substantivo, 'o porquê'."},{"q":"Assinale a alternativa com a forma verbal correta.","o":["Se os fiscais intervissem antes, o problema seria evitado.","Se os fiscais interviessem antes, o problema seria evitado.","Se os fiscais intervessem antes, o problema seria evitado.","Se os fiscais intervíssem antes, o problema seria evitado."],"a":1,"e":"O verbo 'intervir' conjuga-se como 'vir': se eles viessem → se eles interviessem."},{"q":"Assinale a alternativa correta quanto à regência do verbo 'preferir'.","o":["Prefiro revisar mais do que improvisar.","Prefiro mais revisar a improvisar.","Prefiro revisar a improvisar.","Prefiro revisar do que improvisar."],"a":2,"e":"Na norma-padrão tradicional, 'preferir' estabelece relação entre dois termos com a preposição 'a': 'prefiro X a Y', sem 'mais'."},{"q":"Assinale a alternativa em que a crase decorre de locução conjuntiva feminina.","o":["À medida que revisava, o candidato identificava mais erros.","Entregou o recurso à diretora.","Referiu-se àquela norma.","Saiu às pressas."],"a":0,"e":"Em 'à medida que', a crase integra uma locução conjuntiva feminina. As demais ocorrências têm outras justificativas gramaticais."},{"q":"Na frase 'Embora o prazo fosse curto, a equipe concluiu a análise', a conjunção destacada introduz ideia de:","o":["causa","concessão","conclusão","condição"],"a":1,"e":"'Embora' introduz oração concessiva: apresenta um fato que poderia dificultar, mas não impede o resultado expresso na oração principal."},{"q":"Assinale a alternativa em que a vírgula isola corretamente um adjunto adverbial deslocado sem separar sujeito e verbo.","o":["Os candidatos, amanhã farão a prova.","Amanhã, os candidatos farão a prova.","Os candidatos farão, amanhã a prova.","Os, candidatos amanhã farão a prova."],"a":1,"e":"O adjunto adverbial deslocado 'Amanhã' pode ser isolado por vírgula; não se deve separar sujeito e predicado."},{"q":"Em 'Precisa-se de profissionais com experiência', o 'se' exerce a função de:","o":["pronome apassivador, e o verbo deveria ir ao plural.","índice de indeterminação do sujeito, e o verbo permanece no singular.","pronome reflexivo.","conjunção integrante."],"a":1,"e":"O verbo 'precisar', no sentido de necessitar, rege a preposição 'de'; com verbo transitivo indireto, 'se' indetermina o sujeito e o verbo fica na 3ª pessoa do singular."},{"q":"Assinale a frase correta quanto à regência de 'implicar' no sentido de acarretar.","o":["A mudança implicará em novos custos.","A mudança implicará novos custos.","A mudança implicará com novos custos.","A mudança implicará de novos custos."],"a":1,"e":"No sentido de acarretar, 'implicar' é tradicionalmente empregado como verbo transitivo direto: 'implicará novos custos'."},{"q":"Na frase 'O servidor entregou-lhe o relatório', o pronome 'lhe' exerce função de:","o":["objeto direto","objeto indireto","predicativo do sujeito","adjunto adverbial"],"a":1,"e":"O verbo 'entregar' admite objeto direto para a coisa entregue e objeto indireto para o destinatário; 'lhe' equivale a 'a ele/a ela'."},{"q":"Assinale a alternativa que expressa concordância de ideias, e não oposição.","o":["A medida veio de encontro ao regulamento.","A medida veio ao encontro do regulamento.","A medida foi de encontro com o regulamento.","A medida foi ao encontro contra o regulamento."],"a":1,"e":"'Ao encontro de' indica aproximação ou concordância; 'de encontro a' indica choque ou oposição."},{"q":"Assinale a alternativa correta quanto à concordância nominal.","o":["Seguem anexo as cópias solicitadas.","Seguem anexos as cópias solicitadas.","Seguem anexas as cópias solicitadas.","Segue anexas as cópias solicitadas."],"a":2,"e":"O adjetivo 'anexas' concorda em gênero e número com 'cópias': 'Seguem anexas as cópias'."},{"q":"A reescrita que preserva o sentido de 'Mesmo que o candidato estude muito, poderá errar questões por desatenção' é:","o":["Porque o candidato estuda muito, não poderá errar.","Embora o candidato estude muito, poderá errar questões por desatenção.","Se o candidato estuda muito, necessariamente errará.","Como o candidato estuda muito, jamais errará."],"a":1,"e":"'Mesmo que' e 'embora' introduzem valor concessivo: reconhecem uma circunstância sem transformá-la em impedimento absoluto."}],"rlm":[{"q":"A negação lógica de 'João estuda Português e Maria estuda Raciocínio Lógico' é:","o":["João não estuda Português e Maria não estuda Raciocínio Lógico.","João não estuda Português ou Maria não estuda Raciocínio Lógico.","João estuda Português ou Maria estuda Raciocínio Lógico.","Se João não estuda Português, então Maria não estuda Raciocínio Lógico."],"a":1,"e":"Pela lei de De Morgan, a negação de P∧Q é ¬P∨¬Q."},{"q":"A proposição bicondicional 'P se e somente se Q' é verdadeira quando:","o":["P e Q possuem valores lógicos diferentes.","P é verdadeira, independentemente de Q.","P e Q possuem o mesmo valor lógico.","Q é falsa, independentemente de P."],"a":2,"e":"A bicondicional P↔Q é verdadeira exatamente quando P e Q são ambas verdadeiras ou ambas falsas."},{"q":"Uma urna contém 5 bolas vermelhas e 3 azuis. Retiram-se duas bolas, sem reposição. A probabilidade de ambas serem vermelhas é:","o":["5/14","5/16","10/21","25/64"],"a":0,"e":"A probabilidade é (5/8)×(4/7)=20/56=5/14."},{"q":"De 8 candidatos, serão escolhidos 3 para formar uma comissão, sem distinção de cargos. Quantas comissões diferentes podem ser formadas?","o":["24","48","56","336"],"a":2,"e":"Como a ordem não importa, usa-se combinação: C(8,3)=8×7×6/(3×2×1)=56."},{"q":"Quantos anagramas distintos podem ser formados com todas as letras da palavra BANANA?","o":["30","60","120","720"],"a":1,"e":"BANANA tem 6 letras, com A repetido 3 vezes e N repetido 2 vezes. Logo, 6!/(3!×2!)=60."},{"q":"Uma pessoa executa um serviço sozinha em 12 dias e outra, sozinha, em 18 dias. Trabalhando juntas, com ritmos constantes, concluem o serviço em:","o":["6 dias","7,2 dias","8 dias","15 dias"],"a":1,"e":"A taxa conjunta é 1/12+1/18=5/36 do serviço por dia. O tempo é 36/5=7,2 dias."},{"q":"Em uma progressão aritmética, a1=7 e razão r=5. O 20º termo é:","o":["97","102","107","112"],"a":1,"e":"a20=7+(20−1)×5=7+95=102."},{"q":"Na mesma PA em que a1=7, r=5 e a20=102, a soma dos 20 primeiros termos é:","o":["990","1.040","1.090","1.140"],"a":2,"e":"S20=20×(7+102)/2=10×109=1.090."},{"q":"Na progressão geométrica 3, 6, 12, 24, ... o 8º termo é:","o":["192","256","384","768"],"a":2,"e":"A razão é 2. Assim, a8=3×2^7=3×128=384."},{"q":"Um preço sofre desconto de 15% e, depois, aumento de 20% sobre o valor já descontado. Em relação ao preço inicial, o valor final representa:","o":["redução de 5%","redução de 2%","aumento de 2%","aumento de 5%"],"a":2,"e":"O fator total é 0,85×1,20=1,02. Portanto, o valor final é 2% maior."},{"q":"Um aluno obteve notas 6, 8 e 9 com pesos 2, 3 e 5, respectivamente. A média ponderada é:","o":["7,8","8,0","8,1","8,3"],"a":2,"e":"(6×2+8×3+9×5)/(2+3+5)=(12+24+45)/10=81/10=8,1."},{"q":"O sistema x+y=17 e x−y=5 possui solução:","o":["x=6 e y=11","x=10 e y=7","x=11 e y=6","x=12 e y=5"],"a":2,"e":"Somando as equações: 2x=22, então x=11; substituindo, y=6."},{"q":"Em um grupo de 200 pessoas, 120 estudam Português, 90 estudam RLM e 50 estudam ambas. Quantas não estudam nenhuma das duas matérias?","o":["30","40","50","60"],"a":1,"e":"Ao menos uma: 120+90−50=160. Nenhuma: 200−160=40."},{"q":"Considere: 'Se A, então B' e 'Se B, então C'. Sabendo que C é falsa, qual conclusão é necessariamente válida?","o":["A é verdadeira.","B é verdadeira.","A é falsa.","Nada pode ser concluído sobre A."],"a":2,"e":"De ¬C e B→C, conclui-se ¬B; de ¬B e A→B, conclui-se ¬A, pelas contrapositivas."},{"q":"Em quantas linhas da tabela-verdade de duas proposições P e Q a fórmula (P ou Q) → P é falsa?","o":["0","1","2","3"],"a":1,"e":"Uma implicação é falsa apenas quando o antecedente é verdadeiro e o consequente é falso. Isso ocorre somente em P=falsa e Q=verdadeira."},{"q":"Quatro máquinas idênticas produzem 600 peças em 5 horas. Mantido o mesmo ritmo, 6 máquinas produzirão em 8 horas:","o":["960 peças","1.200 peças","1.440 peças","1.600 peças"],"a":2,"e":"A produção é diretamente proporcional ao número de máquinas e ao tempo: 600×(6/4)×(8/5)=1.440."}],"informatica":[{"q":"Após um backup completo no domingo, são feitos backups diferenciais na segunda, terça e quarta. O backup diferencial de quarta contém:","o":["apenas as alterações desde terça.","apenas as alterações desde o último backup, qualquer que seja o tipo.","todas as alterações desde o backup completo de domingo.","uma cópia completa de todos os dados, sem relação com o domingo."],"a":2,"e":"O backup diferencial acumula todas as alterações ocorridas desde o último backup completo."},{"q":"Em uma assinatura digital baseada em criptografia assimétrica, o signatário normalmente:","o":["assina com a chave privada e a verificação é feita com a chave pública correspondente.","assina com a chave pública e a verificação exige a mesma chave pública secreta.","assina com uma chave simétrica compartilhada com todos.","garante confidencialidade automática de todo o documento apenas por assinar."],"a":0,"e":"Na assinatura digital, a chave privada é usada para assinar e a chave pública correspondente permite verificar autenticidade e integridade."},{"q":"Comparando criptografia simétrica e assimétrica, assinale a alternativa correta.","o":["A simétrica usa um par público/privado e é sempre mais lenta.","A assimétrica usa uma única chave secreta compartilhada.","A simétrica usa a mesma chave para cifrar e decifrar, enquanto a assimétrica utiliza um par de chaves relacionado.","Ambas exigem obrigatoriamente a divulgação da chave privada."],"a":2,"e":"Na criptografia simétrica, a mesma chave secreta é usada nos dois sentidos; na assimétrica, há um par de chaves pública e privada."},{"q":"O serviço DNS é responsável principalmente por:","o":["atribuir endereços IP dinamicamente aos hosts.","traduzir nomes de domínio em informações de endereçamento, como endereços IP.","criptografar automaticamente arquivos locais.","substituir o protocolo HTTP."],"a":1,"e":"DNS resolve nomes de domínio para registros, entre eles endereços IP."},{"q":"Em uma rede local, o DHCP é tipicamente utilizado para:","o":["resolver nomes de domínio.","distribuir automaticamente parâmetros de rede, como endereço IP, gateway e DNS.","assinar digitalmente mensagens.","filtrar pacotes com base em regras de firewall."],"a":1,"e":"DHCP automatiza a concessão de configuração de rede aos clientes."},{"q":"Assinale a alternativa correta sobre TCP e UDP.","o":["TCP é orientado a conexão e fornece mecanismos de entrega confiável; UDP é não orientado a conexão e não garante entrega.","UDP garante entrega e ordenação por padrão; TCP não.","TCP funciona apenas em redes locais; UDP apenas na internet.","Ambos exigem o mesmo estabelecimento formal de conexão antes de transmitir."],"a":0,"e":"TCP implementa conexão, confirmação, ordenação e retransmissão; UDP é mais simples e não garante entrega ou ordem por si só."},{"q":"Cookies de navegador podem ser utilizados legitimamente para:","o":["manter informações de sessão e preferências entre requisições.","eliminar a necessidade de autenticação em qualquer sistema.","substituir antivírus e firewall.","criptografar todo o disco do usuário."],"a":0,"e":"Cookies armazenam pequenos dados associados a sites e são frequentemente usados para sessão, preferências e rastreamento."},{"q":"O modo de navegação privada/anônima do navegador:","o":["torna o usuário invisível ao provedor de internet e ao administrador da rede.","impede que o site visitado identifique o endereço IP.","reduz o armazenamento local de histórico e cookies após a sessão, mas não torna a navegação anônima para a rede ou os sites.","substitui uma VPN e criptografa todo o tráfego do dispositivo."],"a":2,"e":"O modo privado limita principalmente rastros locais no navegador; não oculta, por si só, o tráfego de provedores, redes ou sites."},{"q":"A função principal de um firewall é:","o":["filtrar tráfego de rede conforme regras de segurança.","recuperar automaticamente arquivos apagados.","gerar cópias de backup completas.","corrigir vulnerabilidades de software sem atualização."],"a":0,"e":"Firewall controla fluxos de rede conforme políticas e regras, permitindo ou bloqueando tráfego."},{"q":"Qual característica diferencia tipicamente um worm de um vírus de arquivo?","o":["O worm pode se propagar automaticamente por redes sem precisar se anexar a um arquivo hospedeiro.","O worm nunca utiliza rede.","O vírus sempre se replica sem qualquer arquivo hospedeiro.","Não existe diferença técnica entre os dois termos."],"a":0,"e":"Worms são programas autorreplicantes capazes de se disseminar, frequentemente pela rede, sem depender de anexação a um arquivo hospedeiro."},{"q":"Spear phishing é melhor definido como:","o":["phishing direcionado a uma pessoa ou grupo específico, com conteúdo personalizado.","qualquer atualização automática de antivírus.","um tipo de backup incremental.","uma técnica de compactação de arquivos."],"a":0,"e":"Spear phishing é uma forma direcionada de phishing, normalmente construída com informações sobre o alvo."},{"q":"Uma vulnerabilidade 'zero-day' é, em essência:","o":["uma falha conhecida e necessariamente corrigida há anos.","uma vulnerabilidade explorável para a qual ainda pode não haver correção disponível ou conhecimento amplo suficiente no momento da exploração.","um antivírus instalado no primeiro dia de uso.","uma senha expirada há zero dias."],"a":1,"e":"O termo zero-day é usado para vulnerabilidades/explorações novas, especialmente quando a defesa ou correção ainda não está disponível ou disseminada."},{"q":"Ransomware é um malware caracterizado principalmente por:","o":["exibir apenas publicidade legítima.","bloquear ou cifrar dados/sistemas e exigir pagamento ou vantagem para liberação.","otimizar o sistema operacional.","sincronizar arquivos com a nuvem de forma segura."],"a":1,"e":"Ransomware busca extorquir a vítima, frequentemente cifrando dados ou bloqueando sistemas."},{"q":"Em computação em nuvem, qual associação está correta?","o":["SaaS: uso de aplicação pronta; PaaS: ambiente para desenvolver/executar aplicações; IaaS: recursos de infraestrutura virtualizados.","SaaS: apenas hardware; PaaS: apenas e-mail; IaaS: apenas navegador.","SaaS e IaaS são sinônimos e PaaS é um protocolo de rede.","PaaS fornece somente antivírus local."],"a":0,"e":"SaaS entrega software como serviço, PaaS oferece plataforma de desenvolvimento/execução e IaaS fornece infraestrutura computacional virtualizada."},{"q":"Em um modelo de controle de acesso baseado em papéis (RBAC), permissões são atribuídas principalmente:","o":["diretamente ao endereço IP de cada usuário.","a papéis/funções, aos quais os usuários são associados.","ao acaso em cada login.","apenas ao fabricante do sistema."],"a":1,"e":"RBAC organiza permissões por papéis, facilitando administração e aplicação do princípio do menor privilégio."},{"q":"Em continuidade de negócios, RPO e RTO representam, respectivamente:","o":["tempo máximo para detectar malware e tempo de troca de senha.","perda máxima de dados tolerável medida em tempo e tempo-alvo para restaurar o serviço.","quantidade de cópias e quantidade de servidores.","nível de criptografia e tamanho da chave."],"a":1,"e":"RPO indica quanto de dados, em termos de tempo, pode ser perdido; RTO indica o tempo-alvo para recuperar o serviço após uma interrupção."}],"sus":[{"q":"Segundo o art. 198 da Constituição Federal, as ações e serviços públicos de saúde integram uma rede regionalizada e hierarquizada, organizada com base em quais diretrizes?","o":["centralização, atendimento curativo exclusivo e participação privada obrigatória.","descentralização com direção única em cada esfera, atendimento integral com prioridade preventiva sem prejuízo da assistência e participação da comunidade.","municipalização exclusiva, atendimento hospitalar e ausência de controle social.","direção única federal, prioridade assistencial e participação empresarial."],"a":1,"e":"O art. 198 prevê descentralização com direção única em cada esfera, atendimento integral com prioridade para atividades preventivas sem prejuízo das assistenciais e participação da comunidade."},{"q":"Entre os objetivos do SUS previstos na Lei nº 8.080/1990 está:","o":["identificar e divulgar fatores condicionantes e determinantes da saúde, formular política de saúde e prestar assistência por ações integradas de promoção, proteção e recuperação.","atuar exclusivamente em assistência hospitalar.","substituir integralmente políticas de saneamento e educação.","limitar-se à fiscalização de planos privados."],"a":0,"e":"O art. 5º da Lei 8.080/1990 reúne esses três grandes objetivos: conhecimento dos determinantes, formulação de política e assistência integrada."},{"q":"A vigilância sanitária, segundo a Lei nº 8.080/1990, compreende ações capazes de:","o":["eliminar, diminuir ou prevenir riscos à saúde e intervir nos problemas sanitários decorrentes do meio ambiente, produção/circulação de bens e prestação de serviços de interesse da saúde.","atuar apenas em epidemias transmissíveis.","fiscalizar exclusivamente hospitais públicos.","controlar somente fronteiras internacionais."],"a":0,"e":"A definição legal de vigilância sanitária abrange prevenção de riscos e intervenção em problemas sanitários ligados ao ambiente, bens e serviços relacionados à saúde."},{"q":"A saúde do trabalhador integra o campo de atuação do SUS e envolve, entre outras medidas:","o":["ações de promoção, proteção, recuperação e reabilitação da saúde dos trabalhadores submetidos a riscos e agravos decorrentes das condições de trabalho.","somente concessão previdenciária de aposentadoria.","apenas fiscalização tributária de empresas.","exclusivamente perícia judicial."],"a":0,"e":"A Lei 8.080/1990 inclui saúde do trabalhador como conjunto de atividades destinadas à promoção, proteção, recuperação e reabilitação diante de riscos e agravos do trabalho."},{"q":"O princípio da integralidade da assistência no SUS é melhor representado por:","o":["oferta articulada e contínua de ações preventivas e curativas, individuais e coletivas, exigidas para cada caso em todos os níveis de complexidade.","prioridade absoluta ao tratamento curativo, excluindo prevenção.","atendimento somente hospitalar.","separação obrigatória entre promoção, prevenção e tratamento."],"a":0,"e":"A integralidade combina ações preventivas e curativas, individuais e coletivas, conforme a necessidade, em todos os níveis de complexidade."},{"q":"A utilização da epidemiologia, como princípio/diretriz operacional do SUS na Lei nº 8.080/1990, serve para:","o":["estabelecer prioridades, alocar recursos e orientar programas.","substituir toda decisão clínica individual.","definir exclusivamente salários de servidores.","impedir a regionalização."],"a":0,"e":"A Lei 8.080/1990 prevê o uso da epidemiologia para estabelecer prioridades, alocar recursos e orientar programas."},{"q":"A direção do SUS é única em cada esfera de governo. No âmbito da União, dos Estados e dos Municípios, essa direção é exercida, respectivamente, por:","o":["Ministério da Saúde, Secretaria de Saúde ou órgão equivalente estadual, e Secretaria de Saúde ou órgão equivalente municipal.","Congresso Nacional, Assembleias Legislativas e Câmaras Municipais.","Conselho Nacional de Saúde, hospitais universitários e unidades básicas.","Ministério da Justiça, governadores e prefeitos."],"a":0,"e":"A Lei 8.080/1990 atribui a direção do SUS ao Ministério da Saúde na União e às respectivas Secretarias de Saúde ou órgãos equivalentes nos Estados e Municípios."},{"q":"Quanto à organização intermunicipal, a Lei nº 8.080/1990 permite que municípios:","o":["constituam consórcios para desenvolver em conjunto ações e serviços de saúde que lhes correspondam.","transfiram obrigatoriamente toda gestão à União.","eliminem a direção municipal do SUS ao formar consórcio.","privatizem automaticamente os serviços consorciados."],"a":0,"e":"A lei admite consórcios intermunicipais para desenvolver conjuntamente ações e serviços de saúde."},{"q":"Na participação complementar da iniciativa privada no SUS, a Constituição e a legislação dão preferência, em igualdade de condições, a:","o":["entidades filantrópicas e sem fins lucrativos.","empresas estrangeiras exclusivamente.","qualquer empresa com maior preço.","instituições sem vínculo contratual."],"a":0,"e":"A participação complementar ocorre mediante contrato ou convênio, com preferência para entidades filantrópicas e sem fins lucrativos."},{"q":"Para receber recursos do Fundo Nacional de Saúde nos termos do art. 4º da Lei nº 8.142/1990, Estados e Municípios devem contar, entre outros requisitos, com:","o":["Fundo de Saúde, Conselho de Saúde, plano de saúde, relatórios de gestão, contrapartida de recursos e comissão de elaboração do PCCS.","apenas hospital próprio e concurso anual.","somente Conselho de Saúde e prefeito eleito.","exclusivamente autorização judicial."],"a":0,"e":"O art. 4º da Lei 8.142/1990 enumera esses requisitos institucionais e de planejamento/controle para o recebimento dos recursos previstos na lei."},{"q":"A Conferência de Saúde, além de reunir-se ordinariamente a cada quatro anos, pode ser convocada extraordinariamente por:","o":["Poder Executivo ou Conselho de Saúde.","somente Congresso Nacional.","apenas Tribunal de Contas.","exclusivamente entidades privadas."],"a":0,"e":"A Lei 8.142/1990 permite convocação extraordinária pelo Poder Executivo ou pelo Conselho de Saúde."},{"q":"A paridade da representação dos usuários nos Conselhos e Conferências de Saúde significa que os usuários devem ter representação:","o":["equivalente ao conjunto dos demais segmentos.","inferior à dos gestores.","igual apenas à dos prestadores privados.","definida caso a caso sem regra legal."],"a":0,"e":"A Lei 8.142/1990 estabelece representação dos usuários paritária em relação ao conjunto dos demais segmentos."},{"q":"O princípio do SUS referente à 'preservação da autonomia das pessoas na defesa de sua integridade física e moral' traduz:","o":["respeito à autonomia do usuário.","centralização administrativa.","seletividade econômica.","prioridade exclusiva ao atendimento privado."],"a":0,"e":"A Lei 8.080/1990 inclui expressamente a preservação da autonomia das pessoas na defesa de sua integridade física e moral."},{"q":"A 'igualdade da assistência à saúde, sem preconceitos ou privilégios de qualquer espécie' corresponde a princípio expresso da Lei nº 8.080/1990. Isso significa que:","o":["o acesso não pode ser discriminado por características pessoais ou sociais.","todo usuário deve receber exatamente o mesmo procedimento, independentemente da necessidade.","somente contribuintes têm acesso.","a assistência pode privilegiar grupos por renda."],"a":0,"e":"Igualdade veda preconceitos e privilégios; isso não elimina a consideração das necessidades distintas na organização do cuidado."},{"q":"Integra o campo de atuação do SUS, nos termos da Lei nº 8.080/1990:","o":["a fiscalização e inspeção de alimentos, água e bebidas para consumo humano.","a edição de sentenças judiciais.","a cobrança de tributos federais.","a administração exclusiva da previdência social."],"a":0,"e":"A Lei 8.080/1990 inclui vigilância nutricional, fiscalização e inspeção de alimentos, água e bebidas, entre outras competências."},{"q":"A assistência terapêutica integral prevista no SUS inclui:","o":["assistência farmacêutica, conforme a legislação e os protocolos aplicáveis.","somente internação hospitalar.","apenas procedimentos cirúrgicos.","exclusivamente ações de vigilância sanitária."],"a":0,"e":"A assistência terapêutica integral no SUS abrange também a assistência farmacêutica, nos termos legais."}],"rondonia":[{"q":"Rondônia possui fronteira internacional com qual país e limites interestaduais com quais unidades da Federação?","o":["Bolívia; Acre, Amazonas e Mato Grosso.","Peru; Acre, Pará e Mato Grosso.","Bolívia; Amazonas, Pará e Goiás.","Peru; Acre, Amazonas e Mato Grosso do Sul."],"a":0,"e":"Rondônia faz fronteira internacional com a Bolívia e limita-se, no Brasil, com Acre, Amazonas e Mato Grosso."},{"q":"Assinale o conjunto formado apenas por rios de grande relevância para a hidrografia de Rondônia.","o":["Madeira, Mamoré, Guaporé e Ji-Paraná (Machado).","São Francisco, Paraná, Tietê e Guaporé.","Tocantins, Araguaia, Iguaçu e Madeira.","Parnaíba, Negro, Doce e Mamoré."],"a":0,"e":"Madeira, Mamoré, Guaporé e Ji-Paraná/Machado são rios centrais da rede hidrográfica rondoniense."},{"q":"Segundo registros históricos oficiais do Estado, os primeiros municípios de Rondônia foram:","o":["Porto Velho e Guajará-Mirim.","Ji-Paraná e Cacoal.","Ariquemes e Vilhena.","Rolim de Moura e Pimenta Bueno."],"a":0,"e":"Porto Velho e Guajará-Mirim constituem os primeiros municípios da atual Rondônia, ligados à região histórica da Madeira-Mamoré."},{"q":"O primeiro governador do Território Federal do Guaporé, no período inicial após sua criação, foi:","o":["Jorge Teixeira de Oliveira.","Aluízio Pinheiro Ferreira.","Cândido Rondon.","Paulo Nunes Leal."],"a":1,"e":"Aluízio Pinheiro Ferreira foi o primeiro governador do Território Federal do Guaporé, entre 1943 e 1946."},{"q":"O Tratado de Petrópolis, firmado em 1903 entre Brasil e Bolívia, relaciona-se à história regional porque:","o":["integrou a solução da questão do Acre e previu compromisso brasileiro de construir ligação ferroviária na região do Madeira-Mamoré.","criou diretamente o Estado de Rondônia.","renomeou o Território do Guaporé.","determinou a abertura da BR-364."],"a":0,"e":"O Tratado de Petrópolis solucionou a questão acreana e incluiu compromisso brasileiro ligado à construção da ferrovia Madeira-Mamoré para facilitar o escoamento boliviano."},{"q":"A Estrada de Ferro Madeira-Mamoré ligava principalmente:","o":["Porto Velho a Guajará-Mirim.","Porto Velho a Ji-Paraná.","Guajará-Mirim a Vilhena.","Ariquemes a Cacoal."],"a":0,"e":"A ferrovia ligava Porto Velho a Guajará-Mirim, contornando trechos encachoeirados dos rios Madeira e Mamoré."},{"q":"A atuação de Cândido Mariano da Silva Rondon na região amazônica esteve fortemente associada:","o":["à implantação e inspeção de linhas telegráficas e expedições de integração do interior.","à construção da Usina de Itaipu.","à fundação de Brasília.","à criação do Mercosul."],"a":0,"e":"Rondon liderou trabalhos de linhas telegráficas e expedições de reconhecimento e integração no interior brasileiro, deixando forte marca na história regional."},{"q":"A atual BR-364, eixo decisivo da integração terrestre de Rondônia, teve antecedente histórico denominado:","o":["BR-29.","BR-101.","BR-230.","BR-319."],"a":0,"e":"A rodovia aberta como BR-29 passou posteriormente a integrar a BR-364, fundamental para migração e colonização."},{"q":"Sobre a formação do rio Madeira, assinale a alternativa correta.","o":["Forma-se da confluência dos rios Mamoré e Beni.","Nasce diretamente no território de Rondônia e não recebe rios internacionais.","Forma-se da confluência dos rios Guaporé e Ji-Paraná.","É afluente do rio Guaporé."],"a":0,"e":"O rio Madeira forma-se a partir da confluência dos rios Mamoré e Beni, integrando um sistema hidrográfico internacional da bacia Amazônica."},{"q":"Quanto à rede hidrográfica rondoniense, assinale a relação correta.","o":["O rio Ji-Paraná, também chamado Machado, integra a bacia do Madeira.","O rio Guaporé pertence à bacia do Paraná.","O rio Mamoré deságua diretamente no oceano Atlântico sem integrar o Madeira.","O rio Madeira não pertence à bacia Amazônica."],"a":0,"e":"O Ji-Paraná ou Machado é um importante curso d'água de Rondônia e integra o sistema hidrográfico do rio Madeira, pertencente à bacia Amazônica."},{"q":"Sobre o processo de ocupação de Rondônia nas décadas de 1960 e 1970, assinale a alternativa correta.","o":["Foi fortemente influenciado pela abertura rodoviária e por projetos de colonização agrícola, que atraíram migrantes de várias regiões do país.","Foi marcado pelo fechamento das vias terrestres e redução da migração.","Ocorreu apenas por migração internacional boliviana.","Não teve relação com a expansão da fronteira agrícola."],"a":0,"e":"A abertura da BR-364 e os projetos de colonização intensificaram a migração interna e a ocupação agrícola em Rondônia."},{"q":"O ciclo da borracha e a construção da Madeira-Mamoré são relevantes para a formação histórica regional porque:","o":["estimularam circulação de pessoas, trabalho, comércio e núcleos urbanos na região do Madeira-Mamoré.","eliminaram a navegação fluvial da Amazônia.","ocorreram somente depois da criação do Estado em 1981.","não tiveram relação com Porto Velho e Guajará-Mirim."],"a":0,"e":"A economia da borracha e a ferrovia contribuíram para a ocupação e consolidação de núcleos urbanos e atividades econômicas na região."},{"q":"A denominação 'Rondônia', adotada para o antigo Território Federal do Guaporé em 1956, homenageia um personagem ligado especialmente:","o":["às expedições e linhas telegráficas no interior do Brasil.","à mineração de ouro em Minas Gerais.","à industrialização paulista.","à diplomacia da Guerra do Paraguai."],"a":0,"e":"O nome homenageia o marechal Cândido Rondon, conhecido por trabalhos telegráficos e expedições no interior."},{"q":"Assinale a alternativa que ordena corretamente quatro marcos da história político-administrativa de Rondônia.","o":["Tratado de Petrópolis (1903) → Território Federal do Guaporé (1943) → nome Rondônia (1956) → Estado (1981).","Território Federal do Guaporé (1943) → Tratado de Petrópolis (1903) → Estado (1956) → nome Rondônia (1981).","Estado (1943) → Tratado de Petrópolis (1956) → Território do Guaporé (1981) → nome Rondônia (1982).","Nome Rondônia (1903) → Estado (1943) → Território do Guaporé (1956) → Tratado de Petrópolis (1981)."],"a":0,"e":"A sequência cronológica correta é 1903, 1943, 1956 e 1981."},{"q":"A bacia hidrográfica dominante em Rondônia integra o grande sistema:","o":["Amazônico.","do Paraná.","do São Francisco.","do Uruguai."],"a":0,"e":"Os principais rios de Rondônia, como Madeira, Mamoré, Guaporé e Ji-Paraná, integram o sistema hidrográfico amazônico."},{"q":"Sobre o rio Guaporé no contexto geográfico de Rondônia, assinale a alternativa correta.","o":["Integra o sistema Guaporé–Mamoré–Madeira e participa de trechos da fronteira entre Brasil e Bolívia.","É um rio exclusivamente costeiro e deságua diretamente no Atlântico.","Pertence ao sistema do rio Paraná e não se relaciona com o Mamoré.","Corre integralmente fora do território rondoniense."],"a":0,"e":"O Guaporé integra o sistema que se conecta ao Mamoré e ao Madeira e possui importante papel na fronteira Brasil–Bolívia."}]};
  Object.keys(JR_HARD_EXTRA).forEach(function(key){
    if(!JR_HARD_BANK[key]) JR_HARD_BANK[key]=[];
    JR_HARD_BANK[key].push.apply(JR_HARD_BANK[key], JR_HARD_EXTRA[key]);
  });

  // Banco ampliado: 180 questões autorais por disciplina, no estilo de cobrança IDECAN.
  // Carregado antes deste arquivo por quiz-megabank.js.
  const JR_MEGA_BANK=(typeof window!=="undefined" && window.JR_MEGA_BANK) ? window.JR_MEGA_BANK : {};
  Object.keys(JR_MEGA_BANK).forEach(function(key){
    if(!JR_HARD_BANK[key]) JR_HARD_BANK[key]=[];
    JR_HARD_BANK[key].push.apply(JR_HARD_BANK[key], JR_MEGA_BANK[key]);
  });

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
    try{ localStorage.setItem(STORAGE_PREFIX+key, JSON.stringify(seen.slice(-500))); }catch(e){}
  }

  function isTooEasy(item, quizKey){
    const q=String(item.q||"").trim();
    const opts=Array.isArray(item.o)?item.o:[];
    const knownAmbiguous =
      q==="A regência verbal está correta em:" ||
      (q==="Assinale a alternativa correta." &&
       opts.includes("Assisti ao filme.") &&
       opts.includes("Aspirava ao cargo, no sentido de desejar."));

    if(knownAmbiguous || q.length < 48) return true;

    if(quizKey==="portugues"){
      return /^A palavra corretamente grafada é:/i.test(q) ||
             /^Qual palavra está corretamente grafada/i.test(q) ||
             /^A palavra corretamente acentuada/i.test(q) ||
             /^Assinale a palavra com acentuação correta/i.test(q);
    }
    if(quizKey==="rlm"){
      return /^Um produto de R\$/i.test(q) ||
             /^Em um grupo de \d+ pessoas, \d+% faltaram/i.test(q) ||
             /^Quanto é \d+/i.test(q);
    }
    if(quizKey==="informatica"){
      return /^(O que é|Qual é) (um |uma )?(mouse|teclado|monitor|impressora|arquivo|pasta)/i.test(q);
    }
    if(quizKey==="sus"){
      return /^(SUS significa|A sigla SUS|O SUS é)/i.test(q);
    }
    if(quizKey==="rondonia"){
      return /^(Qual é a capital|Rondônia fica em qual região)/i.test(q);
    }
    return false;
  }

  function freshPick(pool, count, key, seen){
    const unique = [];
    const used = new Set();
    pool.forEach(item=>{
      const id=sig(item);
      if(!used.has(id)){ used.add(id); unique.push(item); }
    });

    const unseen=shuffle(unique.filter(item=>!seen.includes(sig(item))));
    const picked=unseen.slice(0,Math.min(count,unseen.length));

    if(picked.length<count){
      const pickedIds=new Set(picked.map(sig));
      const refill=shuffle(unique.filter(item=>!pickedIds.has(sig(item))))
        .slice(0,count-picked.length);
      picked.push.apply(picked,refill);
    }

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
    const hard=JR_HARD_BANK[quizKey]||[];
    const baseRaw=(typeof quizBank!=="undefined" && quizBank[quizKey]) ? quizBank[quizKey] : [];
    const advancedBase=baseRaw.filter(x=>!isTooEasy(x,quizKey));
    const seen=loadSeen(quizKey);

    // Prioridade total para o banco avançado e específico da disciplina.
    // O banco antigo só entra como reserva se a área não tiver 12 itens avançados disponíveis.
    const hardPick=freshPick(hard,Math.min(HARD_PER_ROUND,hard.length),quizKey,seen);
    const baseNeeded=Math.max(0,ROUND_SIZE-hardPick.length);
    const hardIds=new Set(hard.map(sig));
    const reserve=advancedBase.filter(item=>!hardIds.has(sig(item)));
    const basePick=baseNeeded ? freshPick(reserve,baseNeeded,quizKey,seen) : [];

    const merged=[];
    const ids=new Set();
    hardPick.concat(basePick).forEach(item=>{
      const id=sig(item);
      if(!ids.has(id)){ ids.add(id); merged.push(item); }
    });

    if(merged.length<ROUND_SIZE){
      const refill=shuffle(hard.concat(reserve))
        .filter(item=>!ids.has(sig(item)))
        .slice(0,ROUND_SIZE-merged.length);
      refill.forEach(item=>{ ids.add(sig(item)); merged.push(item); });
    }

    saveSeen(quizKey,seen);
    return shuffle(merged.slice(0,ROUND_SIZE)).map(shuffleOptions);
  }

  function updateIntro(subjectId){
    const box=document.getElementById("quiz-box-"+subjectId);
    const panel=box && box.closest(".quiz-panel");
    if(!panel) return;
    const head=panel.querySelector(".quiz-head span:last-child");
    if(head) head.textContent=ROUND_SIZE+" questões por rodada • nível avançado • rotação automática";
    const p=panel.querySelector(".quiz-intro p");
    if(p) p.textContent="Questões exclusivamente desta disciplina, com banco avançado, alternativas embaralhadas e cobrança inspirada no estilo IDECAN. Após responder, a próxima questão chega automaticamente.";
  }

  window.startQuiz=function(subjectId, quizKey){
    const expectedKey=SUBJECT_QUIZ_KEY[subjectId];
    const safeKey=expectedKey || quizKey;
    if(!safeKey || !JR_HARD_BANK[safeKey]) return;
    const questions=buildRound(safeKey);
    if(!questions.length) return;
    if(quizState[subjectId] && quizState[subjectId].autoTimer) clearTimeout(quizState[subjectId].autoTimer);
    quizState[subjectId]={index:0,score:0,answered:false,quizKey:safeKey,questions,autoTimer:null};
    updateIntro(subjectId);
    document.getElementById("quiz-result-"+subjectId).classList.add("hidden");
    document.getElementById("quiz-box-"+subjectId).classList.remove("hidden");
    window.jrRenderQuestion(subjectId);
  };

  window.jrRenderQuestion=function(subjectId){
    const state=quizState[subjectId];
    if(state && state.autoTimer){ clearTimeout(state.autoTimer); state.autoTimer=null; }
    const quiz=state.questions||[];
    const item=quiz[state.index];
    if(!item) return;
    document.getElementById("quiz-title-"+subjectId).textContent="Desafio avançado • "+findSubjectTitle(subjectId)+" • estilo IDECAN";
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
    nextBtn.textContent=state.index===quiz.length-1?"Ver resultado agora":"Próxima agora";
    state.autoTimer=setTimeout(function(){
      state.autoTimer=null;
      if(state.index<quiz.length-1){
        state.index++;
        window.jrRenderQuestion(subjectId);
      }else{
        window.jrShowQuizResult(subjectId);
      }
    },AUTO_NEXT_MS);
  };

  window.nextQuestion=function(subjectId){
    const state=quizState[subjectId];
    if(!state) return;
    if(state.autoTimer){ clearTimeout(state.autoTimer); state.autoTimer=null; }
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
    if(state && state.autoTimer){ clearTimeout(state.autoTimer); state.autoTimer=null; }
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
      '<button class="btn btn-primary btn-small" onclick="startQuiz(\''+subjectId+'\',\''+state.quizKey+'\')">Continuar com novas questões</button>'+
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