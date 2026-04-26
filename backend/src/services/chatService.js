function answerQuestion(message = '') {
  const text = message.toLowerCase();
  if (text.includes('inov')) return 'Inovação é criar novas soluções para melhorar processos, produtos ou serviços.';
  if (text.includes('participar')) return 'Você pode participar cumprindo missões e enviando ideias pela plataforma.';
  if (text.includes('treinamento')) return 'Treinamentos ajudam os colaboradores a desenvolver pensamento inovador.';
  if (text.includes('ideia')) return 'Cadastre sua ideia com título, descrição e acompanhe o status pelo dashboard.';
  return 'Não entendi. Tente perguntar sobre inovação, ideias, treinamentos ou participação.';
}

module.exports = { answerQuestion };
