const {models} = require('../models');
const Util = require('../utilities/Util');
const firebase = require('../firebase');
const {getStorage, ref, getDownloadURL, deleteObject } = require('firebase/storage');


const { Op } = require("sequelize");
class BrandService{
    // list(limit, page){
    //     return models.brand.findAll({offset: (page - 1)*limit, limit: limit, raw:true});
    // }
    list(limit, page, name){
        if(name){
            return models.brand.findAll({
                offset: (page - 1)*limit, 
                limit: limit, 
                raw:true,
                where:{
                    brandName:{
                        [Op.substring]: name
                    }
            }});
        }else{
            return models.brand.findAll({offset: (page - 1)*limit, limit: limit, raw:true});
        }
    }

    listAll(){
        return models.brand.findAll({raw:true});
    }

    totalBrand(name){
        if(name){
            return models.brand.count({
               where:{
                    brandName:{
                        [Op.substring]: name
                    }
               }
            });
        }
        else{
            return models.brand.count();
        }
        
    }

    totalTrashBrand(){
        return models.brand.count({
            paranoid: false,
            where:{
                deletedAt:{
                    [Op.not]:null
                }
            }
        });
    }

    store(id, brand, file){
        const fileName = "brand" + id + "." + file.mimetype.split("/")[1];
        const blob = firebase.bucket.file(fileName);
        return new Promise((resolve, reject)=>{
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
                const myPro = [getDownloadURL(ref(storage, fileName)),   models.brand.findOne({
                                                                                                where:{
                                                                                                    [Op.and]:[
                                                                                                        {brandName: brand.brandName},
                                                                                                        {brandID: {
                                                                                                            [Op.ne]: id
                                                                                                        }}
                                                                                                    ]
                                                                                                }
                                                                                                ,paranoid: false
                                                                                                })];
                Promise.all(myPro)
                .then(([url, result])=>{
                    brand.brandImage = url;
                    if(result){
                        brand.brandSlug += "-"+ id;
                    }
                    resolve(models.brand.create(brand));
                })
                .catch((error) => {
                    reject(error);
                });

            });
            
            blobWriter.end(file.buffer);
        });
    }

    update(brand, file){
        if(file){
            const fileName = "brand" + brand.brandID + "." + file.mimetype.split("/")[1];
            const blob = firebase.bucket.file(fileName);
            return new Promise((resolve, reject)=>{
                const blobWriter = blob.createWriteStream({
                    metadata: {
                        contentType: file.mimetype
                    }
                });
                
                blobWriter.on('error', (err) => {
                    console.log(err);
                    reject(err);
                });
                
                blobWriter.on('finish', () => {
                    const storage = getStorage();
                    const myPro = [getDownloadURL(ref(storage, fileName)),  models.brand.findOne({
                                                                                                    where:{
                                                                                                        [Op.and]:[
                                                                                                            {brandName: brand.brandName},
                                                                                                            {brandID: {
                                                                                                                [Op.ne]: brand.brandID
                                                                                                            }}
                                                                                                        ]
                                                                                                    }
                                                                                                    ,paranoid: false
                                                                                                    })];
                    Promise.all(myPro)
                    .then(([url, result])=>{
                        brand.brandImage = url;
                        if(result){
                            brand.brandSlug += "-"+ brand.brandID;
                        }
                        resolve( models.brand.update({
                            brandName: brand.brandName,
                            brandSlug: brand.brandSlug,
                            brandImage:url
                        },{
                            where: {
                                brandID: brand.brandID
                            }
                        }));
                    })
                    .catch((error) => {
                        reject(error);
                    });
                    // getDownloadURL(ref(storage, fileName))
                    // .then((url) => {
                    //     brand.brandImage = url;
                        
                    //     models.brand.update({
                    //         brandName: brand.brandName,
                    //         brandSlug: brand.brandSlug,
                    //         brandImage:url
                    //     },{
                    //         where: {
                    //             brandID: brand.brandID
                    //         }
                    //     }).then((result)=>{
                    //         resolve(result);
                    //     })
                    //     .catch((err)=>{
                    //         console.log(err);
                    //         reject(err);
                    //     })
                        
                    // })
                    // .catch((error) => {
                    //     console.log(error);
                    //     reject(error);
                    // });
                });
                
                blobWriter.end(file.buffer);
            });
           
        }
        else{
            return models.brand.findOne({
                where:{
                    [Op.and]:[
                        {brandName: brand.brandName},
                        {brandID: {
                            [Op.ne]: brand.brandID
                        }}
                    ]
                }
                ,paranoid: false
            })
            .then(result=>{
                if(result){
                    brand.brandSlug += "-"+ brand.brandID;
                }
                return models.brand.update({
                    brandName: brand.brandName,
                    brandSlug:  brand.brandSlug,
                },{
                    where: {
                        brandID: brand.brandID
                    }
                })
            })
            .catch(err=>{
                console.log(err);
            });
            
        }
    }

    delete(brandID){
        return models.brand.destroy({
            where: {
                brandID: brandID
            },
            force: true,
        });
    }

    getTrash(limit, page, name){
        if(name){
            return models.brand.findAll({
                offset: (page - 1)*limit, 
                limit: limit, 
                raw:true,
                paranoid: false,
                where:{
                    deletedAt:{
                        [Op.not]:null
                    },
                    brandName:{
                        [Op.substring]: name
                    }
            }});
        }else{
            return models.brand.findAll({
                paranoid: false, 
                offset: (page - 1)*limit, 
                limit: limit, 
                raw:true,
                where:{
                    deletedAt:{
                        [Op.not]:null
                    }
                }
            });
        }
    }

    isSameName(brandName){
        return models.brand.findOne({
            where:{
                brandName: brandName
            },
            paranoid: false,
        });
    }

    countBrandQuantity(id){
        return models.product.count({
            where:{
                brandID: id
            }
        })
    }
    // permantlyDelete(id){
    //     return models.brand.fineOne({
    //         where:{
    //             brandID: id
    //         },
    //         paranoid: false,
    //     })
    //     .then(brand=>{
    //         const imageName = Util.getImageName(brand.brandImage);
    //         return models.brand.destroy({
    //             where: {
    //                 brandID: id
    //             },
    //             force: true,
    //         }).then(result=>{
    //             console.log(result);
    //             if(result){
    //                 const storage = getStorage();
    //                 const filename = "brand"
    //                 // Create a reference to the file to delete
    //                 const desertRef = ref(storage, '/' + imageName);
    
    //                 // Delete the file
    //                 return deleteObject(desertRef)
    //             }else{
    //                 return null;
    //             }
    //         })
    //     })
    //     return models.brand.destroy({
    //         where: {
    //             brandID: id
    //         },
    //         force: true,
    //     }).then(result=>{
    //         console.log(result);
    //         if(result){
    //             const storage = getStorage();
    //             const filename = "brand"
    //             // Create a reference to the file to delete
    //             const desertRef = ref(storage, 'images/desert.jpg');

    //             // Delete the file
    //             deleteObject(desertRef).then(() => {
    //             // File deleted successfully
    //             }).catch((error) => {
    //             // Uh-oh, an error occurred!
    //             });

    //             return
    //         }else{
    //             return null;
    //         }
    //     })
    // }


}   

module.exports = new BrandService;