const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

const orderController = require('../controllers/orderController');

router.post('/place', authMiddleware, orderController.placeOrder);
router.get('/myorders', authMiddleware, orderController.getMyOrders);
router.get('/details/:id', authMiddleware, orderController.getOrderDetails);
router.put('/cancel/:id', authMiddleware, orderController.cancelOrder);

module.exports = router;