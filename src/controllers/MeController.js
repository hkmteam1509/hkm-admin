const UserService = require("../services/UserService");
const bcrypt = require('bcrypt');
const { SALT_BCRYPT } = require("../config/app");
class MeController{
    //[GET] /profile
    profile(req, res, next){
        if(req.user){
            res.render('me/profile');
            //Không cần code gì trong hàm này
            //chỉ cần vô sửa code trong hbs thành thông tin tương ứng của user là được
            //Trong file hbs chỉ cần {{user.gì gì đó}} là được
        }
        else{
            res.redirect("/account/login")
        }
    }

    //[PUT] /profile
    updateProfile(req, res, next){
        if(req.user){
            //Lấy f_ID trong biến user này để có được id của user
            const user = req.user;
            //code ở đây
            //Lấy thông tin user từ form thông qua req.body
            //Đặt name cho input là gì, thì lấy dữ liệu của input đó trong hàm này bằng res.body.<name của input>
            //code hàm chèn dữ liệu cho user trong UserService:
            //Sequelize có hỗ trợ hàm update á, lên coi document rồi làm


        }
        else{
            res.redirect("/account/login")
        }
    }

    //[GET] /change-password
    changePassword(req, res, next){
        if(req.user){
            res.render('me/change-password', {
                layout:false,
            });
        }else{
            res.redirect('/account/login');
        }
    }
    //[GET] /notifications
    notifications(req, res, next){
        if(req.user){
            res.render('me/notifications');
        }else{
            res.redirect('/account/login');
        }
    }
    //[PUT] /changePassword
    updatePassword(req, res, next){
        if(req.user){
            const id = req.user.f_ID;
            const {newPassword} = req.body;
            const {password} = req.body;
            bcrypt.compare(password, req.user.f_password)
            .then(result=>{
                if(result){
                    bcrypt.hash(newPassword, SALT_BCRYPT)
                    .then(hashresult=>{
                        UserService.updatePassword(id,hashresult)
                        .then(result=>{
                            res.redirect("/");
                        })
                        .catch(err=>{
                            console.log(err);
                            next();
                        })
                    })
                    .catch(err=>{
                        console.log(err);
                        next();
                    })
                }else{
                    res.render('me/change-password', {
                        layout:false,
                        message: "Incorrect password",
                    });
                }
            })
            .catch(err=>{
                console.log(err);
                next();
            })
        }else{
            res.redirect('/account/login');
        }
    }

}

module.exports = new MeController;