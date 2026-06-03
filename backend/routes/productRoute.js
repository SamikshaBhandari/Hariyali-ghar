const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const isAdmin = (req, res, next) => {
    if (req.user && String(req.user.role).toLowerCase() === 'admin') {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: "Access Denied: Only Admin can add products"
    });
};

//all product
router.get('/', productController.getAllProducts);
router.get('/all', productController.getAllProducts);


//filter product
router.get('/filter', productController.getFilteredProduct);

//admin ley matra product add garna milney banako.
router.post('/add', authMiddleware, isAdmin, upload.single('image'), productController.addProduct);

//update product
router.put('/update/:id', authMiddleware, isAdmin, upload.single('image'), productController.updateProduct);
//delete product
router.delete('/delete/:id', authMiddleware, isAdmin, productController.deleteProduct);

//product id
router.get('/:id', productController.getProductById);

module.exports = router;