const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authMiddleware } = require('../middleware/authMiddleware');

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
//category add
router.post('/add', authMiddleware, isAdmin, categoryController.createCategory);
module.exports = router;