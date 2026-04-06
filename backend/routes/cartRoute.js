const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/authMiddleware');

//Add item
router.post('/add', authMiddleware, cartController.addToCart);
//get all item
router.get('/all', authMiddleware, cartController.getCart);
//Update item 
router.put('/update', authMiddleware, cartController.updateCartQuantity);
//delete item
router.delete('/remove/:id', authMiddleware, cartController.removeFromCart);

module.exports = router;