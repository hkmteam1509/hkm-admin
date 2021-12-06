const express = require('express');
const AdminController = require('../controllers/AdminController');
const router = express.Router();

router.get('/:id', AdminController.viewProfileAdmin);
router.get('/', AdminController.allAdmin);


module.exports = router;
