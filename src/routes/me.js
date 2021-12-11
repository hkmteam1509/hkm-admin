const express = require('express');
const router = express.Router();

const MeController = require('../controllers/MeController');

router.get('/notifications', MeController.notifications);
router.get('/change-password', MeController.changePassword);
router.put('/change-password', MeController.updatePassword);
router.get('/profile', MeController.profile);
router.put('/profile', MeController.updateProfile);
module.exports = router;
