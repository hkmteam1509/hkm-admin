class UserController{

    //[GET] /
    allAdmin(req, res, next){
        //Đọc database lấy hết admin rồi nhét vô hbs
        //Nhớ phân trang
        

         res.render('user/all-admin');
    }

    //[GET] /:id
    viewProfileAdmin(){
        const id = req.params.id;
        //Xem thông tin chi tiết:
        //dựa vào id để lấy ra thông tin của user tương ứng r nhét vô hbs


        res.render("user/view-admin");
    }

}

module.exports = new UserController;