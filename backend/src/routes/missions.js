const express = require('express');
const { all, run, get } = require('../db/database');
const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const missions = await all('SELECT * FROM missions WHERE active = 1 ORDER BY id');
    res.json(missions);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, points } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Título da missão é obrigatório.' });
    }

    const numericPoints = Number(points);

    if (!Number.isInteger(numericPoints) || numericPoints <= 0) {
      return res.status(400).json({ error: 'Pontos da missão devem ser um número inteiro maior que zero.' });
    }

    const result = await run(
      'INSERT INTO missions (title, points, active) VALUES (?, ?, 1)',
      [String(title).trim(), numericPoints]
    );

    const mission = await get('SELECT * FROM missions WHERE id = ?', [result.id]);

    res.status(201).json(mission);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/complete', async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório.' });
    }

    const user = await get('SELECT * FROM users WHERE id = ?', [userId]);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const mission = await get('SELECT * FROM missions WHERE id = ? AND active = 1', [req.params.id]);

    if (!mission) {
      return res.status(404).json({ error: 'Missão não encontrada.' });
    }

    await run('UPDATE users SET points = points + ? WHERE id = ?', [mission.points, userId]);

    const updatedUser = await get('SELECT id, name, email, points FROM users WHERE id = ?', [userId]);

    res.json({
      message: 'Missão concluída.',
      pointsAdded: mission.points,
      user: updatedUser
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
