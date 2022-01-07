const express = require('express');
const router = express.Router();
const multer  = require('multer');
//const upload = multer({ dest: './src/public/images/upload/' });
const upload = multer({  storage: multer.memoryStorage() });

const ProductController = require('../controllers/ProductController');

router.delete('/edit/review/:id', ProductController.deleteReivew);
router.delete('/delete/:id', ProductController.deleteProduct);
router.get('/view/:id', ProductController.viewProduct);
router.put('/edit/image/:id',upload.any(), ProductController.updateImage);
router.put('/edit/detail/:id', ProductController.updateDetail);
router.get('/edit/:id/review', ProductController.getReview);
router.get('/edit/:id', ProductController.editProduct);
router.get('/bin', ProductController.trash);
router.post('/store',upload.any(), ProductController.store);
router.get('/add', ProductController.addProduct);
router.get('/filter', ProductController.allProductFilter);
router.get('/', ProductController.allProduct);

module.exports = router;
