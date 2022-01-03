const express = require('express');
const AdminController = require('../controllers/AdminController');
const router = express.Router();

router.get('/add-admin', AdminController.addAdmin);
router.get('/filter', AdminController.allAdminFilter);
router.get('/:id', AdminController.viewProfileAdmin);
router.get('/', AdminController.allAdmin);
router.post('/add-admin', AdminController.createAdmin);

module.exports = router;
