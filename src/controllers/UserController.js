class UserController{

    //[GET] /
    allUser(req, res, next){
        //Đọc database lấy hết user rồi nhét vô hbs
        //Nhớ phân trang
        

        res.render('user/all-user');
    }

    //[GET] /:id
    viewProfileUser(req, res, next){
        const id = req.params.id;
        //Xem thông tin chi tiết:
        //dựa vào id để lấy ra thông tin của user tương ứng r nhét vô hbs

        
        res.render("user/view-guest");
    }


}

module.exports = new UserController;