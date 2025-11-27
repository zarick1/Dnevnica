const express = require('express');
const {
  createAd,
  getAllAds,
  getAdById,
} = require('../controllers/adsController');

const router = express.Router();

router.route('/').get(getAllAds).post(createAd);

router.route('/:id').get(getAdById);

module.exports = router;
