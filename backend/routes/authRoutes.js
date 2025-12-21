const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');
const { signupValidation, loginValidation } = require('../middleware/validator');

router.post('/signup', signupValidation, authController.signup);

router.post('/login', loginValidation, authController.login);

router.post('/google-login', authController.googleLogin);

router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;
