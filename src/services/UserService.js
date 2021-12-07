const {models, sequelize} = require('../models');


class UserService{
    findAccount(username){
        return models.user.findOne({
            raw: true,
            where:{
                f_username: username,
            }
        })
    }

    findByID(id){
        return models.user.findOne({
            raw:true,
            where:{
                f_ID:id
            }
        })
    }

    updatePassword(id, password){
        return models.user.update({
            f_password: password
        },{
            where:{
                f_ID: id
            }
        })
    }

    createUser({firstname, lastname, username, email, password}){
        return models.user.create({
            f_userName: username,
            f_password: password,
            f_lastname: lastname,
            f_firstname: firstname,
            f_email: email,
            f_permission: 1,
        })
    }


    // admin type 0
    // user type 1
    listTypeOfUser(limit, page, type){
            return models.user.findAll({
                offset: (page - 1)*limit, 
                limit: limit, 
                raw:true,
                where:{
                    f_permission: type,
                    }
            });
      
    }

    totalTypeOfUser(type){
        return models.user.count({
            raw: true,
            where:{
                f_permission: type,
            }
        })
    }

    findShipByID(id){
        return models.shipping.findOne({
            raw:true,
            where:{
                userID: id,
            }
        })
    }
}

module.exports = new UserService;