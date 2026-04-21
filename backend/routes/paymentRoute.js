const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/esewa-initiate', authMiddleware, paymentController.initiateEsewaPayment);
module.exports = router;