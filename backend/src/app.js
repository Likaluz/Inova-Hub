const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const fs = require('fs');

const users = require('./routes/users');
const ideas = require('./routes/ideas');
const missions = require('./routes/missions');
const chat = require('./routes/chat');

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

// Procura a pasta frontend automaticamente, mesmo se o projeto for aberto pela raiz ou pelo backend.
const frontendCandidates = [
  path.join(__dirname, '../../frontend'),
  path.join(__dirname, '../frontend'),
  path.join(process.cwd(), 'frontend'),
  path.join(process.cwd(), '../frontend')
];
const frontendPath = frontendCandidates.find((candidate) => fs.existsSync(path.join(candidate, 'index.html')));

app.use(cors());
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// APIs
app.use('/api/users', users);
app.use('/api/ideas', ideas);
app.use('/api/missions', missions);
app.use('/api/chat', chat);

// Health
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'inovahub-api' });
});

// Frontend no mesmo localhost:3000
if (frontendPath) {
  app.use(express.static(frontendPath));

  app.get('/', (_req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });

  app.get(['/dashboard', '/dashboard.html'], (_req, res) => {
    res.sendFile(path.join(frontendPath, 'dashboard.html'));
  });

  app.get(['/chat', '/chat.html'], (_req, res) => {
    res.sendFile(path.join(frontendPath, 'chat.html'));
  });

  app.get(['/ranking', '/ranking.html'], (_req, res) => {
    res.sendFile(path.join(frontendPath, 'ranking.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.status(404).json({ error: 'Pasta frontend não encontrada.' });
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno no servidor.' });
});

module.exports = app;
