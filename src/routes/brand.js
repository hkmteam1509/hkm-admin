const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer({  storage: multer.memoryStorage() });

const BrandController = require('../controllers/BrandController');

router.get('/', BrandController.allBrand);
// router.get('/trash', BrandController.deletedBrand);
router.delete('/delete/:id', BrandController.delete);
// router.delete('/permantly-delete/:id', BrandController.permantlyDelete);
// router.post('./restore/:id', BrandController.restore);
router.put('/edit/:id', upload.any(), BrandController.update);
router.post('/store', upload.any(), BrandController.store);
module.exports = router;
