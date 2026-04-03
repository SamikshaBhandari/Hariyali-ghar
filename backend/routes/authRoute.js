const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.get('/tokenverification', authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: "token validate successfull"
    })
});

router.post('/emailverification', authController.verifyEmail);

module.exports = router;