const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

// Get user's mood entries
router.get('/', auth, async (req, res) => {
  try {
    const moodEntries = await db.query(
      'SELECT * FROM mood_entries WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(moodEntries.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new mood entry
router.post('/', auth, async (req, res) => {
  try {
    const { mood_level, stress_level, notes } = req.body;
    const newEntry = await db.query(
      'INSERT INTO mood_entries (user_id, mood_level, stress_level, notes) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, mood_level, stress_level, notes]
    );
    res.status(201).json(newEntry.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get weekly mood data
router.get('/weekly', auth, async (req, res) => {
  try {
    const weeklyMood = await db.query(
      `SELECT 
        DATE(created_at) as date,
        ROUND(AVG(mood_level)::numeric, 2) as average_mood
      FROM mood_entries
      WHERE user_id = $1
        AND created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC`,
      [req.user.id]
    );
    res.json(weeklyMood.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 