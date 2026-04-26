# Diagrama C4 - Nível 3 - Componentes

Este diagrama detalha os principais componentes internos do backend do **InovaHub**.

```mermaid
C4Component
    title InovaHub - Nível 3 - Componentes do Backend

    Container_Boundary(api, "API Backend - Node.js + Express") {
        Component(app, "App Express", "Express", "Configura middlewares, Swagger, rotas da API, health check e frontend estático.")
        Component(corsJson, "Middlewares", "CORS + express.json", "Habilita consumo da API pelo frontend e leitura de JSON.")
        Component(staticFrontend, "Frontend Static Routes", "Express Static", "Serve index.html, dashboard.html e demais arquivos do frontend no localhost:3000.")
        Component(swaggerComponent, "Swagger Component", "swagger-ui-express + yamljs", "Carrega swagger.yaml e expõe /api-docs.")
        Component(usersRoutes, "Users Routes", "Express Router", "Criação de usuário, validação de e-mail, listagem e ranking.")
        Component(ideasRoutes, "Ideas Routes", "Express Router", "Cadastro, listagem e atualização de status de ideias.")
        Component(missionsRoutes, "Missions Routes", "Express Router", "Cadastro, listagem e conclusão de missões com acréscimo de pontos.")
        Component(chatRoutes, "Chat Routes", "Express Router", "Recebe mensagens e retorna resposta automática.")
        Component(chatService, "Chat Service", "JavaScript Service", "Contém a regra simples de resposta do chat.")
        Component(databaseModule, "Database Module", "sqlite3", "Inicializa tabelas e disponibiliza funções run, get e all.")
    }

    ContainerDb(sqlite, "SQLite", "Banco local", "Persistência de usuários, ideias, missões e pontuação.")
    Container(testes, "Testes", "Vitest + Supertest", "Valida serviços e endpoints da API.")

    Rel(app, corsJson, "Utiliza")
    Rel(app, staticFrontend, "Serve frontend")
    Rel(app, swaggerComponent, "Expõe documentação")
    Rel(app, usersRoutes, "Registra rota /api/users")
    Rel(app, ideasRoutes, "Registra rota /api/ideas")
    Rel(app, missionsRoutes, "Registra rota /api/missions")
    Rel(app, chatRoutes, "Registra rota /api/chat")

    Rel(usersRoutes, databaseModule, "Cria, consulta e ranqueia usuários")
    Rel(ideasRoutes, databaseModule, "Cria, consulta e altera ideias")
    Rel(missionsRoutes, databaseModule, "Consulta missões e atualiza pontuação")
    Rel(chatRoutes, chatService, "Solicita resposta")
    Rel(databaseModule, sqlite, "Executa SQL")
    Rel(testes, app, "Executa testes de integração")
    Rel(testes, chatService, "Executa testes unitários")
```

## Componentes principais

### App Express

Arquivo principal da aplicação backend. Ele configura:

- CORS;
- leitura de JSON;
- Swagger;
- rotas da API;
- health check;
- frontend estático;
- tratamento de erros.

### Users Routes

Responsável por:

- cadastrar usuário;
- validar nome obrigatório;
- validar e-mail;
- impedir e-mail duplicado;
- listar usuários;
- listar ranking.

Endpoints:

```text
POST /api/users
GET /api/users
GET /api/users/ranking
```

### Ideas Routes

Responsável por:

- cadastrar ideias;
- listar ideias;
- atualizar status;
- adicionar pontos ao usuário ao cadastrar ideia.

Endpoints:

```text
POST /api/ideas
GET /api/ideas
PATCH /api/ideas/{id}/status
```

### Missions Routes

Responsável por:

- cadastrar novas missões;
- listar missões ativas;
- concluir missão;
- adicionar pontos ao usuário.

Endpoints:

```text
GET /api/missions
POST /api/missions
POST /api/missions/{id}/complete
```

### Chat Routes e Chat Service

Responsáveis por receber uma mensagem e devolver uma resposta automática.

Endpoint:

```text
POST /api/chat
```

### Database Module

Responsável por:

- conectar ao SQLite;
- criar tabelas;
- inicializar missão padrão;
- disponibilizar funções de consulta e gravação.

Tabelas principais:

- `users`
- `ideas`
- `missions`

### Testes

O projeto utiliza:

- **Vitest** para execução dos testes;
- **Supertest** para testes de integração das APIs.

Execução:

```bash
npm test
```
