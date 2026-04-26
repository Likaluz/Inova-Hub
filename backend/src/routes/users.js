const express = require('express');
const { run, all, get } = require('../db/database');
const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isValidEmail(email) {
  return typeof email === 'string' && emailRegex.test(email.trim());
}

router.post('/', async (req, res, next) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();

    if (!name) {
      return res.status(400).json({ error: 'Nome é obrigatório.' });
    }

    if (!email) {
      return res.status(400).json({ error: 'E-mail é obrigatório.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Digite um e-mail válido. Exemplo: lucas@email.com' });
    }

    const result = await run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    const user = await get('SELECT * FROM users WHERE id = ?', [result.id]);
    res.status(201).json(user);
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Este e-mail já está cadastrado. Use outro e-mail.' });
    }
    next(err);
  }
});

router.get('/', async (_req, res, next) => {
  try {
    res.json(await all('SELECT * FROM users ORDER BY created_at DESC'));
  } catch (err) {
    next(err);
  }
});

router.get('/ranking', async (_req, res, next) => {
  try {
    res.json(await all('SELECT id, name, points FROM users ORDER BY points DESC, name ASC LIMIT 10'));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
