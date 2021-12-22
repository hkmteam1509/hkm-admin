
const express = require('express');
const router = express.Router();

const OrderController = require('../controllers/OrderController');

router.get('/view/:id', OrderController.viewOrder);
router.get('/', OrderController.allOrder);
router.put('/view/:id', OrderController.editStatusOrder);

module.exports = router;
