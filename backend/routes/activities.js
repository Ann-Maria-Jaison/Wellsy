const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

// Get user's activities
router.get('/', auth, async (req, res) => {
  try {
    const activities = await db.query(
      'SELECT * FROM activities WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(activities.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new activity
router.post('/', auth, async (req, res) => {
  try {
    const { name, hours, mood, notes } = req.body;
    const newActivity = await db.query(
      'INSERT INTO activities (user_id, name, hours, mood, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, name, hours, mood, notes]
    );
    res.status(201).json(newActivity.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get activity summary
router.get('/summary', auth, async (req, res) => {
  try {
    const summary = await db.query(
      `SELECT 
        name,
        COUNT(*) as frequency,
        ROUND(AVG(mood)::numeric, 2) as average_mood,
        SUM(hours) as total_hours
      FROM activities
      WHERE user_id = $1
      GROUP BY name
      ORDER BY frequency DESC`,
      [req.user.id]
    );
    res.json(summary.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 