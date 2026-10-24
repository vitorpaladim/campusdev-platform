# CampusDev — auditoria do projeto e roadmap do marketplace

**Data da análise:** 14 de outubro de 2026  
**Repositório analisado:** `vitorpaladim/campus-dev-api-teste`  
**Branch observada:** `vitorpaladim-fase-0-auditoria`  

## 1. Resumo executivo

O projeto já deixou de ser apenas uma API inicial. Hoje existe uma base de MVP com:

- cadastro e login com JWT;
- dois tipos principais de usuário: quem oferece serviços e quem procura serviços;
- criação, consulta, atualização e exclusão de projetos;
- candidaturas e aprovação/recusa de participantes;
- ordenação simples por compatibilidade de habilidades;
- chat restrito a participantes aprovados e solicitante;
- perfil profissional com bio, disponibilidade, habilidades e link de portfólio;
- feed de projetos com busca, categoria, orçamento e destaque;
- páginas de termos, privacidade e planos;
- temas claro, escuro e modo dev na interface.

A visão desejada, porém, é maior: uma **rede social profissional de projetos**, com feed contínuo, perfis públicos, equipes, descoberta por habilidades, colaboração e modelo de negócio. Os recursos atuais são principalmente CRUD e ainda não formam uma experiência completa de marketplace.

### Diagnóstico em uma frase

> A base técnica já permite demonstrar o fluxo “publicar projeto → candidatar-se → aprovar equipe → conversar”, mas faltam produto, governança, segurança de autorização, experiência social e monetização real.

---

## 2. O que já está implementado

| Área | Situação atual | Observação |
|---|---|---|
| Autenticação | Parcialmente pronta | JWT, BCrypt, login e cadastro funcionam como conceito. |
| Cadastro sem `.edu` | Atendido na tela atual | O frontend aceita email comum; não há validação `.edu` no fluxo observado. |
| Perfis | MVP | Há perfil de cliente e de desenvolvedor, bio, disponibilidade, habilidades e URL de portfólio. |
| Projetos | MVP funcional | Projeto tem título, descrição, categoria, tecnologias, orçamento, prazo, tamanho da equipe e status. |
| Feed | Parcial | Lista ordenada por destaque e data, mas sem paginação/infinite scroll e sem feed social. |
| Candidaturas | Backend quase completo | Envio, listagem e decisão existem; a interface para o solicitante gerenciar candidaturas ainda não aparece integrada. |
| Equipe | Parcial | Participantes aprovados são associados ao projeto e exibidos como iniciais. |
| Chat | MVP | Chat por projeto existe, mas não é tempo real e não há notificações. |
| Matching | Protótipo | Matching é uma interseção textual simples entre tecnologias do projeto e `skills`. |
| Temas | Presente | Há claro, escuro e dev; é uma troca visual, não uma experiência de produto totalmente adaptada a cada modo. |
| Termos/privacidade | Base inicial | Os textos existem, mas ainda são genéricos e não cobrem todos os tratamentos necessários. |
| Monetização | Apenas proposta visual | A página de planos explica a estratégia, mas não existe cobrança, impulsionamento ou controle de destaque. |

---

## 3. Achados críticos para corrigir antes da apresentação

### P0 — Fluxo principal inconsistente entre frontend e backend

O dashboard busca `/projetos`, mas sempre coloca os projetos criados e participados como arrays vazios. Além disso, ele espera propriedades que não correspondem ao contrato atual, como `participantes`, `tamanhoEquipe` e `dataCriacao`, enquanto o backend usa `desenvolvedores`, `qndPessoasNecessarias` e `dataDeCadastro`.

**Impacto:** a pessoa pode criar ou participar de projetos, mas o dashboard continua dizendo que não há projetos envolvidos.

**Correção:** criar endpoints próprios, por exemplo:

- `GET /me/projetos/criados`;
- `GET /me/projetos/participando`;
- `GET /me/candidaturas`;
- ou adaptar o frontend ao contrato atual, preferencialmente usando DTOs estáveis.

### P0 — Qualquer usuário logado vê o botão “Participar”

Em `Projects.jsx`, `canJoinProject()` só verifica se existe usuário e se o projeto está aberto. Isso permite que um cliente veja a ação de participação, embora o backend depois negue a operação. O dono do projeto também pode receber ações incoerentes.

**Correção:** restringir a participação a usuários com papel de desenvolvedor/ofertante, impedir candidatura ao próprio projeto e considerar candidaturas já enviadas ou recusadas.

### P0 — `isUserInProject()` está permanentemente desativado

A função retorna `false` em todas as situações. Portanto, quem já participa pode continuar vendo “Participar”, gerando tentativa duplicada e uma experiência incorreta.

**Correção:** verificar `project.desenvolvedores` e também o estado da candidatura do usuário.

### P0 — Destaque pode ser manipulado pelo cliente

O frontend envia `destaque: false`, e o modelo permite atualização dessa propriedade. Não existe no backend um fluxo autorizado de impulsionamento, pagamento, expiração ou auditoria. Se a API aceitar `destaque: true` em atualização, qualquer dono de projeto pode se promover sem pagar.

**Correção:** remover `destaque` dos DTOs públicos de criação/edição e criar um domínio separado de promoção, com status, período, preço, pagamento confirmado e histórico.

### P0 — Respostas expõem entidades JPA diretamente

Controllers retornam entidades como `Projeto`, `Cliente`, `Desenvolvedor` e `Mensagem`. Isso acopla o JSON ao banco, aumenta o risco de ciclos de serialização e pode revelar dados que não deveriam ser públicos, como email e telefone de perfis.

**Correção:** usar DTOs de resposta por contexto:

- card público do feed;
- detalhe público do projeto;
- perfil público;
- visão privada do dono;
- visão do participante;
- mensagem do chat.

Nunca retornar entidades diretamente nos endpoints públicos.

### P0 — Autorização de perfil precisa ser endurecida

Os endpoints de desenvolvedores/clientes usam o `id` recebido na URL. É necessário garantir no service que o usuário autenticado só edita/exclui o próprio perfil, ou que a operação seja exclusiva de administrador. O mesmo vale para endpoints administrativos de `/usuarios`.

**Correção:** centralizar `currentUser`, comparar pelo ID autenticado e separar rotas administrativas das rotas de perfil próprio.

### P1 — Comparação de IDs usando `==` em Java

Em `MensagemService`, há comparações como `projeto.getCliente().getId() == usuario.getId()`. Como IDs são `Long`, a comparação por referência é incorreta em geral.

**Correção:** usar `Objects.equals(a, b)` ou `.equals()` com valor não nulo. Revisar o mesmo padrão em toda a API.

### P1 — Testes não rodam no ambiente atual

`mvn test` falhou porque a compilação exige release Java 21, mas o processo Maven do ambiente reportou uma versão incompatível. O README ainda manda executar como Java 17, enquanto `pom.xml` define Java 21.

**Correção:** escolher uma versão oficial e alinhar `pom.xml`, README, Dockerfile, Render e CI. Recomendo Java 21, por já estar definido no `pom.xml`; se a infraestrutura só suportar Java 17, alterar o projeto de forma consciente. O pipeline deve executar testes em cada push.

### P1 — Lint do frontend falha

`npm run lint` encontrou cinco erros:

- `Navbar.jsx`: `Icon` definido, mas não usado;
- `badge.jsx` e `button.jsx`: regra de Fast Refresh;
- `vite.config.js`: `process` não definido.

O build de produção passa, mas o código não está limpo para CI.

**Correção:** remover ou renderizar `Icon`, ajustar exports dos componentes UI ou configurar a regra de forma adequada, e usar `import.meta.env`/configuração compatível com Vite em vez de `process` sem declaração.

---

## 4. Gaps de produto em relação à visão desejada

### 4.1 Feed no estilo Instagram/LinkedIn

Hoje é uma grade de cards de projetos. Faltam:

- paginação ou infinite scroll;
- ordenação por recentes, relevantes, perto do prazo e compatíveis com o perfil;
- posts com identidade do solicitante, avatar, nome da empresa e data;
- ações de salvar, compartilhar e copiar link;
- contagem de candidaturas e vagas restantes;
- estado “projeto encerrado” claro;
- distinção visual entre orgânico e patrocinado;
- feed personalizado por habilidades e interesses;
- moderação de conteúdo;
- URLs públicas e compartilháveis para projeto e perfil.

### 4.2 Perfis públicos

O perfil atual é uma tela de edição do próprio usuário. Ainda falta a camada social/profissional:

- rota pública `/perfil/:id`;
- foto/avatar e capa;
- headline profissional;
- localização/fuso e modalidade de trabalho;
- habilidades estruturadas com nível e evidências;
- projetos concluídos, em andamento e resultados;
- portfólio com múltiplos itens, imagem, descrição, tecnologias e links;
- disponibilidade “estou livre” com data de atualização;
- avaliações, recomendações ou referências;
- privacidade por campo;
- denunciar e bloquear usuário.

### 4.3 Projetos e equipes

O modelo atual suporta uma equipe simples, mas não papéis e colaboração robustos. Faltam:

- requisitos por vaga, por exemplo “1 designer”, “2 devs frontend” e “1 pessoa de conteúdo”;
- quantidade de vagas por habilidade, em vez de apenas um número total;
- convite direto a usuários;
- candidatura com mensagem, preço/proposta e disponibilidade;
- aprovação, recusa e retirada de candidatura na interface;
- papéis dentro da equipe;
- dono, administradores e participantes;
- histórico de alterações;
- saída da equipe;
- avaliação ao finalizar;
- anexos, entregáveis e milestones;
- status de pagamento/contrato, caso o produto evolua para intermediação.

### 4.4 Chat

O chat existente é uma caixa de mensagens persistida, mas não uma experiência de colaboração completa. Faltam:

- atualização em tempo real via WebSocket/SSE;
- notificações e não lidas;
- mensagens por conversa, em vez de apenas uma lista por projeto;
- anexos e links com pré-visualização;
- menções;
- busca;
- moderação, denúncia e bloqueio;
- retenção e exportação conforme política de privacidade;
- controle de quem continua acessando o chat após sair ou ser removido.

### 4.5 Busca e filtros

A busca atual filtra apenas os projetos já carregados no navegador. Para crescer, será necessário:

- busca no backend;
- paginação;
- filtros por múltiplas tecnologias;
- faixa de orçamento;
- prazo;
- modalidade/remoto;
- localização e fuso;
- tamanho da equipe;
- disponibilidade do solicitante;
- projetos com candidatura aberta;
- ordenação por relevância e recência.

As tecnologias também devem deixar de ser uma string livre e passar a ser tags normalizadas.

---

## 5. Cadastro e posicionamento

A mudança de `.edu`/`.edu.br` está refletida no frontend atual: o campo é um email comum e não encontrei validação desse domínio no fluxo de registro observado.

Mesmo assim, o cadastro ainda precisa evoluir para separar **intenção** de **papel permanente**. Uma mesma pessoa pode querer oferecer serviços e publicar uma demanda em momentos diferentes.

Recomendação:

1. criar uma conta única;
2. perguntar no onboarding quais objetivos a pessoa tem;
3. permitir os modos “ofereço habilidades”, “procuro colaboradores” ou “ambos”;
4. não chamar todo ofertante de “desenvolvedor”, porque a plataforma inclui design, marketing, conteúdo, dados e outras habilidades;
5. solicitar os dados do perfil progressivamente, sem transformar o cadastro inicial em um formulário enorme;
6. deixar explícito que “estou livre” é uma disponibilidade, não uma contratação garantida.

Também faltam recuperação de senha, verificação de email, troca de senha, encerramento de sessões e proteção contra abuso de cadastro/login.

---

## 6. Privacidade, termos e confiança

As páginas de termos e privacidade são uma boa base para a apresentação, mas ainda declaram intenções genéricas. Antes de lançamento real, precisam ser revisadas juridicamente, especialmente por causa da LGPD.

Itens que devem ser adicionados ou esclarecidos:

- identidade e contato do controlador;
- bases legais por finalidade;
- dados obrigatórios e opcionais;
- dados de perfil público e dados privados;
- uso de cookies/localStorage e tecnologias de sessão;
- provedores de hospedagem, banco, email e pagamento;
- transferências internacionais;
- prazo de retenção por tipo de dado;
- canal para solicitações do titular;
- procedimento para acesso, correção, portabilidade e exclusão;
- tratamento de menores de idade;
- propriedade intelectual de portfólios e entregáveis;
- responsabilidade por propostas, contratos e pagamentos entre usuários;
- regras para anúncios patrocinados;
- versão aceita no cadastro e histórico de versões;
- política de denúncias, remoção e recurso;
- resposta a incidentes de segurança.

A exclusão atual também precisa ser revisada: apagar um perfil pode afetar projetos, candidaturas, mensagens e evidências necessárias para auditoria. O ideal é definir exclusão, anonimização e retenção legal separadamente.

---

## 7. Monetização para apresentar à faculdade/incubadora

A página de planos já aponta uma direção correta: manter o núcleo gratuito e cobrar por visibilidade ou recursos de negócio. A proposta pode ser apresentada assim:

### Fase 1 — gratuito para validar liquidez

- cadastro, perfil, publicação básica, busca, candidatura e participação em equipe gratuitos;
- medir número de projetos publicados;
- medir candidaturas por projeto;
- medir tempo até a primeira candidatura;
- medir percentual de projetos que formam equipe;
- medir projetos concluídos e usuários que retornam.

### Fase 2 — promoção de projetos

- impulsionamento por 24h, 3 dias ou 7 dias;
- preço fixo baixo ou baseado em categoria/região;
- limite de posições patrocinadas no feed;
- identificação clara de “patrocinado”;
- início e fim automáticos;
- relatório de visualizações, cliques e candidaturas;
- reembolso/crédito se a promoção não for veiculada.

### Fase 3 — plano profissional

- mais itens de portfólio;
- selo de disponibilidade verificada;
- analytics do perfil;
- destaque de portfólio;
- filtros salvos e alertas;
- candidatura com modelos e histórico.

### Fase 4 — plano para empresas

- múltiplos projetos;
- pipeline de candidaturas;
- filtros avançados;
- convite direto;
- gestão de equipes;
- permissões para membros da empresa;
- relatórios e suporte.

### Fase 5 — comissão opcional

Se a plataforma futuramente intermediar pagamento, pode cobrar comissão por transação. Isso aumenta muito a complexidade: antifraude, chargeback, impostos, suporte, disputa, KYC e responsabilidade contratual. Não recomendo colocar isso no MVP da faculdade.

### Modelo recomendado para a banca

> O CampusDev adota um modelo freemium de duas pontas: o acesso básico permanece gratuito para preservar a liquidez da comunidade; a receita vem de impulsionamento de projetos, planos profissionais e ferramentas B2B para empresas. A plataforma só introduz cobrança após medir se existe demanda real e se o destaque melhora o encontro entre projeto e talento.

---

## 8. Roadmap sugerido

### Sprint 0 — estabilização técnica

- alinhar Java 21 ou Java 17 em todos os ambientes;
- corrigir lint;
- fazer testes rodarem;
- revisar CORS e configuração por ambiente;
- documentar contrato da API;
- criar DTOs de resposta;
- corrigir comparações de IDs;
- adicionar CI com build, lint e testes.

### Sprint 1 — fluxo mínimo demonstrável

- corrigir dashboard com endpoints reais;
- impedir ações incompatíveis com o papel do usuário;
- implementar estado de candidatura no frontend;
- tela do solicitante para aprovar/recusar;
- impedir duplicidade e candidatura ao próprio projeto;
- mostrar vagas restantes e status consistentes;
- normalizar labels dos status.

### Sprint 2 — perfis e portfólios

- perfil público;
- avatar;
- múltiplos projetos de portfólio;
- disponibilidade e headline;
- tags de habilidade normalizadas;
- privacidade por campo;
- projetos concluídos vinculados ao perfil.

### Sprint 3 — feed e descoberta

- endpoint paginado;
- infinite scroll;
- filtros no backend;
- ordenação por recência/relevância;
- salvar projeto;
- compartilhar projeto;
- feed personalizado;
- indicação visual de patrocinado, mesmo que a cobrança ainda seja simulada.

### Sprint 4 — colaboração

- chat em tempo real;
- notificações;
- convite direto;
- papéis na equipe;
- anexos;
- milestones e entregáveis;
- avaliação ao finalizar.

### Sprint 5 — confiança e negócio

- verificação de email;
- recuperação de senha;
- denúncias, bloqueio e moderação;
- painel administrativo;
- analytics de produto;
- impulsionamento com sandbox de pagamento;
- planos e regras comerciais.

---

## 9. Critérios de aceite para o MVP da apresentação

A apresentação já fica forte se o seguinte roteiro funcionar sem inconsistências:

1. pessoa A cria uma conta como “estou livre para trabalhar”;
2. completa bio, disponibilidade, skills e portfólio;
3. pessoa B cria uma conta como empresa/negócio que precisa de serviço;
4. pessoa B publica um projeto com orçamento, prazo, tecnologias e vagas por função;
5. pessoa A encontra o projeto pelo feed e filtra por tecnologia;
6. pessoa A abre o perfil público de B e envia uma candidatura com mensagem;
7. pessoa B visualiza a candidatura e aprova ou recusa;
8. a equipe aprovada aparece no projeto;
9. solicitante e participantes conversam no chat;
10. projeto muda para andamento e depois finalizado;
11. projeto concluído aparece no portfólio da pessoa A;
12. a tela de planos explica claramente onde a receita entra, sem fingir que o pagamento já existe.

---

## 10. Conclusão

O projeto não precisa ser refeito do zero. A melhor estratégia é preservar o backend e a linguagem visual atuais, mas corrigir primeiro a coerência do fluxo e a segurança. Depois, evoluir de “lista de projetos com CRUD” para “rede de perfis e oportunidades”.

A ordem mais importante é:

1. **estabilizar build, testes e contratos;**
2. **fechar o fluxo de candidatura/equipe;**
3. **implementar perfis públicos e portfólio de verdade;**
4. **transformar a lista em feed paginado e pesquisável;**
5. **adicionar confiança, notificações e colaboração;**
6. **só então ativar impulsionamento e cobrança.**

Com essa sequência, o CampusDev fica defensável como produto de incubação: resolve um problema claro, tem efeito de rede, possui caminho de receita e não depende de cobrar antes de provar que conecta pessoas com sucesso.
