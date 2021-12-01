const {models} = require('../models');
const Util = require('../utilities/Util');
const firebase = require('../firebase');
const { Op } = require("sequelize");
const {getStorage, ref, getDownloadURL } = require('firebase/storage');
class CategoryService{
    list(limit, page, name){
        if(name){
            return models.category.findAll({
                offset: (page - 1)*limit, 
                limit: limit, 
                raw:true,
                where:{
                    catName:{
                        [Op.substring]: name
                    }
            }});
        }
        else{
            return models.category.findAll({offset: (page - 1)*limit, limit: limit, raw:true});
        }
    }

    listAll(){
        return models.category.findAll({raw:true});
    }


    totalCate(){
        return models.category.count();
    }

    store(id, category, file){
        const fileName = "category" + id + "." + file.mimetype.split("/")[1];
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
                const myPro = [getDownloadURL(ref(storage, fileName)),  models.category.findOne({
                    where:{
                        [Op.and]:[
                            {catName: category.catName},
                            {catUD: {
                                [Op.ne]: id
                            }}
                        ]
                    }
                    ,paranoid: false
                    })];
                Promise.all(myPro)
                .then(([url, result])=>{
                    category.catImage = url;
                    if(result){
                        category.catSlug += "-"+ id;
                    }
                    resolve(models.category.create(category));
                })
                .catch((error) => {
                    reject(error);
                });

            });
            
            blobWriter.end(file.buffer);
        });
    }
    update(category, file){
        if(file){
            const fileName = "category" + category.catID + "." + file.mimetype.split("/")[1];
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
                    const myPro = [getDownloadURL(ref(storage, fileName)),  models.category.findOne({
                        where:{
                            [Op.and]:[
                                {catName: category.catName},
                                {catUD: {
                                    [Op.ne]: category.catID
                                }}
                            ]
                        }
                        ,paranoid: false
                        })];
                    Promise.all(myPro)
                    .then(([url, result])=>{
                        category.catImage = url;
                        if(result){
                            category.catSlug += "-"+ category.catid;
                        }
                        resolve( models.category.update({
                            catName: category.catName,
                            catSlug: category.catSlug,
                            catImage:url
                        },{
                            where: {
                                catID: category.catID
                            }
                        }));
                    })
                    .catch((error) => {
                        reject(error);
                    });
                    // getDownloadURL(ref(storage, fileName))
                    // .then((url) => {
                    //     category.catImage = url;
                        
                    //     models.category.update({
                    //         catName: category.catName,
                    //         catSlug: category.catSlug,
                    //         catImage:url
                    //     },{
                    //         where: {
                    //             catID: category.catID
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
            return models.category.update({
                catName: category.catName,
                catSlug:  category.catSlug,
            },{
                where: {
                    catID: category.catID
                }
            })
        }
    }

    delete(catID){
        return models.category.destroy({
            where: {
                catID: catID
            },
            force: true,
        });
    }

    getTrash(limit, page){
        return models.category.findAll({offset: (page - 1)*limit, limit: limit, raw:true});
    }

    isSameName(catName){
        return models.category.findOne({
            where:{
                catName: catName
            }
        });
    }
    countCateQuantity(id){
        return models.product.count({
            where:{
                catID: id
            }
        })
    }
}   

module.exports = new CategoryService;