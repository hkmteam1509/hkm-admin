class HomeController{

    //[GET] /
    index(req, res, next){
        res.render('home');
    }

    //[404]
    error404(req, res,next){
        res.render("404");
    }

}

module.exports = new HomeController;