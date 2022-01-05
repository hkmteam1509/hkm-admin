
const express = require('express');
const router = express.Router();

const OrderController = require('../controllers/OrderController');

router.get('/view/:id', OrderController.viewOrder);
router.get('/filter', OrderController.allOrderFilter);
router.get('/', OrderController.allOrder);
router.put('/view/:id', OrderController.editStatusOrder);
router.put('/', OrderController.editStatusInList);

module.exports = router;
