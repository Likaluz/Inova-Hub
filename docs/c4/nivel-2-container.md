# Diagrama C4 - Nível 2 - Containers

Este diagrama apresenta os principais containers da solução **InovaHub**.

```mermaid
C4Container
    title InovaHub - Nível 2 - Containers

    Person(usuario, "Usuário / Participante", "Utiliza cadastro, login por ID, dashboard, ideias, cadastro de missões, conclusão de missões, chat e ranking.")
    Person(avaliador, "Professor / Avaliador", "Consulta Swagger, README, diagramas e testes.")

    System_Boundary(inovahub, "InovaHub") {
        Container(frontend, "Frontend Web", "HTML, CSS e JavaScript", "Interface web com tela de cadastro, login por ID, dashboard, ideias, cadastro de missões, conclusão de missões, chat e ranking.")
        Container(api, "API Backend", "Node.js + Express", "API REST responsável pelos contratos, validações, regras de negócio e integração com banco.")
        ContainerDb(sqlite, "Banco de Dados", "SQLite", "Armazena usuários, e-mails, pontuação, ideias, missões e status.")
        Container(swagger, "Swagger UI", "OpenAPI / Swagger", "Documentação interativa dos contratos da API.")
        Container(testes, "Projeto de Testes", "Vitest + Supertest", "Testes unitários e de integração das rotas e serviços.")
    }

    Rel(usuario, frontend, "Acessa", "Navegador")
    Rel(frontend, api, "Consome endpoints", "HTTP/JSON via Fetch API")
    Rel(api, sqlite, "Lê e grava dados", "SQL")
    Rel(avaliador, swagger, "Consulta e executa contratos", "Navegador")
    Rel(swagger, api, "Documenta e testa endpoints", "HTTP/JSON")
    Rel(avaliador, testes, "Executa", "npm test")
    Rel(testes, api, "Valida rotas e regras", "Supertest")
```

## Containers

### Frontend Web

Responsável pela interface do usuário.

Telas principais:

- `index.html`: tela inicial com cadastro e login;
- `dashboard.html`: tela principal do usuário após login;
- telas/seções de ideias, missões, chat e ranking.

O login do frontend usa o **ID do usuário** criado no cadastro ou retornado pelo Swagger.

### API Backend

Responsável pelas rotas REST:

- `/api/users`
- `/api/users/ranking`
- `/api/ideas`
- `/api/missions`
- `/api/chat`
- `/health`
- `/api-docs`

### Banco SQLite

Banco local usado para persistência dos dados do projeto.

Armazena:

- usuários;
- e-mails;
- pontuação;
- ideias;
- missões;
- status das ideias.

### Swagger UI

Interface para consultar e testar os contratos da API.

Disponível em:

```text
http://localhost:3000/api-docs
```

### Projeto de Testes

Executado com:

```bash
npm test
```

Contempla testes unitários e de integração.
