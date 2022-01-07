const bcrypt = require('bcrypt');
const { SALT_BCRYPT } = require("../config/app");
const IsEmail = require("isemail");
const UserService = require('../services/UserService');

class AccountController{
    //[GET] /login
    login(req, res, next){
        res.render('account/login', {
            layout:false,
            message: req.flash('error'),
        });
    }

    logout(req, res, next){
        req.logout();
        res.redirect('/');
    }

    //[GET] /register
    register(req, res, next){
        res.render('account/register', {
            layout:false,
        });
    }

    //[POST] /register
    createNewAccout(req, res, next){
        if(req.body){
           

        }else{
            next();
        }
    }

    //[GET] /password-recovery
    passwordRecovery(req, res, next){
        res.render('account/password-recovery', {
            layout:false,
        });
    }

    checkUsername(req,res,next){
        const {username} = req.body;
        UserService.findAccount(username)
        .then(result=>{
            if(result){
                res.status(200).json({isExisted: true});
            }else{
                res.status(200).json({isExisted: false});
            }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({msg: "Bad request"});
        })
    }

}

module.exports = new AccountController;