const request = require('supertest');
const app = require('../src/app');
const { initDb } = require('../src/db/database');

beforeAll(() => {
  initDb();
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

  it('POST /api/users deve rejeitar e-mail invalido', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Teste', email: 'email-invalido' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('e-mail');
  });

  it('POST /api/missions deve cadastrar missao', async () => {
    const res = await request(app)
      .post('/api/missions')
      .send({ title: 'Missao de teste', points: 15 });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Missao de teste');
    expect(res.body.points).toBe(15);
  });

  it('DELETE /api/missions/:id deve excluir missao ativa', async () => {
    const createRes = await request(app)
      .post('/api/missions')
      .send({ title: 'Missao para excluir', points: 5 });

    const deleteRes = await request(app).delete(`/api/missions/${createRes.body.id}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toContain('exclu');

    const listRes = await request(app).get('/api/missions');
    const deletedMission = listRes.body.find((mission) => mission.id === createRes.body.id);

    expect(deletedMission).toBeUndefined();
  });
});
