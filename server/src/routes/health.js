const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'Dnevnica API is running',
    app: 'Dnevnica',
  });
});

module.exports = router;
