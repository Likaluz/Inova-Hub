const request = require('supertest');
const app = require('../src/app');
const { initDb } = require('../src/db/database');

beforeAll(() => {
  initDb();
  it('POST /api/missions deve cadastrar missão', async () => {
    const res = await request(app)
      .post('/api/missions')
      .send({ title: 'Missão de teste', points: 15 });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Missão de teste');
    expect(res.body.points).toBe(15);
  });

});

describe('InovaHub API', () => {
  it('GET /health deve retornar ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('POST /api/chat deve responder mensagem', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'Como participar?' });

    expect(res.status).toBe(200);
    expect(res.body.answer).toContain('participar');
  });

  it('POST /api/users deve rejeitar e-mail inválido', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Teste', email: 'email-invalido' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('e-mail válido');
  });
  it('POST /api/missions deve cadastrar missão', async () => {
    const res = await request(app)
      .post('/api/missions')
      .send({ title: 'Missão de teste', points: 15 });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Missão de teste');
    expect(res.body.points).toBe(15);
  });

});
