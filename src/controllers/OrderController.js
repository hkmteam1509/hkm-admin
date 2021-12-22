const OrderService = require('../services/OrderService');
const ProductService = require('../services/ProductService');
const BrandService = require('../services/BrandService');
const CategoryService = require('../services/CategoryService');

const orderPerPage = 5;
const maximumPagination = 5;
let currentPage = 1;
let totalPage = 1;

const itemPerpage = 1;
let currentItemPage = 1
let totalItemPage = 1;
let totalItems = 0;

class OrderController{

    //[GET] /
    allOrder(req, res, next){
        const pageNumber = req.query.page;
        currentPage = (pageNumber && !Number.isNaN(pageNumber)) ? parseInt(pageNumber) : 1;
        currentPage = (currentPage > 0) ? currentPage : 1;
        currentPage = (currentPage <= totalPage) ? currentPage : totalPage
        currentPage = (currentPage < 1) ? 1 : currentPage;

        Promise.all([OrderService.list(orderPerPage,currentPage),OrderService.countOrder()])
        .then(([orders,total])=>{
            
            let totalOrder = total;
            let paginationArray = [];
            totalPage = Math.ceil(totalOrder/orderPerPage);
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
            const ordersLength = orders.length;

            const orderers = orders.map(order=>{
                return OrderService.ordererName(order.userID);
            });
            Promise.all(orderers)
            .then(result=>{
                for(let i = 0 ; i  < ordersLength; i++){
                    orders[i].No = (currentPage -1)*orderPerPage + 1 + i;
                    const date = new Date(orders[i].createdAt);
                    if (!isNaN(date.getTime())) {
                        let d = date.getDate();
                        let m = date.getMonth() + 1;
                        let y = date.getFullYear();
                        orders[i].orderDate = d + '/' + m + '/' + y;
                    }
                    orders[i].orderer = result[i].f_firstname + " " + result[i].f_lastname;
                }
                res.render('order/all-order',{
                    orders,
                    currentPage,
                    paginationArray,
                    prevPage: (currentPage > 1) ? currentPage - 1 : 1,
                    nextPage: (currentPage < totalPage) ? currentPage + 1 : totalPage,});
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

    //[GET]/:id
    viewOrder(req, res, next){
        const id = req.params.id;
        let orderid = (id && !Number.isNaN(id)) ? parseInt(id) : next();

        Promise.all([OrderService.findOrder(orderid)])
        .then(([order])=>{
            const pageNumber = req.query.itemPage;
            currentItemPage = (pageNumber && !Number.isNaN(pageNumber)) ? parseInt(pageNumber) : 1;
            currentItemPage = (currentItemPage > 0) ? currentItemPage : 1;
            currentItemPage = (currentItemPage <= totalItemPage) ? currentItemPage : totalItemPage
            currentItemPage = (currentItemPage < 1) ? 1 : currentItemPage;

            Promise.all([OrderService.ordererName(order.userID), OrderService.orderDetailList(orderid, itemPerpage, currentItemPage), OrderService.countAllDetail(orderid)])
            .then(([orderername, items, total])=>{
                totalItems = total;
                let paginationArray = [];
                totalItemPage = Math.ceil(totalItems/itemPerpage);
                let pageDisplace = Math.min(totalItemPage - currentItemPage + 2, maximumPagination);
                if(currentItemPage === 1){
                    pageDisplace -= 1;
                }
                for(let i = 0 ; i < pageDisplace; i++){
                    if(currentItemPage === 1){
                        paginationArray.push({
                            page: currentItemPage + i,
                            isCurrent:  (currentItemPage + i)===currentItemPage
                        });
                    }
                    else{
                        paginationArray.push({
                            page: currentItemPage + i - 1,
                            isCurrent:  (currentItemPage + i - 1)===currentItemPage
                        });
                    }
                }

                
                if(pageDisplace < 2){
                    paginationArray=[];
                }

                const products = items.map(item=>{
                    return ProductService.itemProduct(item.proID);
                });

                const detailPro = items.map(item=>{
                    return OrderService.findDetailItem(item.detailID);
                });

                const imgPro = items.map(item=>{
                    return ProductService.firstImageProduct(item.proID);
                });

                const myPromiseArr = products.concat(detailPro, imgPro);

                Promise.all(myPromiseArr)
                .then(result=>{
                    Promise.all([BrandService.listAll(), CategoryService.listAll()])
                    .then(([brands, categories])=>{
                        const itemsLength = items.length;
                        for(let i = 0 ; i  < itemsLength; i++){
                            items[i].No = (currentItemPage -1)*itemPerpage + 1 + i;
                            items[i].proName = result[i].proName;
                            items[i].img = result[(itemsLength)*2+i].proImage;
                            items[i].color = result[(itemsLength)*1+i].color;
                            items[i].brand = result[i].brandID;
                            items[i].cate = result[i].catID;
                            items[i].gender = result[i].sex;
                            items[i].unitPrice = result[i].price;
                            items[i].totalPrice = result[i].price * items[i].quantity;
                        }
                        order.orderer = orderername.f_firstname + " " + orderername.f_lastname;
                        res.render('order/view-order',{
                            order,
                            items,
                            brands,
                            categories,
                            paginationArray,
                            prevPage: (currentItemPage > 1) ? currentItemPage - 1 : 1,
                            nextPage: (currentItemPage < totalItemPage) ? currentItemPage + 1 : totalItemPage
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

    //[PUT]/:id
    editStatusOrder(req, res, next){
        let id = req.params.id;
        if(Number.isNaN(id)){
            next();
            return;
        }
        id = parseInt(id);
        const status = req.body.statusBox;
        console.log(status);
        OrderService.updateStatusOrder(id, status)
        .then(result=>{
            res.redirect('back');
        })
        .catch(err=>{
            console.log(err);
            next();
        })
    }
}

module.exports = new OrderController;