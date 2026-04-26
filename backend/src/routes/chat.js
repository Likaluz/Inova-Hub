const express = require('express');
const { answerQuestion } = require('../services/chatService');
const router = express.Router();

router.post('/', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Mensagem é obrigatória.' });
  res.json({ answer: answerQuestion(message) });
});

module.exports = router;
