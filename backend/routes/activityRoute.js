const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/orders', authMiddleware, activityController.getUserOrders);
router.get('/reviews', authMiddleware, activityController.getUserReviews);

module.exports = router;