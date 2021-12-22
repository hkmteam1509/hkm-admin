const {models, sequelize} = require('../models');

class OrderService{
    list(limit, page){
        return models.order.findAll({
            offset: (page - 1)*limit, 
            limit: limit, 
            raw:true
        });
    }

    countOrder(){
        return models.order.count({
            raw: true
        })
    }

    ordererName(id){
        return models.user.findOne({
            attributes: ['f_firstname', 'f_lastname'],
            raw:true,
            where:{
                f_ID: id
            }
        })
    }

    findOrder(id){
        return models.order.findOne({
            raw:true,
            where:{
                orderID: id
            }
        })
    }

    orderDetailList(id,limit,page){
        return models.orderdetail.findAll({
            offset: (page - 1)*limit, 
            limit: limit,
            raw:true,
            where:{
                orderID: id
            }
        });
    }

    countAllDetail(id){
        return models.orderdetail.count({
            where:{
                orderID: id
            }
        })
    }

    findDetailItem(id){
        return models.detail.findOne({
            raw:true,
            where:{
                detailID: id
            }
        });
    }

    updateStatusOrder(id, orderStatus){
        return models.order.update({
            status: orderStatus
        },{
            where:{
                orderID: id
            }
        })
    }
}

module.exports = new OrderService;