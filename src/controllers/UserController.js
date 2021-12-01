class UserController{

    //[GET] /
    allUser(req, res, next){
        res.render('user/all-user');
    }

    //[GET] /:role/:id
    viewProfile(req, res, next){
        const role = req.params.role;
        const id = req.params.role;
        if(role === "admin"){
            res.render("user/view-admin");
        }
        else if(role === "guest"){
            res.render("user/view-guest");
        }else{
            next();
        }
    }

}

module.exports = new UserController;