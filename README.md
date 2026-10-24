# CampusDev Platform

> Plataforma de colaboração que conecta estudantes e profissionais em início de carreira a empresas, pequenos negócios e projetos reais.

O CampusDev combina um feed de projetos inspirado em produtos sociais com recursos de marketplace profissional: perfis públicos, portfólio, candidaturas, formação de equipes, mensagens diretas, avaliações e notificações em tempo real.

## Visão do produto

O objetivo do projeto é reduzir a distância entre quem precisa construir um produto digital e quem quer ganhar experiência prática colaborando em projetos. Empresas publicam oportunidades; estudantes apresentam suas habilidades, portfólio e disponibilidade; e a plataforma organiza descoberta, candidatura e comunicação.

## Principais funcionalidades

- Cadastro separado para estudantes/desenvolvedores e empresas/clientes.
- Feed de projetos com busca, filtros, orçamento, status e destaque.
- Candidaturas e seleção de participantes para formar equipes.
- Perfis públicos com avatar, capa, bio, habilidades e disponibilidade.
- Portfólio com projetos, tecnologias, links e anexos de PDF, TXT, Markdown, DOCX ou ZIP.
- Upload persistente de imagens e arquivos com validação de tipo e tamanho.
- Avaliações e recomendações com nota de 1 a 5.
- Mensagens diretas a partir do perfil público e caixa de entrada.
- Chat contextual de projetos.
- Notificações em tempo real via Server-Sent Events (SSE) para novas mensagens e avaliações.
- Modos claro, escuro e Dev.
- Termos de uso, privacidade e página de planos.
- Modo demonstração local para explorar a interface sem uma API configurada.

## Stack

### Backend

- Java 21
- Spring Boot 3.3
- Spring Web, Security, Validation e Data JPA
- JWT para autenticação stateless
- PostgreSQL
- Flyway para migrations versionadas
- Springdoc OpenAPI / Swagger
- Maven Wrapper

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- Radix UI
- Lucide React
- ESLint

## Arquitetura

O backend segue uma separação em camadas:

```text
Controller -> Service -> Repository -> PostgreSQL
     DTOs, validação e tratamento global de erros
```

O frontend é organizado por páginas, componentes reutilizáveis, cliente HTTP e dados de demonstração:

```text
frontend/src/
├── api/          # cliente da API e resolução de mídia
├── components/   # navegação e componentes de interface
├── lib/          # dados e utilitários
└── pages/        # fluxos de produto
```

As notificações usam SSE: o navegador mantém uma conexão aberta com `/notificacoes/stream`, e o backend publica eventos direcionados ao usuário quando uma mensagem ou avaliação é criada.

## Executando localmente

### Pré-requisitos

- Java 21
- Node.js 20+
- PostgreSQL 14+
- Git

### 1. Banco de dados

Crie um banco PostgreSQL:

```sql
CREATE DATABASE campus_dev;
```

### 2. Variáveis de ambiente

Copie o exemplo e configure seus valores:

```bash
cp .env.example .env
```

As variáveis usadas pelo backend são:

```text
DB_USERNAME=postgres
DB_PASSWORD=sua-senha
DB_URL=jdbc:postgresql://localhost:5432/campus_dev
JWT_SECRET=uma-chave-secreta-com-pelo-menos-32-caracteres
PORT=8080
```

O Flyway executa as migrations automaticamente ao iniciar a aplicação.

### 3. Backend

Linux/macOS:

```bash
./mvnw spring-boot:run
```

Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

A API ficará disponível em `http://localhost:8080`.

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

A interface ficará disponível em `http://localhost:5173`.

Para validar antes de publicar:

```bash
npm run lint
npm run build
```

## Documentação da API

Com o backend em execução:

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- Health check: `http://localhost:8080/health`

Principais grupos de endpoints:

```text
/api/login
/api/register
/projetos
/candidaturas
/desenvolvedores
/clientes
/media/upload
/mensagens/diretas
/desenvolvedores/{id}/recomendacoes
/notificacoes/stream
```

## Fluxo principal

1. A empresa cria um projeto e informa as habilidades necessárias.
2. Estudantes encontram a oportunidade no feed e se candidatam.
3. A empresa seleciona participantes e forma a equipe.
4. O grupo utiliza o chat do projeto para colaboração.
5. O perfil público apresenta portfólio, avaliações e disponibilidade.
6. Usuários podem enviar mensagens diretas e receber notificações em tempo real.

## Branches

- `master`: versão estável, adequada para demonstração e publicação.
- `development`: integração de novas funcionalidades antes de chegarem à versão estável.

Fluxo recomendado:

```bash
git checkout development
# desenvolver e validar
npm run lint
npm run build
# abrir pull request para master
```

## Segurança e privacidade

Não commite senhas, tokens JWT, URLs privadas de banco ou arquivos `.env`. Use `.env.example` como referência e configure os segredos no ambiente de deploy. Para produção em múltiplas instâncias, o hub SSE em memória deve ser substituído por um broker compartilhado, como Redis Pub/Sub.

## Status do projeto

Projeto acadêmico e de portfólio em evolução. A base atual prioriza o fluxo principal do marketplace, a apresentação profissional dos perfis e a experiência de comunicação entre participantes.

## Licença

Distribuído sob a licença MIT. Consulte o arquivo `LICENSE`.
