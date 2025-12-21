const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticateToken = require('../middleware/auth');
const { cartValidation } = require('../middleware/validator');

router.get('/', authenticateToken, cartController.getCart);

router.post('/add', authenticateToken, cartValidation, cartController.addToCart);

router.put('/update/:id', authenticateToken, cartController.updateCartItem);

router.delete('/remove/:id', authenticateToken, cartController.removeFromCart);

router.delete('/clear', authenticateToken, cartController.clearCart);

module.exports = router;
