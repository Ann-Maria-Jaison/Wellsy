const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

// Get all resources
router.get('/', auth, async (req, res) => {
  try {
    const resources = await db.query('SELECT * FROM resources');
    res.json(resources.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get resources by category
router.get('/category/:category', auth, async (req, res) => {
  try {
    const { category } = req.params;
    const resources = await db.query(
      'SELECT * FROM resources WHERE category = $1',
      [category]
    );
    res.json(resources.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search resources
router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    const resources = await db.query(
      `SELECT * FROM resources 
      WHERE title ILIKE $1 
      OR description ILIKE $1`,
      [`%${query}%`]
    );
    res.json(resources.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 