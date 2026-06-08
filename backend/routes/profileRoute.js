const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/me', authMiddleware, profileController.getProfile);
router.put('/update', authMiddleware, profileController.updateProfile);
router.delete('/delete-account', authMiddleware, profileController.deleteAccount);

module.exports = router;