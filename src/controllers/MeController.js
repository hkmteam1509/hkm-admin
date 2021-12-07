const UserService = require("../services/UserService");
const bcrypt = require('bcrypt');
const { SALT_BCRYPT } = require("../config/app");
class MeController{
    //[GET] /profile
    profile(req, res, next){
        if(req.user){
            const user = req.user;
            const date = new Date(user.f_DOB);
            if (!isNaN(date.getTime())) {
                let d = date.getDate();
                (d[1]?d:"0"+d[0])
                let m = date.getMonth() + 1;
                let y = date.getFullYear();
                user.dob = d + '/' + m + '/' + y;
            }
            res.render('me/profile');
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
            bcrypt.hash(newPassword, SALT_BCRYPT)
            .then(password=>{
                UserService.updatePassword(id,password)
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
            res.redirect('/account/login');
        }
    }

}

module.exports = new MeController;