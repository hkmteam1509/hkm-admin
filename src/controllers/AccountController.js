class AccountController{

    //[GET] /login
    login(req, res, next){
        res.render('account/login', {
            layout:false,
        });
    }

    //[GET] /register
    register(req, res, next){
        res.render('account/register', {
            layout:false,
        });
    }

    //[GET] /password-recovery
    passwordRecovery(req, res, next){
        res.render('account/password-recovery', {
            layout:false,
        });
    }

}

module.exports = new AccountController;