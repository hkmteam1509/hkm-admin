const {models} = require('../models');
const Util = require('../utilities/Util');
const firebase = require('../firebase');
const {getStorage, ref, getDownloadURL, deleteObject } = require('firebase/storage');

class StatiticServer{
    getAllOrderDetail = () => {
        return models.orderdetail.findAll({
            raw:true
        });
    }
}