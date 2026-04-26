const express = require('express');
const { run, all, get } = require('../db/database');
const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { userId, title, description } = req.body;
    if (!userId || !title || !description) {
      return res.status(400).json({ error: 'userId, title e description são obrigatórios.' });
    }
    const result = await run('INSERT INTO ideas (user_id, title, description) VALUES (?, ?, ?)', [userId, title, description]);
    await run('UPDATE users SET points = points + 10 WHERE id = ?', [userId]);
    const idea = await get('SELECT * FROM ideas WHERE id = ?', [result.id]);
    res.status(201).json(idea);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (_req, res, next) => {
  try {
    res.json(await all(`SELECT ideas.*, users.name AS user_name
      FROM ideas INNER JOIN users ON users.id = ideas.user_id
      ORDER BY ideas.created_at DESC`));
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status é obrigatório.' });
    await run('UPDATE ideas SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json(await get('SELECT * FROM ideas WHERE id = ?', [req.params.id]));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
