const {models, sequelize} = require('../models');
const Util = require('../utilities/Util');
const firebase = require('../firebase');
const {getStorage, ref, getDownloadURL, deleteObject } = require('firebase/storage');
const { Op } = require("sequelize");

class StatiticService{

    getOrderDetailByYear = (year) =>{
        return models.orderdetail.findAll({
            raw:true,
            where:sequelize.where(sequelize.fn('YEAR', sequelize.col('createdAt')), year),
        });
    }

    getORderDetailByDate = (dateStart, dateEnd)=>{
        return models.orderdetail.findAll({
            raw:true,
            where:{
                createdAt:{
                    [Op.gte]: dateStart,
                    [Op.lte]: dateEnd
                }
            }
        });
    }

    getOrderDetailByWeek = (dateStart, dateEnd) => {
        return models.orderdetail.findAll({
            raw:true,
            where:{
                createdAt:{
                    [Op.gte]: dateStart,
                    [Op.lte]: dateEnd
                }
            }
        });
    }

    getOrderDetailByMonth = (month, year) => {
        return models.orderdetail.findAll({
            raw:true,
            where:{
                [Op.and]:[
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('createdAt')), year),
                    sequelize.where(sequelize.fn('MONTH', sequelize.col('createdAt')), month)
                ]
            }
        });
    }

    getOrderDetailByQuarter = (dateStart, dateEnd)=>{
        return models.orderdetail.findAll({
            raw:true,
            where:{
                createdAt:{
                    [Op.gte]: dateStart,
                    [Op.lte]: dateEnd
                }
            }
        });
    }

    getProduct = (proID) =>{
        return models.product.findOne({
            raw:true,
            where:{
                proID: proID
            }
        })
    }

    getAllCate  = () =>{
        return models.category.findAll({raw:true});
    }

    getAllBrand = () => {
        return models.brand.findAll({raw:true});
    }
}

module.exports = new StatiticService;