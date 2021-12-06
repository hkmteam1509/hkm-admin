class UserController{

    //[GET] /
    allUser(req, res, next){
        //Đọc database lấy thông tin user rồi nhét vô hbs

        

        res.render('user/all-user');
    }

    //[GET] /:role/:id
    viewProfile(req, res, next){
        const role = req.params.role;
        const id = req.params.role;
        if(role === "admin"){
            //Xem thông tin chi tiết:
            //dựa vào id để lấy ra thông tin của user tương ứng r nhét vô hbs
            res.render("user/view-admin");
        }
        else if(role === "guest"){
            //Xem thông tin chi tiết:
            //dựa vào id để lấy ra thông tin của user tương ứng r nhét vô hbs
            res.render("user/view-guest");
        }else{
            next();
        }
    }

}

module.exports = new UserController;