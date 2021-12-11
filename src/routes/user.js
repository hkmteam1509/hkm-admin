const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');

router.get('/:id', UserController.viewProfileUser);
router.get('/', UserController.allUser);


module.exports = router;
