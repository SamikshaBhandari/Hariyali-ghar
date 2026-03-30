const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/all', productController.getAllProducts);

router.post('/add', productController.addProduct);

module.exports = router;