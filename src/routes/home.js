const express = require('express');
const router = express.Router();

const HomeController = require('../controllers/HomeController');

router.get('/statitics', HomeController.getStatitic);
router.get('/best-selling', HomeController.getBestSelling);
router.get('/', HomeController.index);


module.exports = router;
