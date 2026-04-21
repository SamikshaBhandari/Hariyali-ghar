const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/esewa-initiate', authMiddleware, paymentController.initiateEsewaPayment);

router.post('/esewa-verify', paymentController.verifyEsewaPayment);
module.exports = router;