const {models, testConnect, sequelize} = require('../models');
const imagelink = require('../models/imagelink');
const firebase = require('../firebase');
const {getStorage, ref, getDownloadURL, deleteObject } = require('firebase/storage');
const Util = require('../utilities/Util');

const { Op } = require("sequelize");
const { getRndInteger } = require('../utilities/Util');

class ProductService{

    findMaxID(product){
         models.product.max('proID')
        .then((result)=>{
            return result;
        })
        .catch((err)=>{
            console.log(err);
            return 0;
        })
    }

    countImage(proID){
        return models.imagelink.count({
            where: {
                proID: proID
            }
        })
    }

    countAllItem(name, brandid, cateid, genderid){
        let mnbrand, mxbrand, mncate, mxcate, mngender, mxgender;
        if (genderid) {
            mngender = genderid;
            mxgender = genderid;
        }
        else {
            mngender = 0;
            mxgender = 4;
        }
        
        if (brandid) {
            mnbrand = brandid;
            mxbrand = brandid;
            if (cateid) {
                mncate = cateid;
                mxcate = cateid;
                if(name){
                    return models.product.count({
                        where: {
                            proName:{
                                [Op.substring]: name
                            },
                            brandID:{
                                [Op.gte]: mnbrand,
                                [Op.lte]: mxbrand
                            },
                            catID:{
                                [Op.gte]: mncate,
                                [Op.lte]: mxcate
                            },
                            sex:{
                                [Op.gte]: mngender,
                                [Op.lte]: mxgender
                            }
                        }
                    });
                }
                else{
                    return models.product.count({
                        where: {
                            brandID:{
                                [Op.gte]: mnbrand,
                                [Op.lte]: mxbrand
                            },
                            catID:{
                                [Op.gte]: mncate,
                                [Op.lte]: mxcate
                            },
                            sex:{
                                [Op.gte]: mngender,
                                [Op.lte]: mxgender
                            }
                        }
                    });
                }
            }
            else {
                mncate = 0;
                // mxcate = 100;
                mxcate = Number.POSITIVE_INFINITY - 1;
                return models.category.count().then((result)=>{
                    mxcate = result;
                    if(name){
                        return models.product.count({
                            where: {
                                proName:{
                                    [Op.substring]: name
                                },
                                brandID:{
                                    [Op.gte]: mnbrand,
                                    [Op.lte]: mxbrand
                                },
                                catID:{
                                    [Op.gte]: mncate,
                                    [Op.lte]: mxcate
                                },
                                sex:{
                                    [Op.gte]: mngender,
                                    [Op.lte]: mxgender
                                }
                            }
                        });
                    }
                    else{
                        return models.product.count({
                            where: {
                                brandID:{
                                    [Op.gte]: mnbrand,
                                    [Op.lte]: mxbrand
                                },
                                catID:{
                                    [Op.gte]: mncate,
                                    [Op.lte]: mxcate
                                },
                                sex:{
                                    [Op.gte]: mngender,
                                    [Op.lte]: mxgender
                                }
                            }
                        });
                    }
                })
                .catch((err)=>{
                    console.log(err);
                    mxcate = 0;
                });
            }
        }
        else {
            mnbrand = 0;
            // mxbrand = 100;
            return models.brand.count().then((result)=>{
                mxbrand = result;
                if (cateid) {
                    mncate = cateid;
                    mxcate = cateid;
                    if(name){
                        return models.product.count({
                            where: {
                                proName:{
                                    [Op.substring]: name
                                },
                                brandID:{
                                    [Op.gte]: mnbrand,
                                    [Op.lte]: mxbrand
                                },
                                catID:{
                                    [Op.gte]: mncate,
                                    [Op.lte]: mxcate
                                },
                                sex:{
                                    [Op.gte]: mngender,
                                    [Op.lte]: mxgender
                                }
                            }
                        });
                    }
                    else{
                        return models.product.count({
                            where: {
                                brandID:{
                                    [Op.gte]: mnbrand,
                                    [Op.lte]: mxbrand
                                },
                                catID:{
                                    [Op.gte]: mncate,
                                    [Op.lte]: mxcate
                                },
                                sex:{
                                    [Op.gte]: mngender,
                                    [Op.lte]: mxgender
                                }
                            }
                        });
                    }
                }
                else {
                    mncate = 0;
                    // mxcate = 100;
                    mxcate = Number.POSITIVE_INFINITY - 1;
                    return models.category.count().then((result1)=>{
                        mxcate = result1;
                        if(name){
                            return models.product.count({
                                where: {
                                    proName:{
                                        [Op.substring]: name
                                    },
                                    brandID:{
                                        [Op.gte]: mnbrand,
                                        [Op.lte]: mxbrand
                                    },
                                    catID:{
                                        [Op.gte]: mncate,
                                        [Op.lte]: mxcate
                                    },
                                    sex:{
                                        [Op.gte]: mngender,
                                        [Op.lte]: mxgender
                                    }
                                }
                            });
                        }
                        else{
                            return models.product.count({
                                where: {
                                    brandID:{
                                        [Op.gte]: mnbrand,
                                        [Op.lte]: mxbrand
                                    },
                                    catID:{
                                        [Op.gte]: mncate,
                                        [Op.lte]: mxcate
                                    },
                                    sex:{
                                        [Op.gte]: mngender,
                                        [Op.lte]: mxgender
                                    }
                                }
                            });
                        }
                    })
                    .catch((err)=>{
                        console.log(err);
                        mxcate = 0;
                    });
                }
            })
            .catch((err)=>{
                console.log(err);
                mxbrand = 0;
            });
        }
    }

    list(limit, page, name, brandid, cateid, genderid){
        let mnbrand, mxbrand, mncate, mxcate, mngender, mxgender;
        if (genderid) {
            mngender = genderid;
            mxgender = genderid;
        }
        else {
            mngender = 0;
            mxgender = 4;
        }

        if (brandid) {
            mnbrand = brandid;
            mxbrand = brandid;
            if (cateid) {
                mncate = cateid;
                mxcate = cateid;
                if(name){
                    return models.product.findAll({
                        offset: (page - 1)*limit, 
                        limit: limit, 
                        raw:true,
                        where:{
                            proName:{
                                [Op.substring]: name
                            },
                            brandID:{
                                [Op.gte]: mnbrand,
                                [Op.lte]: mxbrand
                            },
                            catID:{
                                [Op.gte]: mncate,
                                [Op.lte]: mxcate
                            },
                            sex:{
                                [Op.gte]: mngender,
                                [Op.lte]: mxgender
                            }
                    }});
                }else{
                    return models.product.findAll({
                        offset: (page - 1)*limit, 
                        limit: limit, 
                        raw:true,
                        where:{
                            brandID:{
                                [Op.gte]: mnbrand,
                                [Op.lte]: mxbrand
                            },
                            catID:{
                                [Op.gte]: mncate,
                                [Op.lte]: mxcate
                            },
                            sex:{
                                [Op.gte]: mngender,
                                [Op.lte]: mxgender
                            }
                    }});
                }
            }
            else {
                mncate = 0;
                // mxcate = 100;
                mxcate = Number.POSITIVE_INFINITY - 1;
               return  models.category.count().then((result)=>{
                    mxcate = result;
                    if(name){
                        return models.product.findAll({
                            offset: (page - 1)*limit, 
                            limit: limit, 
                            raw:true,
                            where:{
                                proName:{
                                    [Op.substring]: name
                                },
                                brandID:{
                                    [Op.gte]: mnbrand,
                                    [Op.lte]: mxbrand
                                },
                                catID:{
                                    [Op.gte]: mncate,
                                    [Op.lte]: mxcate
                                },
                                sex:{
                                    [Op.gte]: mngender,
                                    [Op.lte]: mxgender
                                }
                        }});
                    }else{
                        return models.product.findAll({
                            offset: (page - 1)*limit, 
                            limit: limit, 
                            raw:true,
                            where:{
                                brandID:{
                                    [Op.gte]: mnbrand,
                                    [Op.lte]: mxbrand
                                },
                                catID:{
                                    [Op.gte]: mncate,
                                    [Op.lte]: mxcate
                                },
                                sex:{
                                    [Op.gte]: mngender,
                                    [Op.lte]: mxgender
                                }
                        }});
                    }
                })
                .catch((err)=>{
                    console.log(err);
                    mxcate = 0;
                });
            }
        }
        else {
            mnbrand = 0;
            // mxbrand = 100;
           return models.brand.count().then((result)=>{
                mxbrand = result;
                if (cateid) {
                    mncate = cateid;
                    mxcate = cateid;
                    if(name){
                        return models.product.findAll({
                            offset: (page - 1)*limit, 
                            limit: limit, 
                            raw:true,
                            where:{
                                proName:{
                                    [Op.substring]: name
                                },
                                brandID:{
                                    [Op.gte]: mnbrand,
                                    [Op.lte]: mxbrand
                                },
                                catID:{
                                    [Op.gte]: mncate,
                                    [Op.lte]: mxcate
                                },
                                sex:{
                                    [Op.gte]: mngender,
                                    [Op.lte]: mxgender
                                }
                        }});
                    }else{
                        return models.product.findAll({
                            offset: (page - 1)*limit, 
                            limit: limit, 
                            raw:true,
                            where:{
                                brandID:{
                                    [Op.gte]: mnbrand,
                                    [Op.lte]: mxbrand
                                },
                                catID:{
                                    [Op.gte]: mncate,
                                    [Op.lte]: mxcate
                                },
                                sex:{
                                    [Op.gte]: mngender,
                                    [Op.lte]: mxgender
                                }
                        }});
                    }   
                }
                else {
                    mncate = 0;
                    // mxcate = 100;
                    mxcate = Number.POSITIVE_INFINITY - 1;
                    return models.category.count().then((result1)=>{
                        mxcate = result1;
                        if(name){
                            return models.product.findAll({
                                offset: (page - 1)*limit, 
                                limit: limit, 
                                raw:true,
                                where:{
                                    proName:{
                                        [Op.substring]: name
                                    },
                                    brandID:{
                                        [Op.gte]: mnbrand,
                                        [Op.lte]: mxbrand
                                    },
                                    catID:{
                                        [Op.gte]: mncate,
                                        [Op.lte]: mxcate
                                    },
                                    sex:{
                                        [Op.gte]: mngender,
                                        [Op.lte]: mxgender
                                    }
                            }});
                        }else{
                            return models.product.findAll({
                                offset: (page - 1)*limit, 
                                limit: limit, 
                                raw:true,
                                where:{
                                    brandID:{
                                        [Op.gte]: mnbrand,
                                        [Op.lte]: mxbrand
                                    },
                                    catID:{
                                        [Op.gte]: mncate,
                                        [Op.lte]: mxcate
                                    },
                                    sex:{
                                        [Op.gte]: mngender,
                                        [Op.lte]: mxgender
                                    }
                            }});
                        }
                    })
                    .catch((err)=>{
                        console.log(err);
                        mxcate = 0;
                    });
                }
            })
            .catch((err)=>{
                console.log(err);
                mxbrand = 0;
            });
        }
    }


    storeProduct1(product, productDetail, files){
        let returnValue = true;
        let productImages=[];
        models.product.create(product)
        .then((result)=>{
            const nDetail = productDetail.length;
            for(let i = 0 ; i < nDetail ; i++){
                productDetail[i].proID = result.proID;
            }
            const nImage = files.length;
            for(let i = 0 ; i < nImage ; i++){
                productImages.push({
                    proID:result.proID,
                    proImage: null,
                })
            }
            files.forEach((file, index) => {
                const fileName = "pro" + result.proID + "_" + index + "." +file.mimetype.split("/")[1];
                const blob = firebase.bucket.file(fileName);
                const blobWriter = blob.createWriteStream({
                    metadata: {
                        contentType: file.mimetype
                    }
                });
                
                blobWriter.on('error', (err) => {
                    console.log(err);
                });
                
                blobWriter.on('finish', () => {
                    const storage = getStorage();
                    getDownloadURL(ref(storage, fileName))
                    .then((url) => {
                        productImages[index].proImage = url;
                        models.imagelink.create(productImages[index]);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                });
                
                blobWriter.end(file.buffer);
            });
            models.detail.bulkCreate(productDetail)
            .then((result1)=>{
                console.log("Detail Success");
            })
            .catch((err1)=>{
                console.log("Detail fail");
                returnValue = false;
            });
        })
        .catch((err)=>{
            returnValue = false;
            console.log(err);
            console.log("product fail");
        });
        return returnValue;
    }

    storeProduct(product){
        return models.product.create(product);
    }

    storeDetails(details){
        return models.detail.bulkCreate(details);
    }

    createImage(imagelink){
        return models.imagelink.create(imagelink);
    }

    storeImages(files, productImages){
        models.imagelink.count({
            where: {
                proID: productImages[0].proID
            }
        })
        .then(result=>{
            files.forEach((file, index) => {
                const fileName = "pro" + productImages[index].proID + "_" + (index+result) + "." +file.mimetype.split("/")[1];
                const blob = firebase.bucket.file(fileName);
                const blobWriter = blob.createWriteStream({
                    metadata: {
                        contentType: file.mimetype
                    }
                });
                
                blobWriter.on('error', (err) => {
                    console.log(err);
                });
                
                blobWriter.on('finish', () => {
                    const storage = getStorage();
                    getDownloadURL(ref(storage, fileName))
                    .then((url) => {
                        productImages[index].proImage = url;
                        models.imagelink.create(productImages[index]);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                });
                
                blobWriter.end(file.buffer);
            });
        })
    }

    countProductQuantity(id){
        return models.detail.sum('quantity', {
            raw:true,
            where:{
                proID: id
            }
        })
    }

    brandProduct(id){
        return models.brand.findOne({
            attributes: ['brandName'],
            raw:true,
            where:{
                brandID: id
            }
        })
    }

    cateProduct(id){
        return models.category.findOne({
            attributes: ['catName'],
            raw:true,
            where:{
                catID: id
            }
        })
    }

    firstImageProduct(id){
        return models.imagelink.findOne({
            attributes: ['proImage'],
            raw:true,
            where:{
                proID: id
            }
        })
    }

    itemProduct(id){
        return models.product.findOne({
            raw:true,
            where:{
                proID: id
            }
        });
    }

    detailsItemProduct(id){
        return models.detail.findAll({
            raw:true,
            where:{
                proID: id
            }
        });
    }

    imagesItemProduct(id){
        return models.imagelink.findAll({
            raw:true,
            where:{
                proID: id
            }
        });
    }

    reviewsItemProduct(id,limit,page){
        return models.comment.findAll({
            offset: (page - 1)*limit, 
            limit: limit,
            raw:true,
            where:{
                proID: id
            }
        });
    }

    removeOldDetail(product){
        return models.detail.destroy({
            where: {
                proID: product.proID
            },
            force: true,
        })
    }

    countRatingProduct(id){
        return models.comment.count({
            raw:true,
            where:{
                proID: id
            }
        });
    }

    sumRatingProduct(id){
        return models.comment.sum('rate', {
            raw:true,
            where:{
                proID: id
            }
        });
    }

    findProduct(id){
        return models.product.findOne({
            where:{
                proID: id
            }
        })
    }

    updatePrductDetail(product, details){
        let nDetails = details.length;
        console.log(product)
        let arr = [
            models.product.update({
                proName: product.proName,
                brandID: product.brandID,
                catID: product.catID,
                proSlug: product.proSlug,
                price: product.price,
                quantity: product.quantity,
                sex: product.sex,
                isFeature: product.isFeature,
                description: product.description,
                fullDescription: product.fullDescription
            },{
                where:{
                    proID: product.proID
                }
            })
        ];
        for(let i = 0 ; i < nDetails; i++){
            arr.push(models.detail.update({
                quantity: details[i].quantity,
                color: details[i].color
            },{
                where:{
                    detailID: details[i].detailID
                }
            }));
            
        }
        let idArr = details.map(detail=>{
            return detail.detailID;
        })
        arr.push(models.detail.destroy({
            where:{
                [Op.and]:[
                    { proID: product.proID},
                    {detailID:{
                        [Op.notIn]: idArr
                    }}
                ]
            }
        }))
        return Promise.all(arr);
    }

    deleteProduct(id){
        return models.product.destroy({
            where:{
                proID: id
            }
        })
    }

    deleteProductImage(urls){
        const mypromises = urls.map(url=>{
            return models.imagelink.destroy({
                where:{
                    proImage: url
                }
            })
        })
        return Promise.all(mypromises);
    }

    getBrandSlug(id){
        return models.brand.findOne({
            raw:true,
            attributes: ['brandSlug'],
            where: {
                brandID: id
            }
        })
    }

    getCateSlug(id){
        return models.category.findOne({
            raw:true,
            attributes: ['catSlug'],
            where: {
                catID: id
            }
        })
    }

    getCateName(id){
        return models.category.findOne({
            raw:true,
            where: {
                catID: id,
            }
        })
    }

    getBrandName(id){
        return models.brand.findOne({
            raw:true,
            where: {
                brandID: id,
            }
        })
    }

    getProductDetail(id){
        return models.detail.findAll({
            raw:true,
            where:{
                proID: id,
            }
        })
    }

    getImageLink(id){
        return models.imagelink.findAll(
			{attributes: ['proImage'],
			where: {proID:id}, raw:true})
    }

    updateImageLink(file, name, oldUrl){
        const fileName = name;
        const blob = firebase.bucket.file(fileName);
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });
        
        blobWriter.on('error', (err) => {
            console.log(err);
        });
        
        blobWriter.on('finish', () => {
            const storage = getStorage();
            getDownloadURL(ref(storage, fileName))
            .then((url) => {
                models.imagelink.update({
                    proImage: url
                },{
                    where:{
                        proImage : oldUrl
                    }
                })
            })
            .catch((error) => {
                console.log(error);
            });
        });
        
        blobWriter.end(file.buffer);
    }

    deleteReview(id){
        return models.comment.destroy({
            where:{
                commentID: id,
            }
        })
    }

    countAllReview(id){
        return models.comment.count({
            where:{
                proID:id
            }
        })
    }

    listAll(limit){
        if(!limit){
            return models.product.findAll({
                raw:true,
                order: [
                    ['sold', 'DESC'],
                ],
            })
        }
        return models.product.findAll({
            raw:true,
            order: [
                ['sold', 'DESC'],
            ],
            limit: limit,
        })
    }

    listBestSelling(limit, brandID){
        if(brandID){
            return models.product.findAll({
                raw:true,
                where:{
                    brandID: brandID
                },
                order: [
                    ['sold', 'DESC'],
                ],
                limit: limit,
            })
        }
        else{
            return models.product.findAll({
                raw:true,
                order: [
                    ['sold', 'DESC'],
                ],
                limit: limit,
            })
        }
      
    }
    
}

module.exports = new ProductService;