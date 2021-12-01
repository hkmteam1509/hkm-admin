
const express = require('express');
const router = express.Router();

const OrderController = require('../controllers/OrderController');

router.get('/view/:id', OrderController.viewOrder);
router.get('/', OrderController.allOrder);

module.exports = router;
