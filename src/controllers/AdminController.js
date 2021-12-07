class UserController{

    //[GET] /
    allAdmin(req, res, next){
        //Đọc database lấy hết admin rồi nhét vô hbs
        //Nhớ phân trang
        

         res.render('user/all-admin');
    }

    //[GET] /:id
    viewProfileAdmin(req, res, next){
        const id = req.params.id;
        //Xem thông tin chi tiết:
        //dựa vào id để lấy ra thông tin của user tương ứng r nhét vô hbs


        res.render("user/view-admin");
    }

    //[GET] /add-admin
    addAdmin(req, res, next){
        res.render("user/add-admin");
    }

}

module.exports = new UserController;