const UserService = require('../services/UserService');
const bcrypt = require('bcrypt');
const { SALT_BCRYPT } = require("../config/app");
const { listTypeOfUser, totalTypeOfUser, findByID } = require('../services/UserService');


const adminPerPage = 5;
const maximumPagination = 5;
let currentPage = 1;
let totalPage = 1;


class AdminController{

    //[GET] /
    allAdmin(req, res, next){
        const pageNumber = req.query.page;
        const name = (req.query.name) ? req.query.name : null;
        currentPage = (pageNumber && !Number.isNaN(pageNumber)) ? parseInt(pageNumber) : 1;
        currentPage = (currentPage > 0) ? currentPage : 1;
        currentPage = (currentPage <= totalPage) ? currentPage : totalPage
        currentPage = (currentPage < 1) ? 1 : currentPage;

            // gọi promise
            Promise.all([listTypeOfUser(adminPerPage,currentPage,1),totalTypeOfUser(1)])
            .then(([admins,total])=>{
                
                let totalAdmins=total;
                let paginationArray = [];
                totalPage = Math.ceil(totalAdmins/adminPerPage);
                let pageDisplace = Math.min(totalPage - currentPage + 2, maximumPagination);
                if(currentPage === 1){
                    pageDisplace -= 1;
                }
                for(let i = 0 ; i < pageDisplace; i++){
                    if(currentPage === 1){
                        paginationArray.push({
                            page: currentPage + i,
                            isCurrent:  (currentPage + i)===currentPage
                        });
                    }
                    else{
                        paginationArray.push({
                            page: currentPage + i - 1,
                            isCurrent:  (currentPage + i - 1)===currentPage
                        });
                    }
                }
                if(pageDisplace < 2){
                    paginationArray=[];
                }
                res.render("user/all-admin",{
                    admins,
                    currentPage,
                    paginationArray,
                    prevPage: (currentPage > 1) ? currentPage - 1 : 1,
                    nextPage: (currentPage < totalPage) ? currentPage + 1 : totalPage,});
            })
            .catch(err=>{
                console.log(err);
                next();
            })
    }

    //[GET] /:id
    viewProfileAdmin(req, res, next){
        const id = req.params.id;
        
        Promise.all([findByID(id)]).then(([admin])=>{
            admin;
          
            const date = new Date(admin.f_DOB);
            if (!isNaN(date.getTime())) {
                let d = date.getDate();
                (d[1]?d:"0"+d[0])
                let m = date.getMonth() + 1;
                let y = date.getFullYear();
                admin.dob = d + '/' + m + '/' + y;
            }
            res.render("user/view-admin",{admin});
        })
        .catch(err=>{
            console.log(err);
            next();
        })


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