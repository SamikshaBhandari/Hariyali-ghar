const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const orderController = require('../controllers/orderController');

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "Access Denied:Only Admin can access this page."
        });
    }
};

router.post('/place', authMiddleware, orderController.placeOrder);
router.get('/myorders', authMiddleware, orderController.getMyOrders);
router.get('/details/:id', authMiddleware, orderController.getOrderDetails);
router.put('/cancel/:id', authMiddleware, orderController.cancelOrder);
router.get('/admin/all', authMiddleware, isAdmin, orderController.getAllOrdersForAdmin);
router.put('/update/:id', authMiddleware, isAdmin, orderController.updateOrderStatus);
module.exports = router;