const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      status: 'ok',
      time: result.rows[0].now,
    });
  } catch (err) {
    console.error('DataBase check error: ', err);

    res.status(500).json({
      status: 'error',
      message: 'Cannot open database',
    });
  }
});

module.exports = router;
