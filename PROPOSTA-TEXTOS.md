# Núcleo Tech — estrutura e textos novos (para aprovação)

Nada de código foi alterado ainda. Leia, risque o que não gostar, responda.

---

## PARTE 0 — Três coisas que precisam de decisão sua antes de qualquer código

### 0.1 O repositório que me deram não é o do site

Fui aberto em `07Castiel/Nucleo-Tech`. O que tem lá dentro **não é o site que você
descreveu**: é uma versão antiga, de junho de 2025, com cartões de emoji,
depoimentos inventados ("Maria Silva, CEO, TechStart"), números inventados
("50 projetos entregues", "3 anos de experiência"), e-mail
`nucleotech.suporte@gmail.com.br` e telefone `(85) 9 9999-9999`.

O site que você descreveu — intro 3D, Manifesto, Stack, "Este site é o case",
formulário — está em **`07Castiel/nucleo-tech-site`**. Conferi arquivo por arquivo.

Se eu implementar onde fui aberto, o site no ar não muda.

**Decisão sua:** confirmo que é para trabalhar em `07Castiel/nucleo-tech-site`?
Se sim, preciso que você libere permissão de escrita nesse repositório (a
tentativa foi bloqueada e depende de você autorizar).

Aviso relacionado: o endereço `agencianucleotech.vercel.app` **não aparece** na
sua conta da Vercel como eu a enxergo (os projetos que vejo são `nucleo-tech-site`,
`nucleo-tech`, `nucleo-tech-fps-check`, `holanda_motors01` e outros). Ou ele está
em outra conta, ou é um apelido que eu não consigo listar. Confirme de qual
projeto da Vercel esse endereço é publicado — senão eu entrego o código certo no
lugar errado.

### 0.2 Discordo da troca das fontes para o Google Fonts

Você pediu para trocar o link de fontes do kit por um link do Google Fonts.
**Discordo porque** o site de hoje já hospeda a Archivo no próprio servidor
(`assets/fonts/archivo.woff2`, 90 KB), declarada com
`font-weight: 400 900; font-stretch: 62% 125%` — ou seja, **já é a fonte variável
com o eixo de largura que o kit exige**, e o `font-stretch: 112%` do `.nt-display`
funciona nela hoje. Trocar isso por um link do Google significa: duas conexões
novas a domínios de terceiros (DNS + handshake), uma folha de estilo que trava a
primeira pintura, e o texto do celular no 4G fraco aparecendo depois. É o oposto
do que você pediu nos critérios de velocidade.

**O que eu faria no lugar:** manter a Archivo já hospedada, acrescentar a
JetBrains Mono 600 hospedada junto (≈15 KB, só para os rótulos `.nt-label`), e
apagar a Inter (48 KB) e uma das IBM Plex Mono, que deixam de ser usadas. Resultado:
zero requisição a terceiros, menos bytes que hoje, e as fontes do kit respeitadas.

**O risco da sua abordagem:** Lighthouse mobile perde pontos em *render-blocking
resources* e em LCP justamente na primeira tela, que é a tela que decide o clique.

Se você quiser o link do Google assim mesmo, eu faço — é uma linha. Mas quero
que a escolha seja sua e não um descuido.

### 0.3 Sem preço e sem prazo, a pergunta mais importante do site fica sem resposta

Você mandou não inventar preço nem prazo. Certo. Só que "Quanto custa?" é a
primeira pergunta de todo dono de empresa, e uma resposta do tipo "depende do
tamanho do trabalho" é lida como enrolação — ela **reduz** o clique no WhatsApp,
não aumenta. O mesmo vale para prazo e para o que está incluído no suporte.

Deixei esses três pontos marcados como `[PREENCHER]` no texto abaixo. Não são
detalhes cosméticos: são as três lacunas que mais custam conversão. Mesmo um
"sites a partir de R$ X" ou "a maioria dos sites fica pronta em X semanas" já
resolve. Me passe os números e eu escrevo.

---

## PARTE 1 — Estrutura das seções

| # | Seção | Rótulo `.nt-label` | Para que serve |
|---|---|---|---|
| — | Cabeçalho | — | Logo + botão WhatsApp |
| 1 | Primeira tela | CONSTRUÍMOS O NÚCLEO DIGITAL DO SEU NEGÓCIO | Entender em 5 s e clicar |
| 2 | O que fazemos | O QUE FAZEMOS | 4 cartões: problema + o que é + exemplo |
| 3 | Para quem é | PARA QUEM É | A pessoa se reconhecer |
| 4 | Trabalho real | TRABALHO REAL | Prova: Holanda Motors |
| 5 | Como funciona | COMO FUNCIONA | Tirar o medo de começar |
| 6 | Quem faz | QUEM FAZ | Cara e nome, não "empresa" |
| 7 | Perguntas frequentes | PERGUNTAS FREQUENTES | Derrubar a última objeção |
| 8 | Chamada final + rodapé | — | Último botão |

### Três ajustes de estrutura que proponho (e por quê)

1. **Sem menu de navegação no celular.** O site de hoje tem hambúrguer, menu em
   tela cheia, trilha lateral de capítulos e uma busca por atalho de teclado
   (Ctrl+K). Isso é coisa para quem gosta de navegar; o seu visitante veio de um
   link do Instagram e precisa de um botão. No celular o cabeçalho fica com a
   logo e o botão "Falar no WhatsApp", só. No computador, quatro links de âncora.
2. **Botão de WhatsApp fixo no rodapé da tela no celular**, como você pediu, e
   um botão dentro de cada seção. A pessoa nunca fica a mais de uma rolagem de
   distância do botão.
3. **A numeração "01, 02, 03" sai de tudo**, inclusive dos passos do "Como
   funciona" (vira 1, 2, 3, 4 em algarismo comum) e dos cartões. Você pediu
   rótulos sem numeração técnica; a numeração dos passos é a única que fica,
   porque ali ela ajuda a entender a ordem.

---

## PARTE 2 — Todos os textos

> Onde estiver `[PREENCHER: ...]`, eu **não** inventei. Está esperando você.

### Cabeçalho

- Logo horizontal para fundo escuro (`/brand/logo-horizontal-escuro.svg`), 148 px de largura.
- Links (só no computador): `O que fazemos` · `Para quem é` · `Como funciona` · `Perguntas`
- Botão: **Falar no WhatsApp**

---

### 1. Primeira tela

**Rótulo:** CONSTRUÍMOS O NÚCLEO DIGITAL DO SEU NEGÓCIO

**Título:**
> Sites, sistemas e atendimento automático no WhatsApp para a sua empresa.

**Subtítulo:**
> Você conta o que a sua empresa precisa. A gente constrói, coloca no ar e continua por perto depois.

**Botão principal:** Falar no WhatsApp
**Botão secundário:** Ver o que fazemos

**Linha de apoio, abaixo dos botões:**
> Sobral, Ceará. Atendemos empresas de todo o Brasil.

---

### 2. O que fazemos

**Rótulo:** O QUE FAZEMOS
**Título:** O que a gente faz pela sua empresa
**Linha de apoio:** Quatro frentes. Você pode contratar uma ou todas.

#### Cartão 1 — Sites

- **O problema:** Quem procura o seu serviço no Google ou no Instagram precisa achar você e confiar no que vê.
- **O que a gente faz:** Um site rápido, que abre bem no celular e leva o cliente direto para o seu WhatsApp.
- **No dia a dia:** A loja que só tinha Instagram passa a ter um endereço próprio, com os produtos, o horário e o caminho até a porta.

#### Cartão 2 — Sistemas sob medida

- **O problema:** Planilha que ninguém acha, caderno que some, a mesma informação anotada em três lugares diferentes.
- **O que a gente faz:** Um sistema feito do jeito que a sua empresa já funciona, da primeira conversa até estar rodando no dia a dia.
- **No dia a dia:** A concessionária cadastra o carro uma vez e ele aparece no site, na ficha do vendedor e no relatório do fim do mês.

#### Cartão 3 — Atendimento automático no WhatsApp

- **O problema:** Mensagem chegando fora do horário, cliente esperando resposta, venda que esfria.
- **O que a gente faz:** O WhatsApp da empresa responde na hora as perguntas de sempre e chama uma pessoa quando o assunto é sério.
- **No dia a dia:** A academia responde preço, horário e endereço às onze da noite. De manhã, o dono só fala com quem quer fechar.

#### Cartão 4 — Inteligência artificial para a sua empresa

- **O problema:** Todo mundo fala de inteligência artificial, mas ninguém explica onde ela entra no seu negócio.
- **O que a gente faz:** A gente olha a sua rotina e mostra onde a inteligência artificial economiza tempo de verdade — e onde ela não serve para nada.
- **No dia a dia:** O escritório manda o áudio da reunião e recebe o resumo escrito, com as tarefas separadas por responsável.

---

### 3. Para quem é

**Rótulo:** PARA QUEM É
**Título:** Empresas como a sua
**Linha de apoio:** A gente trabalha com quem toca um negócio de verdade, no interior do Ceará e fora dele.

Lista:
- Concessionárias e lojas de veículos
- Academias de musculação e artes marciais
- Escritórios de advocacia
- Clínicas e consultórios
- Provedores de internet
- Comércio local

**Fecho:** Não está nessa lista? Chame no WhatsApp e conte o que você precisa. → *Falar no WhatsApp*

---

### 4. Trabalho real

**Rótulo:** TRABALHO REAL
**Título:** Quem já confiou na gente

#### Holanda Motors

- **Linha de identificação:** Concessionária · Sobral, CE
- **Endereço no ar:** holandamotors.com.br *(confirmado: está publicado e no ar)*
- **O que eles precisavam:** `[PREENCHER: em uma ou duas frases, qual era o problema antes]`
- **O que a gente fez:** `[PREENCHER: o que foi construído, em linguagem de cliente]`
- **O que mudou:** `[PREENCHER: resultado concreto. Se não tiver número, uma frase honesta do que ficou melhor. Não vou inventar percentual]`

**Nota abaixo do case:** Novos trabalhos entram aqui conforme forem ficando prontos.

> **Sobre a estrutura:** vou montar essa seção como uma lista de cartões de case.
> Para acrescentar o próximo, você copia um bloco `<article class="case">` e troca
> o texto — sem mexer em CSS nem em JavaScript. Deixo um comentário no HTML
> explicando isso na hora.

---

### 5. Como funciona

**Rótulo:** COMO FUNCIONA
**Título:** Do primeiro contato até estar rodando

**1. Conversa**
> Você chama no WhatsApp e conta o que precisa. A gente pergunta o resto. Sem compromisso e sem cobrança.

**2. Proposta**
> Você recebe por escrito o que vai ser feito, quanto custa e em quanto tempo fica pronto. Só começa depois do seu sim.

**3. Construção**
> A gente constrói e mostra o andamento. Você vê funcionando antes de estar pronto e pede ajuste no caminho.

**4. Entrega e suporte**
> Entra no ar, a gente ensina a usar e continua junto depois. Deu problema, você chama no WhatsApp e a gente resolve.

---

### 6. Quem faz

**Rótulo:** QUEM FAZ
**Título:** Quem responde do outro lado

> A Núcleo Tech é de **Leonardo Brito**, de Sobral, no Ceará.
>
> Quando você chama no WhatsApp, é com ele que você fala — não com um atendente que vai repassar seu recado.
>
> A gente atende Sobral e região de perto e o resto do Brasil de longe. O trabalho é o mesmo.

- Foto: `[PREENCHER: foto]` — me mande a foto e eu converto para WebP com tamanho definido.
  **Enquanto não tiver foto**, coloco o símbolo da marca no lugar, num bloco que já
  fica bonito assim. Não vou deixar um retângulo cinza escrito "foto aqui" no ar.

---

### 7. Perguntas frequentes

**Rótulo:** PERGUNTAS FREQUENTES
**Título:** O que todo mundo pergunta antes de fechar

**Quanto custa?**
> O preço depende do tamanho do trabalho: um site simples e um sistema para a empresa inteira não custam a mesma coisa. Você conta o que precisa e recebe o valor fechado por escrito, antes de qualquer coisa começar.
> `[PREENCHER: um valor de partida, do tipo "Sites a partir de R$ X". Ver item 0.3]`

**Quanto tempo leva?**
> `[PREENCHER: prazo médio de um site e prazo médio de um sistema]`. A data de entrega vai escrita na proposta.

**Preciso entender de tecnologia?**
> Não. Você entende do seu negócio e a gente entende da parte técnica. Em nenhum momento você vai precisar mexer em algo que não sabe.

**E se der problema depois de entregar?**
> Você chama no WhatsApp e a gente resolve. O trabalho não acaba na entrega.
> `[PREENCHER: o que está incluído de suporte e por quanto tempo]`

**Vocês só atendem em Sobral?**
> Não. A gente é de Sobral, atende de perto quem é daqui e trabalha para empresas de qualquer lugar do Brasil.

**Eu já tenho um site. Dá para melhorar em vez de fazer outro?**
> Dá. Manda o endereço no WhatsApp que a gente olha e diz com franqueza se vale mexer no que já existe ou começar do zero.

---

### 8. Chamada final

**Título:** Conte o que a sua empresa precisa.
**Subtítulo:** A primeira conversa é de graça e não tem compromisso. Se não for o nosso caso, a gente fala na hora.
**Botão:** Falar no WhatsApp
**Abaixo do botão:** (88) 99302-0040

---

### Rodapé

- Logo horizontal para fundo escuro
- **Linha da empresa:** Sites, sistemas e atendimento automático no WhatsApp. Sobral, Ceará.
- **WhatsApp:** (88) 99302-0040 → `https://wa.me/5588993020040?text=...`
- **E-mail:** agencianucleotech@gmail.com
- **Instagram:** @agencia_nucleotech
- **Linha final:** © 2026 Núcleo Tech · Sobral, CE

---

### Botão fixo (só no celular)

Botão redondo no canto inferior direito, verde-água, com o ícone do WhatsApp,
56 px, `aria-label="Falar no WhatsApp"`.

---

### Textos que não aparecem na tela

- **Título da aba:** Núcleo Tech | Sites e sistemas em Sobral
- **Descrição (Google e prévia de link):** Sites, sistemas sob medida e atendimento automático no WhatsApp para empresas de Sobral e região.
- **Texto alternativo da logo:** Núcleo Tech
- **Prévia de link (og:image):** a imagem do kit, em `https://agencianucleotech.vercel.app/og-image.png`

---

## PARTE 3 — O que vai ser apagado

| Vai embora | Onde está hoje |
|---|---|
| Intro 3D animada | `js/modules/intro.js`, `js/vendor/forge.bundle.js` (505 KB), `js/vendor/forge.src.js`, `assets/fonts/intro-archivo-black.typeface.json` |
| Núcleo animado em canvas na primeira tela | `js/modules/nucleus.js` |
| Seção "Manifesto" | `index.html` |
| Seção "Stack" / "Tecnologia que dominamos" | `index.html`, `js/modules/system.js` |
| "Case 001 — Este site é o case" e todos os indicadores medidos no navegador | `index.html`, `js/modules/metrics.js` |
| Formulário de contato | `index.html`, `js/modules/contact.js` |
| Busca por Ctrl+K ("Núcleo Command") | `js/modules/command.js` |
| Cursor personalizado e efeito magnético | `js/modules/cursor.js` |
| Trilha lateral de capítulos e menu em tela cheia | `index.html`, parte de `js/modules/nav.js` |
| Número de WhatsApp (88) 99265-8966 | 6 lugares em `index.html`, `js/modules/contact.js`, `js/modules/command.js` |
| Fonte Inter (48 KB) e uma das IBM Plex Mono | `assets/fonts/` |

Sobra de JavaScript: hoje são ~553 KB (incluindo o `forge.bundle.js`).
Depois deve ficar em torno de **8 a 12 KB**, só para abrir/fechar as perguntas
frequentes e revelar as seções na rolagem.

---

## PARTE 4 — O que eu preciso de você

1. **Aprovar ou corrigir os textos acima.**
2. **Responder o item 0.1:** trabalho em `07Castiel/nucleo-tech-site`? E qual
   projeto da Vercel publica `agencianucleotech.vercel.app`?
3. **Responder o item 0.2:** mantenho as fontes hospedadas no próprio site
   (recomendo) ou troco pelo link do Google Fonts como você pediu?
4. **Preencher, se puder:** valor de partida, prazo médio, o que inclui o suporte,
   os três campos do case da Holanda Motors e a foto do Leonardo.

Sem 1 e 2 eu não começo. Sem 4 eu começo, e deixo os `[PREENCHER]` marcados no
HTML com comentário, para você trocar depois sem me chamar.
