# Inova Hub React

O frontend do Inova Hub foi remodelado como uma aplicacao React + Vite, com nova interface para login/cadastro, painel de participacao, missoes, ideias, chat e ranking.

O backend Express continua responsavel pelas APIs, Swagger, SQLite e por servir o build final do React em `http://localhost:3000`.

## Estrutura principal

```text
frontend/
|-- index.html
|-- package.json
|-- package-lock.json
`-- src/
    |-- App.jsx
    |-- main.jsx
    `-- styles.css
```

## Como executar

```bash
npm install
npm start
```

O comando `npm start` executa o build do React antes de iniciar a API, entao o site fica disponivel em:

```text
http://localhost:3000
```

## Desenvolvimento

Frontend com hot reload:

```bash
npm run dev
```

API em modo desenvolvimento:

```bash
npm run dev:api
```

Testes do backend:

```bash
npm test
```
