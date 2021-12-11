class HomeController{

    //[GET] /
    index(req, res, next){
        if(req.user){
            res.render('home');
        }
        else{
            res.redirect("/account/login");
        }
        
    }

    //[404]
    error404(req, res,next){
        res.render("404");
    }

}

module.exports = new HomeController;