# Contribuindo

Obrigado por contribuir com o CampusDev Platform.

## Fluxo de trabalho

1. Crie ou escolha uma issue descrevendo a mudança.
2. Trabalhe a partir de `development`.
3. Mantenha commits pequenos e descritivos.
4. Rode `npm run lint`, `npm run build` e `./mvnw -DskipTests package` antes de abrir o pull request.
5. Abra o pull request de `development` para `master` somente quando a funcionalidade estiver revisada.

## Convenção de commits

Prefira mensagens no formato Conventional Commits:

```text
feat: adiciona mensagens diretas
fix: corrige validação de upload
chore: atualiza dependências
docs: melhora instruções de setup
```

## Cuidados

- Nunca envie `.env`, tokens, senhas ou dados reais de usuários.
- Migrations novas devem ser versionadas em `src/main/resources/db/migration/postgresql`.
- Mudanças de contrato da API devem atualizar o README ou a documentação OpenAPI.
