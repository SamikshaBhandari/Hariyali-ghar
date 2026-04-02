const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware } = require('../middleware/authMiddleware');

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "Access Denied: Only Admin can add products"
        });
    }
};
router.get('/all', productController.getAllProducts);
//admin ley matra product add garna milney banako.
router.post('/add', authMiddleware, isAdmin, productController.addProduct);

module.exports = router;