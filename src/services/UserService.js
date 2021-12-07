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
}

module.exports = new UserService;