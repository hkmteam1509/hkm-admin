const UserService = require('../services/UserService');
const bcrypt = require('bcrypt');
const { SALT_BCRYPT } = require("../config/app");

class AdminController{

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

    //[POST] /add-admin
    createAdmin(req, res, next){
        // res.send(req.body);
        const {firstname, lastname, username, email, password, confirmPassword} = req.body;
        UserService.findAccount(username)
        .then(result=>{
            if(result){
                res.render("user/add-admin",{
                    errorCode: 1,
                    lastname,
                    firstname,
                    username,
                    email,
                    password,
                    confirmPassword,
                })
            }
            else{
                console.log(password);
                bcrypt.hash(password, SALT_BCRYPT)
                    .then(hashResult=>{
                        console.log(hashResult);
                        UserService.createUser({firstname, lastname, username, email, password: hashResult})
                        .then(result=>{
                            res.redirect('/admins/'+result.f_ID);
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
            }
        })
        .catch(err=>{
            console.log(err);
            next();
        })
    }

}

module.exports = new AdminController;