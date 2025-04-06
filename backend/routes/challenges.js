const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

// Get all challenges
router.get('/', auth, async (req, res) => {
  try {
    const challenges = await db.query('SELECT * FROM challenges');
    res.json(challenges.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's active challenges
router.get('/active', auth, async (req, res) => {
  try {
    const activeChallenges = await db.query(
      `SELECT 
        c.*,
        uc.progress,
        uc.status,
        uc.start_date,
        uc.end_date
      FROM challenges c
      JOIN user_challenges uc ON c.id = uc.challenge_id
      WHERE uc.user_id = $1 AND uc.status = 'active'`,
      [req.user.id]
    );
    res.json(activeChallenges.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Join a challenge
router.post('/join/:challengeId', auth, async (req, res) => {
  try {
    const { challengeId } = req.params;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // Set end date to 7 days from now

    const newUserChallenge = await db.query(
      `INSERT INTO user_challenges 
        (user_id, challenge_id, end_date) 
      VALUES ($1, $2, $3) 
      RETURNING *`,
      [req.user.id, challengeId, endDate]
    );
    res.status(201).json(newUserChallenge.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update challenge progress
router.put('/progress/:challengeId', auth, async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { progress } = req.body;

    const updatedChallenge = await db.query(
      `UPDATE user_challenges 
      SET progress = $1,
          status = CASE 
            WHEN $1 >= (
              SELECT total_days 
              FROM challenges 
              WHERE id = $2
            ) THEN 'completed'
            ELSE 'active'
          END
      WHERE user_id = $3 AND challenge_id = $2
      RETURNING *`,
      [progress, challengeId, req.user.id]
    );

    if (updatedChallenge.rows.length === 0) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json(updatedChallenge.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 