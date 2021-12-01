
const homeRouter = require('./home');
const productRouter = require('./product');
const userRouter = require('./user');
const brandRouter = require('./brand');
const accountRouter = require('./account');
const categoryRouter = require('./category');
const orderRouter = require('./order');
const meRouter = require('./me');
function route(app){
    app.use('/categories', categoryRouter);
    app.use('/orders', orderRouter);
    app.use('/brands', brandRouter);
    app.use('/me', meRouter);
    app.use('/account', accountRouter);
    app.use('/users', userRouter);
    app.use('/products', productRouter);
    app.use('/', homeRouter);
    app.use(function(req, res, next){
        res.status(404);
        res.render('404', {
            layout:false,
        });
    })
}

module.exports = route;
