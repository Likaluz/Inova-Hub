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

const frontendCandidates = [
  path.join(__dirname, '../../frontend/dist'),
  path.join(__dirname, '../frontend/dist'),
  path.join(process.cwd(), 'frontend/dist'),
  path.join(process.cwd(), '../frontend/dist')
];
const frontendPath = frontendCandidates.find((candidate) => fs.existsSync(path.join(candidate, 'index.html')));

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/users', users);
app.use('/api/ideas', ideas);
app.use('/api/missions', missions);
app.use('/api/chat', chat);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'inovahub-api' });
});

if (frontendPath) {
  app.use(express.static(frontendPath));

  app.get(['/', '/dashboard', '/dashboard.html', '/courses', '/chat', '/chat.html', '/ranking', '/ranking.html'], (_req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.status(404).json({ error: 'Build do frontend React não encontrado. Execute npm run build.' });
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno no servidor.' });
});

module.exports = app;
