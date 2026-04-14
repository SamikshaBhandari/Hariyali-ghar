const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, reviewController.addReview);

module.exports = router;