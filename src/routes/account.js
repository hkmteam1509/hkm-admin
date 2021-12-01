const express = require('express');
const router = express.Router();

const AccountController = require('../controllers/AccountController');

router.get('/login', AccountController.login);
router.get('/register', AccountController.register);
router.get('/password-recovery', AccountController.passwordRecovery);


module.exports = router;
