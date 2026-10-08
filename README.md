# CampusDev

API REST para conectar clientes que possuem projetos de software a desenvolvedores.

## Arquitetura

O backend usa Spring Boot 3.3, Java 21, Spring Security/JWT, JPA, PostgreSQL e Flyway.
O fluxo principal é `Controller -> Service -> Repository`, com DTOs, validação,
tratamento global de erros e migrations versionadas. O frontend está em
`frontend/` e usa React, Vite e Tailwind.

## Executar

Configure as variáveis:

```text
DB_USERNAME=usuario_do_postgresql
DB_PASSWORD=senha_do_postgresql
DB_URL=jdbc:postgresql://localhost:5432/campus_dev
JWT_SECRET=uma_chave_secreta_forte
FRONTEND_URL=http://localhost:5173
```

No PowerShell do Windows, por exemplo:

```powershell
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="sua-senha"
$env:DB_URL="jdbc:postgresql://localhost:5432/campus_dev"
$env:JWT_SECRET="uma-chave-secreta-com-pelo-menos-32-caracteres"
$env:FRONTEND_URL="http://localhost:5173"
```

Backend (Java 17 no ambiente atual):

```bash
./mvnw.cmd -Dmaven.compiler.release=17 spring-boot:run
```

Banco:

O projeto usa PostgreSQL. Crie o banco `campus_dev` e forneça as credenciais
nas variáveis de ambiente; o Flyway executa as migrations PostgreSQL
automaticamente ao iniciar.

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## API

Com a aplicação em execução, a documentação OpenAPI está disponível em
`/swagger-ui.html` e o contrato em `/v3/api-docs`.

No Swagger, use o botão **Authorize** e informe `Bearer <token>` para testar
as rotas protegidas. Respostas de validação usam HTTP 400; recursos ausentes
usam 404; conflitos de regra de negócio usam 409; token ausente, inválido ou
expirado usa 401; e role insuficiente usa 403.

Endpoints principais: `/api/login`, `/api/register`, `/usuarios`,
`/clientes`, `/desenvolvedores`, `/projetos` e `/candidaturas`.

## Fluxo de negócio

Cliente cria um projeto aberto, desenvolvedores se candidatam, o cliente decide
as candidaturas, o matching ordena desenvolvedores por competências e o projeto
segue pelas transições `ABERTO -> EM_SELECAO -> EM_ANDAMENTO -> FINALIZADO`.
