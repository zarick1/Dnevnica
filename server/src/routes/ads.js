const express = require('express');
const {
  createAd,
  getAllAds,
  getAdById,
  updateAd,
  deleteAd,
} = require('../controllers/adsController');

const router = express.Router();

router.route('/').get(getAllAds).post(createAd);

router.route('/:id').get(getAdById).patch(updateAd).delete(deleteAd);

module.exports = router;
