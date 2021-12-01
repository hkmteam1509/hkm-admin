const express = require('express');
const router = express.Router();

const MeController = require('../controllers/MeController');

router.get('/notifications', MeController.notifications);
router.get('/change-password', MeController.changePassword);
router.get('/profile', MeController.profile);

module.exports = router;
