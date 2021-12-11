const bcrypt = require('bcrypt');
const { SALT_BCRYPT } = require("../config/app");
const IsEmail = require("isemail");
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
            //Lấy thông tin đăng kí từ form thông qua req.body
            //Đặt name cho input là gì, thì lấy dữ liệu của input đó trong hàm này bằng res.body.<name của input>
            //Dùng bcrypt hash mật khẩu trước khi đưa cho service lưu vô database nha
            //code hàm chèn dữ liệu cho user trong UserService:
            //Sequelize có hỗ trợ hàm create á, lên coi document rồi làm
            //Nhớ kiểm tra username có tồn tại chưa nhe:
            //bên trang shop t có làm phần này, t render lại form đăng kí rồi truyền cho nó tất cả thông tin người ta vừa nhập
            //nhét lại thông tin đó vô form kèm theo cái errorCode bằng 1 tức là username đã tồn tại
            //trong hbs thì kiểm tra cái errorCode mà tạo ra thông báo username đã tồn tại
            //Làm tương tự đối với email, dùng IsEmail.validate(email) để kiểm tra email có hợp lệ hay không
            //nếu không hợp lệ thì cũng render như vụ trùng username ở trên nhưng với errorCode khác
            //Đăng kí thành công thì redirect về trang all-admins

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

}

module.exports = new AccountController;