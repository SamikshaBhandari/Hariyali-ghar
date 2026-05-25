const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/esewa-initiate', authMiddleware, paymentController.initiateEsewaPayment);

router.route('/esewa-verify')
    .get(paymentController.verifyEsewaPayment)
    .post(paymentController.verifyEsewaPayment);
module.exports = router;