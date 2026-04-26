const { answerQuestion } = require('../src/services/chatService');

describe('chatService', () => {
  it('responde perguntas sobre inovação', () => {
    expect(answerQuestion('o que é inovação?')).toContain('Inovação');
  });

  it('retorna fallback para pergunta desconhecida', () => {
    expect(answerQuestion('xyz')).toContain('Não entendi');
  });
});
