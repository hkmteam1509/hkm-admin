class MeController{

    //[GET] /profile
    profile(req, res, next){
        res.render('me/profile');
    }

    //[GET] /change-password
    changePassword(req, res, next){
        res.render('me/change-password', {
            layout:false,
        });
    }
    //[GET] /notifications
    notifications(req, res, next){
        res.render('me/notifications');
    }

}

module.exports = new MeController;