const express = require('express');
const { createAd } = require('../controllers/adsController');

const router = express.Router();

router.route('/').post(createAd);

module.exports = router;
