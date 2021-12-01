class OrderController{

    //[GET] /
    allOrder(req, res, next){
        res.render('order/all-order');
    }

    //[GET]/:id
    viewOrder(req, res, next){
        res.render('order/view-order');
    }

    

}

module.exports = new OrderController;