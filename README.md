# InovaHub

O **InovaHub** é uma plataforma web para gestão de inovação, permitindo o cadastro de usuários, registro de ideias, acompanhamento de missões, ranking de participantes e interação por chat.

Este projeto foi estruturado como uma entrega acadêmica contendo:

- Documentação Swagger das APIs
- Esqueleto funcional da solução
- Integração com banco de dados SQLite
- Frontend integrado ao backend
- README com instruções de execução
- Diagramas C4 níveis 1, 2 e 3 que estão localizados na pasta docs (-[Nível 1 - Contexto](docs/c4/nivel-1-contexto.md) - [Nível 2 - Containers](docs/c4/nivel-2-container.md) - [Nível 3 - Componentes](docs/c4/nivel-3-componentes.md))
- Testes unitários e de integração

---

## 1. Objetivo do projeto

O objetivo do InovaHub é oferecer uma base funcional para uma plataforma de inovação corporativa ou acadêmica, onde usuários possam:

- Criar cadastro informando nome e e-mail
- Registrar ideias de inovação
- Visualizar e concluir missões
- Ganhar pontuação por participação
- Consultar ranking de usuários
- Enviar mensagens no chat da plataforma

---

## 2. Tecnologias utilizadas

### Backend

- Node.js
- Express
- SQLite
- Swagger UI
- YAMLJS
- CORS

### Frontend

- HTML
- CSS
- JavaScript
- Integração via Fetch API

### Testes

- Vitest
- Supertest

---

## 3. Estrutura do projeto

```text
inovahub_entrega/
│
├── backend/
│   ├── database/
│   │   └── db.js
│   │
│   ├── routes/
│   │   ├── users.js
│   │   ├── ideas.js
│   │   ├── missions.js
│   │   └── chat.js
│   │
│   ├── services/
│   │   └── chatService.js
│   │
│   ├── tests/
│   │   ├── api.test.js
│   │   └── chatService.test.js
│   │
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── style.css
│   └── app.js
│
├── docs/
│   ├── c4-nivel-1-contexto.md
│   ├── c4-nivel-2-container.md
│   └── c4-nivel-3-componentes.md
│
├── swagger.yaml
├── package.json
└── README.md
```

---

## 4. Módulos da solução

O projeto possui um esqueleto funcional com os principais módulos da solução.

### 4.1 Cadastro de usuários

Permite cadastrar usuários com nome e e-mail.

Funcionalidades:

- Validação de nome obrigatório
- Validação de e-mail em formato válido
- Bloqueio de e-mails duplicados
- Integração com banco SQLite

Endpoint principal:

```text
POST /api/users
```

Exemplo de requisição:

```json
{
  "name": "Lucas Domingues",
  "email": "lucas@email.com"
}
```

---

### 4.2 Gestão de ideias

Permite cadastrar e listar ideias de inovação enviadas pelos usuários.

Funcionalidades:

- Cadastro de título da ideia
- Cadastro de descrição
- Associação da ideia a um usuário
- Consulta das ideias cadastradas

Endpoints principais:

```text
GET /api/ideas
POST /api/ideas
```

---

### 4.3 Missões

Permite cadastrar missões, visualizar missões disponíveis e registrar a conclusão de atividades.

Funcionalidades:

- Cadastro de novas missões
- Listagem de missões disponíveis
- Conclusão de missão
- Atribuição de pontos ao usuário

Endpoints principais:

```text
GET /api/missions
POST /api/missions
POST /api/missions/{id}/complete
```

---

### 4.4 Chat

Permite enviar mensagens e receber respostas simuladas da plataforma.

Funcionalidades:

- Envio de mensagens
- Resposta automática do sistema
- Serviço separado para regra de resposta

Endpoint principal:

```text
POST /api/chat
```

---

### 4.5 Ranking e relatórios

Permite visualizar a pontuação dos usuários cadastrados.

Funcionalidades:

- Listagem de usuários
- Ordenação por pontuação
- Apoio à visualização de desempenho dos participantes

Endpoint principal:

```text
GET /api/users/ranking
```

---

## 5. Como executar o projeto

### 5.1 Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- Node.js
- npm

Para verificar se estão instalados, execute:

```bash
node -v
npm -v
```

---

### 5.2 Instalar dependências

Na pasta raiz do projeto, execute:

```bash
npm install
```

Esse comando instala as dependências principais e também as dependências do backend.

---

### 5.3 Executar a aplicação

Na pasta raiz do projeto, execute:

```bash
npm start
```

Após iniciar, o sistema ficará disponível em:

```text
http://localhost:3000
```

O frontend é servido automaticamente pelo backend Express.  
Portanto, não é necessário abrir o arquivo `frontend/index.html` manualmente nem utilizar Live Server.

---

## 6. URLs principais

### Frontend

```text
http://localhost:3000
```

### Dashboard

```text
http://localhost:3000/dashboard
```

### Swagger

```text
http://localhost:3000/api-docs
```

### Health check da API

```text
http://localhost:3000/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "service": "inovahub-api"
}
```

---

## 7. Documentação Swagger

A documentação Swagger está disponível em:

```text
http://localhost:3000/api-docs
```

Nela é possível consultar e testar os contratos das APIs, incluindo:

- Usuários
- Ideias
- Missões
- Chat
- Ranking

O arquivo de configuração do Swagger está localizado em:

```text
swagger.yaml
```

---

## 8. Banco de dados

O projeto utiliza **SQLite** como banco de dados local.

A integração com banco contempla:

- Criação de usuários
- Validação de e-mails duplicados
- Cadastro e consulta de ideias
- Controle de pontuação dos usuários
- Consulta de ranking

O banco é inicializado automaticamente ao executar o projeto.

Arquivo principal de configuração:

```text
backend/database/db.js
```

---

## 9. Como testar pelo frontend

1. Execute o projeto:

```bash
npm start
```

2. Acesse:

```text
http://localhost:3000
```

3. Preencha os dados de entrada:

```text
Nome: Lucas Domingues
E-mail: lucas@email.com
```

4. Clique em **Entrar**.

5. No dashboard, teste as funcionalidades:

- Atualizar dados do usuário
- Cadastrar uma ideia
- Listar ideias
- Visualizar missões
- Cadastrar novas missões
- Concluir missão
- Enviar mensagem no chat
- Visualizar ranking

Observação: o campo de e-mail aceita apenas valores em formato válido, como:

```text
usuario@email.com
```

Valores inválidos, como `lucas`, `teste`, `123` ou `email.com`, devem ser recusados.

---

## 10. Como testar pelo Swagger

1. Execute o projeto:

```bash
npm start
```

2. Acesse:

```text
http://localhost:3000/api-docs
```

3. Abra o endpoint desejado.

4. Clique em **Try it out**.

5. Preencha o corpo da requisição.

6. Clique em **Execute**.

Exemplo para criar usuário:

```json
{
  "name": "Lucas Domingues",
  "email": "lucas@email.com"
}
```

Se o e-mail já existir no banco, utilize outro e-mail para teste, por exemplo:

```json
{
  "name": "Lucas Teste",
  "email": "lucas2@email.com"
}
```

---

## 11. Executar testes

Para executar os testes, rode o comando abaixo na pasta raiz:

```bash
npm test
```

O comando executa os testes do backend utilizando Vitest.

Resultado esperado:

```text
Test Files  passed
Tests       passed
```

Os testes contemplam:

- Testes unitários do serviço de chat
- Testes de integração das APIs
- Validação de criação de usuário
- Validação de endpoints principais

---

## 12. Diagramas C4

Os diagramas C4 da solução estão disponíveis na pasta:

```text
docs/
```

Arquivos:

```text
docs/c4-nivel-1-contexto.md
docs/c4-nivel-2-container.md
docs/c4-nivel-3-componentes.md
```

### Nível 1 — Contexto

Mostra a visão geral da solução, seus usuários e sistemas externos.

### Nível 2 — Containers

Mostra os principais blocos da aplicação:

- Frontend
- Backend API
- Banco de dados SQLite
- Swagger

### Nível 3 — Componentes

Mostra a organização interna do backend, incluindo:

- Rotas
- Serviços
- Banco de dados
- Testes

---

## 13. Endpoints principais da API

### Usuários

```text
GET /api/users
POST /api/users
GET /api/users/ranking
```

### Ideias

```text
GET /api/ideas
POST /api/ideas
```

### Missões

```text
GET /api/missions
POST /api/missions
POST /api/missions/{id}/complete
```

### Chat

```text
POST /api/chat
```

### Sistema

```text
GET /health
GET /api-docs
```

---

## 14. Exemplos de uso da API

### Criar usuário

```bash
curl -X POST http://localhost:3000/api/users ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Lucas Domingues\",\"email\":\"lucas@email.com\"}"
```

### Listar usuários

```bash
curl http://localhost:3000/api/users
```

### Consultar ranking

```bash
curl http://localhost:3000/api/users/ranking
```

### Enviar mensagem ao chat

```bash
curl -X POST http://localhost:3000/api/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"Como cadastrar uma ideia?\"}"
```

---



