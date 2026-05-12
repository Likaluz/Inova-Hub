# Inova Hub

O **Inova Hub** e uma plataforma web para gestao de inovacao. O sistema permite cadastrar usuarios, registrar ideias, criar e concluir missoes, acompanhar ranking, conversar com um assistente simulado e organizar cursos em PDF ou video.

Esta versao foi atualizada com um novo frontend em **React + Vite**, mantendo o backend em **Node.js + Express + SQLite**.

## Funcionalidades

- Cadastro de usuarios com nome e e-mail.
- Login simples por ID do usuario.
- Dashboard com dados do participante, pontuacao, ideias e missoes.
- Cadastro de ideias de inovacao com ganho de pontos.
- Cadastro e conclusao de missoes.
- Ranking de usuarios por pontuacao.
- Chat com resposta automatica.
- Aba de cursos com materiais em PDF ou video.
- Documentacao Swagger das APIs.
- Testes automatizados do backend.
- Diagramas C4 em `docs/c4`.

## Tecnologias

### Frontend

- React
- Vite
- CSS
- Lucide React
- Fetch API
- LocalStorage para a biblioteca de cursos

### Backend

- Node.js
- Express
- SQLite
- Swagger UI
- YAMLJS
- CORS

### Testes

- Vitest
- Supertest

## Estrutura do projeto

```text
Inova-Hub/
|-- backend/
|   |-- src/
|   |   |-- app.js
|   |   |-- server.js
|   |   |-- db/
|   |   |   `-- database.js
|   |   |-- routes/
|   |   |   |-- chat.js
|   |   |   |-- ideas.js
|   |   |   |-- missions.js
|   |   |   `-- users.js
|   |   `-- services/
|   |       `-- chatService.js
|   |-- tests/
|   |   |-- api.test.js
|   |   `-- chatService.test.js
|   |-- package.json
|   `-- swagger.yaml
|-- frontend/
|   |-- index.html
|   |-- package.json
|   |-- src/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   `-- styles.css
|   `-- dist/
|-- docs/
|   `-- c4/
|-- package.json
|-- README.md
`-- README-REACT.md
```

## Como executar

### Pre-requisitos

- Node.js
- npm

Verifique as versoes instaladas:

```bash
node -v
npm -v
```

### Instalar dependencias

Na pasta raiz do projeto:

```bash
npm install
```

Esse comando instala as dependencias da raiz, do backend e do frontend.

### Rodar a aplicacao completa

```bash
npm start
```

O comando executa o build do React e inicia o backend Express.

Acesse:

```text
http://localhost:3000
```

## Desenvolvimento

Rodar apenas o frontend com hot reload:

```bash
npm run dev
```

Rodar apenas a API em modo desenvolvimento:

```bash
npm run dev:api
```

Gerar build do frontend:

```bash
npm run build
```

Executar testes:

```bash
npm test
```

## URLs principais

```text
Frontend:    http://localhost:3000
Dashboard:   http://localhost:3000/dashboard
Cursos:      http://localhost:3000/courses
Chat:        http://localhost:3000/chat
Ranking:     http://localhost:3000/ranking
Swagger:     http://localhost:3000/api-docs
Health API:  http://localhost:3000/health
```

Resposta esperada do health check:

```json
{
  "status": "ok",
  "service": "inovahub-api"
}
```

## Modulos da aplicacao

### Usuarios

Permite criar usuarios e consultar participantes cadastrados.

Endpoints:

```text
GET /api/users
POST /api/users
GET /api/users/ranking
```

Exemplo de criacao:

```json
{
  "name": "Lucas Domingues",
  "email": "lucas@email.com"
}
```

### Ideias

Permite cadastrar e listar ideias de inovacao. Ao cadastrar uma ideia, o usuario ganha 10 pontos.

Endpoints:

```text
GET /api/ideas
POST /api/ideas
PATCH /api/ideas/:id/status
```

### Missoes

Permite criar missoes, listar missoes ativas e concluir uma missao para somar pontos ao usuario.

Endpoints:

```text
GET /api/missions
POST /api/missions
POST /api/missions/:id/complete
DELETE /api/missions/:id
```

### Chat

Permite enviar mensagens para o assistente simulado do Inova Hub.

Endpoint:

```text
POST /api/chat
```

### Cursos

A aba de cursos fica no frontend em React. Ela permite cadastrar materiais por link, marcando cada item como PDF ou video.

Os cursos sao salvos no `localStorage` do navegador, usando a chave:

```text
inovahubCourses
```

Essa funcionalidade nao depende de endpoint no backend na versao atual.

## Como testar pelo frontend

1. Execute `npm start`.
2. Acesse `http://localhost:3000`.
3. Crie um usuario informando nome e e-mail.
4. Guarde o ID retornado ou entre automaticamente no painel.
5. No dashboard, cadastre ideias e missoes.
6. Acesse a aba Cursos para adicionar PDFs ou videos.
7. Acesse Chat para testar o assistente.
8. Acesse Ranking para consultar a pontuacao dos usuarios.

## Como testar pelo Swagger

1. Execute `npm start`.
2. Acesse `http://localhost:3000/api-docs`.
3. Abra o endpoint desejado.
4. Clique em `Try it out`.
5. Preencha os dados.
6. Clique em `Execute`.

## Banco de dados

O projeto usa SQLite local. O banco e inicializado automaticamente pelo backend e armazena:

- usuarios;
- ideias;
- missoes;
- pontuacao dos usuarios.

Arquivo principal:

```text
backend/src/db/database.js
```

## Testes

Execute:

```bash
npm test
```

A suite atual cobre:

- servico de chat;
- endpoints principais da API;
- criacao de usuario;
- validacoes basicas de integracao.

Resultado esperado:

```text
Test Files  2 passed
Tests       6 passed
```

## Diagramas C4

Os diagramas ficam em:

```text
docs/c4/
```

Arquivos:

```text
docs/c4/nivel-1-contexto.md
docs/c4/nivel-2-container.md
docs/c4/nivel-3-componentes.md
```

## Exemplos de API

Criar usuario:

```bash
curl -X POST http://localhost:3000/api/users ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Lucas Domingues\",\"email\":\"lucas@email.com\"}"
```

Listar usuarios:

```bash
curl http://localhost:3000/api/users
```

Consultar ranking:

```bash
curl http://localhost:3000/api/users/ranking
```

Enviar mensagem ao chat:

```bash
curl -X POST http://localhost:3000/api/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"Como cadastrar uma ideia?\"}"
```

## Observacoes

- O frontend antigo em HTML estatico foi substituido por React.
- O backend serve o build final de `frontend/dist`.
- Para refletir mudancas do frontend no modo producao, rode `npm run build` antes de iniciar o backend.
- A biblioteca de cursos e local ao navegador, pois utiliza `localStorage`.
