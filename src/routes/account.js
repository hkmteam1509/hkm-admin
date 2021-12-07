const express = require('express');
const passport = require('passport');
const router = express.Router();

const AccountController = require('../controllers/AccountController');

router.get("/logout", AccountController.logout);
router.post("/login",  
    passport.authenticate('local',
    { 
        successRedirect: '/',
        failureRedirect: '/account/login',
        failureFlash: true 
    }),
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
router.get('/:foo', function(req, res){
    res.status(404);
    console.log("here");
    res.render('404', {
        layout:false,
    });
})

module.exports = router;
