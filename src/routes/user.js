const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');

router.get('/:role/:id', UserController.viewProfile);
router.get('/', UserController.allUser);


module.exports = router;
