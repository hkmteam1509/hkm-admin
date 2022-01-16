const detail = require('../models/detail');
const initModels = require('../models/init-models');
const product = require('../models/product');
const BrandService = require('../services/BrandService');
const CategoryService = require('../services/CategoryService');
const ProductService = require('../services/ProductService');
const Util = require('../utilities/Util');
const firebase = require('../firebase');
const {getStorage, ref, getDownloadURL, deleteObject } = require('firebase/storage');
const productPerPage = 5;

const maximumPagination = 5;
let currentPage = 1;
let totalPage = 1;
let totalProducts = 0;

const reviewPerpage = 5;
let currentReviewPage = 1
let totalReviewPage = 1;
let totalReviews = 0;

class ProductController{

    //[GET] /
    allProduct(req, res, next){
        //get page number
        const pageNumber = req.query.page;
        const name = (req.query.name) ? req.query.name : null;
        const brandid = (req.query.brandid) ? req.query.brandid : null;
        const cateid = (req.query.cateid) ? req.query.cateid : null;
        const genderid = (req.query.genderid) ? req.query.genderid : null;
        currentPage = (pageNumber && !Number.isNaN(pageNumber)) ? parseInt(pageNumber) : 1;
        currentPage = (currentPage > 0) ? currentPage : 1;
        currentPage = (currentPage <= totalPage) ? currentPage : totalPage
        currentPage = (currentPage < 1) ? 1 : currentPage;
        Promise.all([ ProductService.list(productPerPage, currentPage, name, brandid, cateid, genderid), ProductService.countAllItem(name, brandid, cateid, genderid)])        .then(([products, total])=>{
            totalProducts = total;
            let paginationArray = [];
            totalPage = Math.ceil(totalProducts/productPerPage);
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
            const productsLength = products.length;
            const countPro = products.map(product=>{
                return ProductService.countProductQuantity(product.proID);
            });
            const proImage = products.map(product=>{
                return ProductService.firstImageProduct(product.proID);
            });
            const proBrand = products.map(product=>{
                return ProductService.brandProduct(product.brandID);
            });
            const proCate = products.map(product=>{
                return ProductService.cateProduct(product.catID);
            });
            const proCountRating = products.map(product=>{
                return ProductService.countRatingProduct(product.proID);
            });
            const proSumRating = products.map(product=>{
                return ProductService.sumRatingProduct(product.proID);
            });
            const myPromiseArr = countPro.concat(proImage,proBrand,proCate, proCountRating, proSumRating);           
             Promise.all(myPromiseArr)
            .then(result=>{
                for(let i = 0 ; i < productsLength;i++){
                    products[i].No = (currentPage -1)*productPerPage + 1 + i;
                    products[i].quantity = result[i];
                    products[i].image = result[(productsLength)*1+i].proImage;
                    if (products[i].sex === 0) {
                        products[i].gender = "Men";
                    }
                    if (products[i].sex === 1) {
                        products[i].gender = "Women";
                    }
                    if (products[i].sex === 2) {
                        products[i].gender = "Unisex";
                    }
                    products[i].brand = result[(productsLength)*2+i].brandName;
                    products[i].category = result[(productsLength)*3+i].catName;
                    products[i].rating = (result[(productsLength)*5+i] - result[(productsLength)*5+i] % result[(productsLength)*4+i]) / result[(productsLength)*4+i];
                }
                Promise.all([ BrandService.listAll(), CategoryService.listAll()])
                .then(([brands, categories])=>{
                    res.render('product/all-product', {
                        products,
                        brands,
                        categories,
                        currentPage,
                        searchQuery: name,
                        selectBrandQuery: parseInt(brandid),
                        selectCateQuery: parseInt(cateid),
                        selectGenderQuery: parseInt(genderid),
                        paginationArray,
                        prevPage: (currentPage > 1) ? currentPage - 1 : 1,
                        nextPage: (currentPage < totalPage) ? currentPage + 1 : totalPage,
                    });
                    // console.log(brands);
                })
                .catch(err=>{
                    console.log(err);
                    next();
                })
                // res.render('product/all-product', {
                //     products,
                //     currentPage,
                //     searchQuery: name,
                //     paginationArray,
                //     prevPage: (currentPage > 1) ? currentPage - 1 : 1,
                //     nextPage: (currentPage < totalPage) ? currentPage + 1 : totalPage,
                // });
            }).catch(err=>{
                console.log(err);
                next();
            })

        })
        .catch(err=>{
            console.log(err);
            next();
        })
    }

    //[GET] /trash
    trash(req, res, next){
        res.render('product/trash-product');
    }

    //[GET] /add
    addProduct(req, res, next){
        //ProductService.insert();
        // res.render('product/add-product');
        Promise.all([ BrandService.listAll(), CategoryService.listAll()])
                .then(([brands, categories])=>{
                    res.render('product/add-product', {
                        brands,
                        categories
                    });
            })
            .catch(err=>{
                console.log(err);
                next();
        })
    }

    //[GET] /view/:id
    viewProduct(req, res, next){
        res.render('product/view-product');
    }

    //[GET] /edit/:id
    editProduct(req, res, next){
        const id = req.params.id;
        let proID = (id && !Number.isNaN(id)) ? parseInt(id) : next();
        
        
        ProductService.itemProduct(proID).then(item=>{
            // console.log(item);
            item.proDate = new Date(item.createdAt).toLocaleString("vi-VN");
            // const proImage = ProductService.imagesItemProduct(product.proID);
            const pageNumber = req.query.reviewPage;
            currentReviewPage = (pageNumber && !Number.isNaN(pageNumber)) ? parseInt(pageNumber) : 1;
            currentReviewPage = (currentReviewPage > 0) ? currentReviewPage : 1;
            currentReviewPage = (currentReviewPage <= totalReviewPage) ? currentReviewPage : totalReviewPage
            currentReviewPage = (currentReviewPage < 1) ? 1 : currentReviewPage;
            Promise.all([ 
                BrandService.listAll(), 
                CategoryService.listAll(), 
                ProductService.detailsItemProduct(proID), 
                ProductService.imagesItemProduct(proID), 
                ProductService.reviewsItemProduct(proID, reviewPerpage, currentReviewPage), 
                ProductService.countAllReview(proID)
            ])
                .then(([brands, categories, details, images, reviews, total])=>{
                    totalReviews = total;
                    let paginationArray = [];
                    totalReviewPage = Math.ceil(totalReviews/reviewPerpage);
                    let pageDisplace = Math.min(totalReviewPage - currentReviewPage + 2, maximumPagination);
                    if(currentReviewPage === 1){
                        pageDisplace -= 1;
                    }
                    for(let i = 0 ; i < pageDisplace; i++){
                        if(currentReviewPage === 1){
                            paginationArray.push({
                                page: currentReviewPage + i,
                                isCurrent:  (currentReviewPage + i)===currentReviewPage
                            });
                        }
                        else{
                            paginationArray.push({
                                page: currentReviewPage + i - 1,
                                isCurrent:  (currentReviewPage + i - 1)===currentReviewPage
                            });
                        }
                    }
                    if(pageDisplace < 2){
                        paginationArray=[];
                    }
                    item.brands=brands;
                    item.categories=categories;
                    for(let i = 0 ; i < details.length;i++){
                        details[i].No = i + 1;
                    }
                    for(let i = 0 ; i < images.length;i++){
                        images[i].No = i + 1;
                    }
                    for(let i = 0 ; i < reviews.length;i++){
                        reviews[i].date = reviews[i].createdAt.toLocaleString("vi-VN");
                    }
                    res.render('product/edit-product', {
                        item,
                        details,
                        images,
                        reviews,
                        paginationArray,
                        prevPage: (currentReviewPage > 1) ? currentReviewPage - 1 : 1,
                        nextPage: (currentReviewPage < totalReviewPage) ? currentReviewPage + 1 : totalReviewPage,
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

    //[POST] /add/product
    store(req, res, next){
        if(!req.files || req.files.length < 1){
            res.status(400);
            res.render('404', {
                layout:false,
            });
            return;
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
        let sum = 0;
        const productDetail = req.body.colors.map((item, index)=>{
            sum += parseInt(req.body.quantity[index]);
            return {
                proID: null,
                quantity: parseInt(req.body.quantity[index]),
                color: item,
            }
        });
         const product = {
            proName: req.body.proName,
            proSlug:Util.getDataSlug(req.body.proName),
            description: req.body.proDes,
            fullDescription: req.body.description,
            sold: 0,
            catID: parseInt(req.body.proCate),
            brandID: parseInt(req.body.proBrand),
            sex: parseInt(req.body.proGender),
            isFeature: req.body.proFeature ? true : false,
            price: req.body.proPrice
        }
        
        ProductService.storeProduct(product)
        .then(result=>{
            const id = result.proID;
            const nDetail = productDetail.length;
            for(let i= 0 ; i <nDetail ; i++){
                productDetail[i].proID = id;
            }

            ProductService.storeDetails(productDetail)
            .then(result1=>{
                let productImages=[];
                const nImage = req.files.length;
                for(let i = 0 ; i < nImage ; i++){
                    productImages.push({
                        proID:result.proID,
                        proImage: null,
                    })
                }
                const fileImage = req.files;
                // ProductService.storeImages(fileImage, productImages);
                ProductService.countImage(productImages[0].proID)
                .then(result=>{
                    let lengthImage = req.files;
                    let count = 0;
                    req.files.forEach((file, index) => {
                        const fileName = "pro" + productImages[index].proID + "_" + (index+result) + "." +file.mimetype.split("/")[1];
                        const blob = firebase.bucket.file(fileName);
                        const blobWriter = blob.createWriteStream({
                            metadata: {
                                contentType: file.mimetype
                            }
                        });
                        
                        blobWriter.on('error', (err) => {
                            console.log(err);
                            next();
                        });
                        
                        blobWriter.on('finish', () => {
                            const storage = getStorage();
                            getDownloadURL(ref(storage, fileName))
                            .then((url) => {
                                productImages[index].proImage = url;
                                ProductService.createImage(productImages[index])
                                .then(result=>{
                                    count++;
                                    if(count >= lengthImage){
                                        res.send('/products/edit/' + id);
                                    }
                                }).catch(err=>{
                                    console.log(err);
                                    next();
                                })
                            })
                            .catch((error) => {
                                console.log(error);
                                next();
                            });
                        });
                        blobWriter.end(file.buffer);
                    });
                }).catch(err=>{
                    console.log(err);
                    next();
                })
               
            })
            .catch(err=>{
                console.log(err);
                next();
            })
            
        }) .catch(err=>{
            console.log(err);
            next();
        })
       

        // const fileImage = req.files;
        // ProductService.storeProduct(product, productDetail, fileImage);
        //res.send("/products");
    }

    //[PUT] /update/detail/:id
    updateDetail(req, res, next){
        let id = req.params.id;
        if(Number.isNaN(id)){
            next();
            return;
        }
        id = parseInt(id);
        ProductService.findProduct(id)
        .then(result=>{
            let sum = 0;
            const details = req.body.detailID.map((id, index)=>{
                sum += parseInt(req.body.quantity[index])
                return {
                    detailID: id,
                    color: req.body.colors[index],
                    quantity:parseInt(req.body.quantity[index])
                }
            })
            const product = {
                proID: id,
                proName: req.body.editNameBox,
                brandID: parseInt(req.body.editBrandBox),
                catID: parseInt(req.body.editCateBox),
                proSlug: Util.getDataSlug(req.body.editNameBox),
                price: parseInt(req.body.proPrice),
                quantity: sum,
                sex: (req.body.editGenderBox),
                isFeature: req.body.editFeatureBox ==="on" ? true: false,
                description: req.body.editSubDesBox,
                fullDescription: req.body.editDesBox
            }
            ProductService.updatePrductDetail(product, details)
            .then(result=>{
                res.redirect('back');
            })
            .catch(err=>{
                next();
            })
        })
        .catch(err=>{
            console.log(err);
            next();
        })
    }

    //[PUT] /update/image/:id
    updateImage(req, res, next){
        let id = req.params.id;
        if(Number.isNaN(id)){
            next();
            return;
        }
        id = parseInt(id);
        
        let productImages = req.body.productImages;
        if(productImages){
            productImages = Array.isArray(req.body.productImages) ? req.body.productImages : [req.body.productImages];
            // if(productImages.length > 0 && !req.files){
            //     next();
            //     return;
            // }
            ProductService.deleteProductImage(productImages)
            .then(result=>{
                if(req.files){
                    req.files.forEach(file => {
                        if(!file.mimetype.startsWith('image/')){
                            res.status(415);
                            res.render('404', {
                                layout:false,
                            });
                            return;
                        }
                    });
                    const productImageLink = req.files.map(file=>{
                        return{
                            proID: id,
                            proImage:null
                        }
                    });
                    // ProductService.storeImages(req.files, productImageLink)
                    ProductService.countImage(productImageLink[0].proID)
                    .then(result=>{
                        req.files.forEach((file, index) => {
                            const fileName = "pro" + productImageLink[index].proID + "_" + (index+result) + "." +file.mimetype.split("/")[1];
                            const blob = firebase.bucket.file(fileName);
                            const blobWriter = blob.createWriteStream({
                                metadata: {
                                    contentType: file.mimetype
                                }
                            });
                            
                            blobWriter.on('error', (err) => {
                                console.log(err);
                                next();
                            });
                            
                            blobWriter.on('finish', () => {
                                const storage = getStorage();
                                getDownloadURL(ref(storage, fileName))
                                .then((url) => {
                                    productImageLink[index].proImage = url;
                                    ProductService.createImage(productImageLink[index])
                                    .then(result=>{
                                        res.send('/products/edit/' + id);
                                    }).catch(err=>{
                                        console.log(error);
                                        next();
                                    })
                                })
                                .catch((error) => {
                                    console.log(error);
                                    next();
                                });
                            });
                            blobWriter.end(file.buffer);
                        });
                    }) .catch((error) => {
                        console.log(error);
                        next();
                    });
                   
                }else{
                    res.redirect('back');
                }
            })
            .catch(err=>{
                console.log(err);
                next();
            })
        }
        else{
            if(!req.files || req.files.length < 1){
                res.redirect('back');
            }
            else{
                if(req.files){
                    req.files.forEach(file => {
                        if(!file.mimetype.startsWith('image/')){
                            res.status(415);
                            res.render('404', {
                                layout:false,
                            });
                            return;
                        }
                    });
                    const productImageLink = req.files.map(file=>{
                        return{
                            proID: id,
                            proImage:null
                        }
                    });
                    // ProductService.storeImages(req.files, productImageLink)
                    ProductService.countImage(productImageLink[0].proID)
                    .then(result=>{
                        req.files.forEach((file, index) => {
                            const fileName = "pro" + productImageLink[index].proID + "_" + (index+result) + "." +file.mimetype.split("/")[1];
                            const blob = firebase.bucket.file(fileName);
                            const blobWriter = blob.createWriteStream({
                                metadata: {
                                    contentType: file.mimetype
                                }
                            });
                            
                            blobWriter.on('error', (err) => {
                                console.log(err);
                                next();
                            });
                            
                            blobWriter.on('finish', () => {
                                const storage = getStorage();
                                getDownloadURL(ref(storage, fileName))
                                .then((url) => {
                                    productImageLink[index].proImage = url;
                                    ProductService.createImage(productImageLink[index])
                                    .then(result=>{
                                        res.send('/products/edit/' + id);
                                    }).catch(err=>{
                                        console.log(err);
                                        next();
                                    })
                                })
                                .catch((error) => {
                                    console.log(error);
                                    next();
                                });
                            });
                            blobWriter.end(file.buffer);
                        });
                    })
                    .catch(err=>{
                        console.log(err);
                        next();
                    })
                }
            }
        }
    }

    //[PUT] /update/review/:id
    updateReview(req, res, next){

    }

    //[DELETE] /delete/:id
    deleteProduct(req, res, next){
        let id = req.params.id;
        if(Number.isNaN(id)){
            next();
            return;
        }
        id = parseInt(id);
        ProductService.deleteProduct(id)
        .then((result)=>{
            res.redirect("/products");
        })
        .catch((err)=>{
            console.log(err);
            next();
        })
    }

    deleteReivew(req, res, next){
        let id = req.params.id;
        if(Number.isNaN(id)){
            next();
            return;
        }
        id = parseInt(id);
        ProductService.deleteReview(id)
        .then(result=>{
            res.redirect('back');
        })
        .catch(err=>{
            console.log(err);
            next();
        })
    }

    allProductFilter(req, res, next){
        //get page number
        const pageNumber = req.query.page;
        const name = (req.query.name) ? req.query.name : null;
        const brandid = (req.query.brandid) ? req.query.brandid : null;
        const cateid = (req.query.cateid) ? req.query.cateid : null;
        const genderid = (req.query.genderid) ? req.query.genderid : null;
        currentPage = (pageNumber && !Number.isNaN(pageNumber)) ? parseInt(pageNumber) : 1;
        currentPage = (currentPage > 0) ? currentPage : 1;
        currentPage = (currentPage <= totalPage) ? currentPage : totalPage
        currentPage = (currentPage < 1) ? 1 : currentPage;
        Promise.all([ ProductService.list(productPerPage, currentPage, name, brandid, cateid, genderid), ProductService.countAllItem(name, brandid, cateid, genderid)])        .then(([products, total])=>{
            totalProducts = total;
            let paginationArray = [];
            totalPage = Math.ceil(totalProducts/productPerPage);
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
            const productsLength = products.length;
            const countPro = products.map(product=>{
                return ProductService.countProductQuantity(product.proID);
            });
            const proImage = products.map(product=>{
                return ProductService.firstImageProduct(product.proID);
            });
            const proBrand = products.map(product=>{
                return ProductService.brandProduct(product.brandID);
            });
            const proCate = products.map(product=>{
                return ProductService.cateProduct(product.catID);
            });
            const proCountRating = products.map(product=>{
                return ProductService.countRatingProduct(product.proID);
            });
            const proSumRating = products.map(product=>{
                return ProductService.sumRatingProduct(product.proID);
            });
            const myPromiseArr = countPro.concat(proImage,proBrand,proCate, proCountRating, proSumRating);           
             Promise.all(myPromiseArr)
            .then(result=>{
                for(let i = 0 ; i < productsLength;i++){
                    products[i].No = (currentPage -1)*productPerPage + 1 + i;
                    products[i].quantity = result[i];
                    products[i].image = result[(productsLength)*1+i].proImage;
                    if (products[i].sex === 0) {
                        products[i].gender = "Men";
                    }
                    if (products[i].sex === 1) {
                        products[i].gender = "Women";
                    }
                    if (products[i].sex === 2) {
                        products[i].gender = "Unisex";
                    }
                    products[i].brand = result[(productsLength)*2+i].brandName;
                    products[i].category = result[(productsLength)*3+i].catName;
                    products[i].rating = (result[(productsLength)*5+i] - result[(productsLength)*5+i] % result[(productsLength)*4+i]) / result[(productsLength)*4+i];
                }
                res.status(200).json({
                    products,
                    currentPage,
                    searchQuery: name,
                    paginationArray,
                    prevPage: (currentPage > 1) ? currentPage - 1 : 1,
                    nextPage: (currentPage < totalPage) ? currentPage + 1 : totalPage,
                });
            }).catch(err=>{
                console.log(err);
                res.status(500).json(err);
            })
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json(err);
        })
    }

    getReview(req,res, next){
        const id = req.params.id;
        let proID;
        if(id && !Number.isNaN(id)){
            proID = parseInt(id);
        }else{
            res.status(500).json(err);
        }
        ProductService.itemProduct(proID).then(item=>{
            item.proDate = new Date(item.createdAt).toLocaleString("vi-VN");
            const pageNumber = req.query.reviewPage;
            currentReviewPage = (pageNumber && !Number.isNaN(pageNumber)) ? parseInt(pageNumber) : 1;
            currentReviewPage = (currentReviewPage > 0) ? currentReviewPage : 1;
            currentReviewPage = (currentReviewPage <= totalReviewPage) ? currentReviewPage : totalReviewPage
            currentReviewPage = (currentReviewPage < 1) ? 1 : currentReviewPage;
            Promise.all([ 
                ProductService.reviewsItemProduct(proID, reviewPerpage, currentReviewPage), 
                ProductService.countAllReview(proID)
            ])
            .then(([reviews, total])=>{
                totalReviews = total;
                let paginationArray = [];
                totalReviewPage = Math.ceil(totalReviews/reviewPerpage);
                let pageDisplace = Math.min(totalReviewPage - currentReviewPage + 2, maximumPagination);
                if(currentReviewPage === 1){
                    pageDisplace -= 1;
                }
                for(let i = 0 ; i < pageDisplace; i++){
                    if(currentReviewPage === 1){
                        paginationArray.push({
                            page: currentReviewPage + i,
                            isCurrent:  (currentReviewPage + i)===currentReviewPage
                        });
                    }
                    else{
                        paginationArray.push({
                            page: currentReviewPage + i - 1,
                            isCurrent:  (currentReviewPage + i - 1)===currentReviewPage
                        });
                    }
                }
                if(pageDisplace < 2){
                    paginationArray=[];
                }
                for(let i = 0 ; i < reviews.length;i++){
                    reviews[i].date = reviews[i].createdAt.toLocaleString("vi-VN");
                }
                res.status(200).json( {
                    reviews,
                    paginationArray,
                    prevPage: (currentReviewPage > 1) ? currentReviewPage - 1 : 1,
                    nextPage: (currentReviewPage < totalReviewPage) ? currentReviewPage + 1 : totalReviewPage,
                });
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json(err);
            })
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json(err);
        })
    }

}

module.exports = new ProductController;