const {models} = require('../models');

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
}

module.exports = new UserService;