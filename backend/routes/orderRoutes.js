const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateToken = require('../middleware/auth');
const { orderValidation } = require('../middleware/validator');

router.post('/cod', authenticateToken, orderValidation, orderController.createCODOrder);

router.post('/razorpay/create', authenticateToken, orderController.createRazorpayOrder);

router.post('/razorpay/verify', authenticateToken, orderController.verifyRazorpayPayment);

router.get('/my-orders', authenticateToken, orderController.getMyOrders);

router.get('/:id', authenticateToken, orderController.getOrderById);

module.exports = router;
