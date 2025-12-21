const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const signupValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required'),
  validateRequest
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validateRequest
];

const cartValidation = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required'),
  body('productName')
    .notEmpty()
    .withMessage('Product name is required'),
  body('productPrice')
    .isNumeric()
    .withMessage('Product price must be a number'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  validateRequest
];

const orderValidation = [
  body('shippingAddress')
    .isObject()
    .withMessage('Shipping address is required'),
  body('shippingAddress.fullName')
    .notEmpty()
    .withMessage('Full name is required'),
  body('shippingAddress.phone')
    .notEmpty()
    .withMessage('Phone number is required'),
  body('shippingAddress.address')
    .notEmpty()
    .withMessage('Address is required'),
  body('shippingAddress.pincode')
    .notEmpty()
    .withMessage('PIN code is required'),
  validateRequest
];

module.exports = {
  signupValidation,
  loginValidation,
  cartValidation,
  orderValidation,
  validateRequest
};
