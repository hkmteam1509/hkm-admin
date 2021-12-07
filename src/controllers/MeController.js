const UserService = require("../services/UserService");
const bcrypt = require('bcrypt');
const { SALT_BCRYPT } = require("../config/app");
const Util = require("../utilities/Util");
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
            let {mobileno, firstname, lastname, address, birthdate} = req.body;
            const tokens=birthdate.split("/");
          
            let date = new Date(tokens[2] + "-"+ tokens[1]+"-"+tokens[0])
            if(Util.isVietnamesePhoneNumber(mobileno)){
                UserService.updateProfile(user.f_ID, firstname, lastname, address, date, mobileno)
                .then(result=>{
                    res.redirect('back');
                })
                .catch(err=>{
                    console.log(err);
                    next();
                })
            }else{
                console.log(false);
                res.render('me/profile',{
                    errorCode: 1
                });
            }
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