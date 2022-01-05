const UserService = require('../services/UserService');
const bcrypt = require('bcrypt');
const { SALT_BCRYPT } = require("../config/app");
const { findByID,listTypeOfUser, totalTypeOfUser, findShipByID } = require('../services/UserService');

const userPerPage = 5;
const maximumPagination = 5;
let currentPage = 1;
let totalPage = 1;


class UserController{

    //[GET] /
    allUser(req, res, next){
        const pageNumber = req.query.page;
        currentPage = (pageNumber && !Number.isNaN(pageNumber)) ? parseInt(pageNumber) : 1;
        currentPage = (currentPage > 0) ? currentPage : 1;
        currentPage = (currentPage <= totalPage) ? currentPage : totalPage
        currentPage = (currentPage < 1) ? 1 : currentPage;

            // gọi promise
            Promise.all([listTypeOfUser(userPerPage,currentPage,0),totalTypeOfUser(0)])
            .then(([users,total])=>{
                
                let totalUser=total;
                let paginationArray = [];
                totalPage = Math.ceil(totalUser/userPerPage);
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
                const usersLength = users.length;
                for(let i = 0 ; i  < usersLength;i++){
                    users[i].No = (currentPage -1)*userPerPage + 1 + i;
                }
                res.render("user/all-user",{
                    users,
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
    viewProfileUser(req, res, next){
        const id = req.params.id;
        
        Promise.all([findByID(id),findShipByID(id)])
        .then(([users,ships])=>{
          
            const date = new Date(users.f_DOB);
            if (!isNaN(date.getTime())) {
                let d = date.getDate();
                (d[1]?d:"0"+d[0])
                let m = date.getMonth() + 1;
                let y = date.getFullYear();
                users.dob = d + '/' + m + '/' + y;
            }
             console.log(ships);
            res.render("user/view-guest",{users,ships});
        })
        .catch(err=>{
            console.log(err);
            next();
        })       
    }

    //[PUT] /
    updatePermissionUserList(req, res, next){
        const {id, permission} = req.body;
        UserService.updatePermission(id, permission)
        .then(result=>{
            // res.redirect('back');
            res.status(200).json(result);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({msg:"error"});
        })
    }

    //[PUT] /:id
    updatePermissionUser(req, res, next){
        const {id, permission} = req.body;
        UserService.updatePermission(id, permission)
        .then(result=>{
            // res.redirect('back');
            res.status(200).json(result);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({msg:"error"});
        })
    }

    allUserFilter(req, res, next){
        const pageNumber = req.query.page;
        currentPage = (pageNumber && !Number.isNaN(pageNumber)) ? parseInt(pageNumber) : 1;
        currentPage = (currentPage > 0) ? currentPage : 1;
        currentPage = (currentPage <= totalPage) ? currentPage : totalPage
        currentPage = (currentPage < 1) ? 1 : currentPage;

            // gọi promise
            Promise.all([listTypeOfUser(userPerPage,currentPage,0),totalTypeOfUser(0)])
            .then(([users,total])=>{
                
                let totalUser=total;
                let paginationArray = [];
                totalPage = Math.ceil(totalUser/userPerPage);
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
                const usersLength = users.length;
                for(let i = 0 ; i  < usersLength;i++){
                    users[i].No = (currentPage -1)*userPerPage + 1 + i;
                }
                res.status(200).json({
                    users,
                    currentPage,
                    paginationArray,
                    prevPage: (currentPage > 1) ? currentPage - 1 : 1,
                    nextPage: (currentPage < totalPage) ? currentPage + 1 : totalPage,});
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json(err);
            })
    }
}

module.exports = new UserController;