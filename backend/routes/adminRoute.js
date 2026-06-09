const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/authMiddleware');

const isAdmin = (req, res, next) => {
    if (req.user && String(req.user.role).toLowerCase() === 'admin') {
        return next();
    }
    return res.status(403).json({ success: false, message: "Access Denied" });
};

router.get('/users', authMiddleware, isAdmin, adminController.getAllUsers);
router.post('/toggle-status', authMiddleware, isAdmin, adminController.toggleUserStatus);

module.exports = router;