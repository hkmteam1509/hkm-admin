const express = require('express');
const passport = require('passport');
const router = express.Router();

const AccountController = require('../controllers/AccountController');

router.get("/logout", AccountController.logout);
router.post("/login",  
    passport.authenticate('local'),
    function(req, res) {
        if(req.user){
            res.redirect("/");
        }else{
            res.redirect("/account/login");
        }
    });
router.get('/login', AccountController.login);
router.get('/register', AccountController.register);
router.get('/password-recovery', AccountController.passwordRecovery);


module.exports = router;
