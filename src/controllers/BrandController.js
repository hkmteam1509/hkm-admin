const product = require('../models/product');
const BrandService = require('../services/BrandService');
const ProductService = require('../services/ProductService');
const Util = require('../utilities/Util');

const brandPerPage = 5;
const maximumPagination = 5;
let currentPage = 1;
let totalPage = 1;
let totalBrands = 0;
class BrandController{
    //[GET] /
    allBrand(req, res, next){
        //get page number
        const pageNumber = req.query.page;
        const name = (req.query.name) ? req.query.name : null;
        currentPage = (pageNumber && !Number.isNaN(pageNumber)) ? parseInt(pageNumber) : 1;
        currentPage = (currentPage > 0) ? currentPage : 1;
        currentPage = (currentPage <= totalPage) ? currentPage : totalPage
        currentPage = (currentPage < 1) ? 1 : currentPage;
        Promise.all([ BrandService.list(brandPerPage, currentPage, name),  BrandService.totalBrand(name)])
        .then(([brands, total])=>{
            totalBrands = total;
            let paginationArray = [];
            totalPage = Math.ceil(totalBrands/brandPerPage);
            let pageDisplace = Math.min(totalPage - currentPage + 2, maximumPagination);
            if(currentPage === 1){
                pageDisplace -= 1;
            }
            for(let i = 0 ; i < pageDisplace; i++){
                if(currentPage === 1){
                    paginationArray.push({
                        page: currentPage + i,
                        isCurrent:  (currentPage + i)===currentPage
                    });
                }
                else{
                    paginationArray.push({
                        page: currentPage + i - 1,
                        isCurrent:  (currentPage + i - 1)===currentPage
                    });
                }
            }
            if(pageDisplace < 2){
                paginationArray=[];
            }
            const brandsLength = brands.length;
            const countPro = brands.map(brand=>{
                return BrandService.countBrandQuantity(brand.brandID);
            });

            Promise.all(countPro)
            .then(result=>{
                console.log(result);
                for(let i = 0 ; i < brandsLength; i++){
                    brands[i].No = (currentPage -1)*brandPerPage + 1 + i;
                    brands[i].quantity = result[i];
                }
                const foo = "haha"
                res.render('brand/all-brand', {
                    foo,
                    brands,
                    currentPage,
                    searchQuery: name,
                    paginationArray,
                    prevPage: (currentPage > 1) ? currentPage - 1 : 1,
                    nextPage: (currentPage < totalPage) ? currentPage + 1 : totalPage,
                });
            })
            .catch(err=>{
                console.log(err);
                next();
            })
            
        })
        .catch(err=>{
            console.log(err);
            next();
        })
    }

    //[POST] /store
    store(req, res, next){
        const brand={
           brandName: req.body.brandName,
           brandSlug: Util.getDataSlug(req.body.brandName),
           quantity: 0,
           brandImage: null
        }
        req.files.forEach(file => {
            if(!file.mimetype.startsWith('image/')){
                res.status(415);
                res.render('404', {
                    layout:false,
                });
                return;
            }else{
               
            }
        });
        
        BrandService.totalBrand()
        .then(total=>{
            BrandService.store(total+1, brand, req.files[0])
            .then((result)=>{
                return result;
            })
            .then((result)=>{
                res.status(200);
               
                if(totalBrands%brandPerPage === 0){
                    totalBrands += 1;
                    totalPage = Math.ceil(totalBrands/brandPerPage);
                    currentPage+=1;
                }
                res.send('/brands?page=' + currentPage);
            })
            .catch((err)=>{
                console.log(err);
                res.status(400);
                res.render('404',{
                    layout: false,
                })
            })
        })
        .catch(err=>{
            console.log(err);
            res.render('404', {
                layout:false,
            })
        })
    }

    //[PUT] /edit/:id
    update(req, res, next){
        let brandID = req.params.id;
        let brandName = req.body.brandName;

        let file;
        if(req.files){
            if(!req.files[0].mimetype.startsWith('image/')){
                res.status(415);
                res.render('404', {
                    layout:false,
                });
                return;
            }
            file = req.files[0];
        }
        else{
            file = null;
        }
        const brand = {
            brandID,
            brandName,
            brandSlug: Util.getDataSlug(brandName)
        }
        BrandService.update(brand, file)
        .then((result)=>{
            return result;
        })
        .then((result)=>{
            if(file){
                res.send('/brands?page=' + currentPage);
            }
            else{
                res.redirect('/brands?page=' + currentPage);
            }
            
        })
        .catch(err=>{
            console.log(err)
            res.status(400);
            res.render('404', {
                layout:false,
            });
            return;
        })
    }

    //[DELETE] /delete/:id
    delete(req, res, next){
        const id = req.params.id;
        BrandService.delete(id)
        .then((result)=>{
            totalBrands -= 1;
            totalPage = Math.ceil(totalBrands/brandPerPage);
            res.redirect("back");
        })
        .catch((err)=>{
            console.log(err);
            next();
        })
    } 

    //[GET] /
    // deletedBrand(req, res, next){
    //     //get page number
    //     const pageNumber = req.query.page;
    //     const name = (req.query.name) ? req.query.name : null;
    //     currentPageDel = (pageNumber && !Number.isNaN(pageNumber)) ? parseInt(pageNumber) : 1;
    //     currentPageDel = (currentPageDel > 0) ? currentPageDel : 1;
    //     currentPageDel = (currentPageDel <= totalPageDel) ? currentPageDel : totalPageDel
    //     Promise.all([ BrandService.getTrash(brandPerPage, currentPageDel, name), BrandService.totalTrashBrand(),BrandService.totalBrand() ])
    //     .then(([brands, total, totalNotDeletedBrands])=>{
    //         totalBrandsDel = total;
    //         let paginationArray = [];
    //         totalPageDel = Math.ceil(totalBrandsDel/brandPerPage);
    //         let pageDisplace = Math.min(totalPageDel - currentPageDel + 2, maximumPagination);
    //         if(currentPageDel === 1){
    //             pageDisplace -= 1;
    //         }
    //         for(let i = 0 ; i < pageDisplace; i++){
    //             if(currentPageDel === 1){
    //                 paginationArray.push({
    //                     page: currentPageDel + i,
    //                     isCurrent:  (currentPageDel + i)===currentPageDel
    //                 });
    //             }
    //             else{
    //                 paginationArray.push({
    //                     page: currentPageDel + i - 1,
    //                     isCurrent:  (currentPageDel + i - 1)===currentPageDel
    //                 });
    //             }
    //         }
    //         if(pageDisplace < 2){
    //             paginationArray=[];
    //         }
    //         const brandsLength = brands.length;
    //         for(let i = 0 ; i < brandsLength; i++){
    //             brands[i].No = (currentPageDel -1)*brandPerPage + 1 + i;
    //         }
    //         console.log("current: " + currentPageDel)
    //         res.render('brand/trash-brand', {
    //             totalNotDeletedBrands,
    //             brands,
    //             currentPageDel,
    //             searchQuery: name,
    //             paginationArray,
    //             prevPage: (currentPageDel > 1) ? currentPageDel - 1 : 1,
    //             nextPage: (currentPageDel < totalPage) ? currentPageDel + 1 : totalPageDel,
    //         });
    //     })
    //     .catch(err=>{
    //         console.log(err);
    //         next();
    //     })
    // }

    // //[DELETE]  /permantly-delete/:id
    // permantlyDelete(req, res, next){
    //     const id = req.params.id;
    // }

    // //[POST] /restore/:id
    // restore(req, res, next){
    //     const id = req.params.id;
    // }

}

module.exports = new BrandController;

// products.foreach(product=>{
//     let promiseArr=[
//         ProductService.brandProduct(id),
//         ProductService.catProduct(id),
//         ProductService.firstImageProduct(id),
//         ProductService.countProductQuantity(id),
//     ]

//     Promise.all(promiseArr)
//     .then((result)=>{
//         //promiseArr có 4 promise nên
//         //result sẽ là mảng 4 phần tử là kết quả của 4 promise trên
//         //result[0] là brand
//         //result[1] là cat
//         //result[2] là image
//         //result[3] là quantity
//     })
// })

// const countPro = products.map(product=>{
//     return ProductService.countProductQuantity(product.proId);
// })

// const proImage = products.map(product=>{
//     return ProductService.firstImageProduct(product.proId);
// })


// const proBrand = products.map(product=>{
//     return ProductService.brandProduct(product.proId);
// })


// const proCate = products.map(product=>{
//     return ProductService.catProduct(product.proId);
// })

// let myProArr = countPro.concat(proImage, proBrand, proCate);
// //gọi n là length của products
// Promise.all(myProArr)
//     .then((result)=>{
//         //result lúc này:
//         //n phần tử đầu là n cái quantity của n products
//         //n phần tử tiếp thep là n cái proImage của n products
//         //n phần tử tiếp nữa là n cái proBrand của n products
//         //n phần tử cuối là n cái proCate của n product
//     })
