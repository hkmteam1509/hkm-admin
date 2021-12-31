const {models, sequelize} = require('../models');
const { Op } = require("sequelize");


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



    // admin type 1
    // user type 0
    listTypeOfUser(limit, page, type){
        let typeblock = 1;
        if (type === 0) typeblock = -1;
        return models.user.findAll({
            offset: (page - 1)*limit, 
            limit: limit, 
            raw:true,
            where:{
                [Op.or]: [
                    { f_permission: type },
                    { f_permission: typeblock }
                  ]
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
    updateProfile(id, firstname, lastname, address, date, mobileno){
        return models.user.update({
            f_firstname: firstname,
            f_lastname: lastname,
            f_address: address,
            f_phone: mobileno,
            f_DOB: date
        },{
            where:{
                f_ID:id

            }
        })
    }

    updatePermission(id, permission){
        return models.user.update({
            f_permission: permission
        },{
            where:{
                f_ID: id
            }
        })
    }
}

module.exports = new UserService;