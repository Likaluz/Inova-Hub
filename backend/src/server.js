const app = require('./app');
const { initDb } = require('./db/database');
const PORT = process.env.PORT || 3000;

initDb();
app.listen(PORT, () => console.log(`InovaHub API rodando em http://localhost:${PORT}`));
