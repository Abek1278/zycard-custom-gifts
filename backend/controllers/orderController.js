const db = require('../config/database');
const { generateOrderNumber } = require('../utils/orderNumber');
const Razorpay = require('razorpay');
const crypto = require('crypto');

let razorpayInstance = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  console.log('Razorpay initialized successfully');
} else {
  console.warn('Razorpay credentials not found. Only COD will be available.');
}

const createCODOrder = async (req, res) => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const { shippingAddress } = req.body;

    const cartResult = await client.query(
      `SELECT product_id, product_name, product_image, product_price, quantity
       FROM cart_items
       WHERE user_id = $1`,
      [req.userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    const cartItems = cartResult.rows;
    const totalAmount = cartItems.reduce((sum, item) =>
      sum + (parseFloat(item.product_price) * item.quantity), 0
    );

    const shippingFee = totalAmount >= 999 ? 0 : 79;
    const grandTotal = totalAmount + shippingFee;

    const orderNumber = generateOrderNumber();

    const orderResult = await client.query(
      `INSERT INTO orders (order_number, user_id, total_amount, shipping_fee, grand_total,
        payment_method, payment_status, order_status, shipping_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, order_number, total_amount, shipping_fee, grand_total,
         payment_method, payment_status, order_status, created_at`,
      [orderNumber, req.userId, totalAmount, shippingFee, grandTotal,
       'cod', 'pending', 'pending', JSON.stringify(shippingAddress)]
    );

    const order = orderResult.rows[0];

    for (const item of cartItems) {
      const subtotal = parseFloat(item.product_price) * item.quantity;
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image,
          product_price, quantity, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [order.id, item.product_id, item.product_name, item.product_image,
         item.product_price, item.quantity, subtotal]
      );
    }

    await client.query('DELETE FROM cart_items WHERE user_id = $1', [req.userId]);

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        id: order.id,
        orderNumber: order.order_number,
        totalAmount: parseFloat(order.total_amount),
        shippingFee: parseFloat(order.shipping_fee),
        grandTotal: parseFloat(order.grand_total),
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        orderStatus: order.order_status,
        createdAt: order.created_at
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create COD order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  } finally {
    client.release();
  }
};

const createRazorpayOrder = async (req, res) => {
  try {
    if (!razorpayInstance) {
      return res.status(503).json({
        success: false,
        message: 'Razorpay is not configured. Please use COD payment method.'
      });
    }

    const cartResult = await db.query(
      `SELECT product_id, product_name, product_price, quantity
       FROM cart_items
       WHERE user_id = $1`,
      [req.userId]
    );

    if (cartResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    const cartItems = cartResult.rows;
    const totalAmount = cartItems.reduce((sum, item) =>
      sum + (parseFloat(item.product_price) * item.quantity), 0
    );

    const shippingFee = totalAmount >= 999 ? 0 : 79;
    const grandTotal = totalAmount + shippingFee;

    const options = {
      amount: Math.round(grandTotal * 100),
      currency: 'INR',
      receipt: generateOrderNumber()
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay order',
      error: error.message
    });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, shippingAddress } = req.body;

    if (!razorpayInstance) {
      await client.query('ROLLBACK');
      return res.status(503).json({
        success: false,
        message: 'Razorpay is not configured'
      });
    }

    const sign = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpaySignature !== expectedSignature) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    const cartResult = await client.query(
      `SELECT product_id, product_name, product_image, product_price, quantity
       FROM cart_items
       WHERE user_id = $1`,
      [req.userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    const cartItems = cartResult.rows;
    const totalAmount = cartItems.reduce((sum, item) =>
      sum + (parseFloat(item.product_price) * item.quantity), 0
    );

    const shippingFee = totalAmount >= 999 ? 0 : 79;
    const grandTotal = totalAmount + shippingFee;

    const orderNumber = generateOrderNumber();

    const orderResult = await client.query(
      `INSERT INTO orders (order_number, user_id, total_amount, shipping_fee, grand_total,
        payment_method, payment_status, order_status, razorpay_order_id, razorpay_payment_id,
        razorpay_signature, shipping_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id, order_number, total_amount, shipping_fee, grand_total,
         payment_method, payment_status, order_status, created_at`,
      [orderNumber, req.userId, totalAmount, shippingFee, grandTotal,
       'razorpay', 'paid', 'processing', razorpayOrderId, razorpayPaymentId,
       razorpaySignature, JSON.stringify(shippingAddress)]
    );

    const order = orderResult.rows[0];

    for (const item of cartItems) {
      const subtotal = parseFloat(item.product_price) * item.quantity;
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image,
          product_price, quantity, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [order.id, item.product_id, item.product_name, item.product_image,
         item.product_price, item.quantity, subtotal]
      );
    }

    await client.query('DELETE FROM cart_items WHERE user_id = $1', [req.userId]);

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Payment verified and order placed successfully',
      order: {
        id: order.id,
        orderNumber: order.order_number,
        totalAmount: parseFloat(order.total_amount),
        shippingFee: parseFloat(order.shipping_fee),
        grandTotal: parseFloat(order.grand_total),
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        orderStatus: order.order_status,
        createdAt: order.created_at
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Verify Razorpay payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  } finally {
    client.release();
  }
};

const getMyOrders = async (req, res) => {
  try {
    const ordersResult = await db.query(
      `SELECT id, order_number, total_amount, shipping_fee, grand_total,
        payment_method, payment_status, order_status, shipping_address, created_at
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.userId]
    );

    const orders = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await db.query(
          `SELECT product_id, product_name, product_image, product_price, quantity, subtotal
           FROM order_items
           WHERE order_id = $1`,
          [order.id]
        );

        return {
          id: order.id,
          orderNumber: order.order_number,
          totalAmount: parseFloat(order.total_amount),
          shippingFee: parseFloat(order.shipping_fee),
          grandTotal: parseFloat(order.grand_total),
          paymentMethod: order.payment_method,
          paymentStatus: order.payment_status,
          orderStatus: order.order_status,
          shippingAddress: order.shipping_address,
          createdAt: order.created_at,
          items: itemsResult.rows.map(item => ({
            productId: item.product_id,
            productName: item.product_name,
            productImage: item.product_image,
            productPrice: parseFloat(item.product_price),
            quantity: item.quantity,
            subtotal: parseFloat(item.subtotal)
          }))
        };
      })
    );

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const orderResult = await db.query(
      `SELECT id, order_number, total_amount, shipping_fee, grand_total,
        payment_method, payment_status, order_status, shipping_address, created_at
       FROM orders
       WHERE id = $1 AND user_id = $2`,
      [id, req.userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    const itemsResult = await db.query(
      `SELECT product_id, product_name, product_image, product_price, quantity, subtotal
       FROM order_items
       WHERE order_id = $1`,
      [order.id]
    );

    res.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        totalAmount: parseFloat(order.total_amount),
        shippingFee: parseFloat(order.shipping_fee),
        grandTotal: parseFloat(order.grand_total),
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        orderStatus: order.order_status,
        shippingAddress: order.shipping_address,
        createdAt: order.created_at,
        items: itemsResult.rows.map(item => ({
          productId: item.product_id,
          productName: item.product_name,
          productImage: item.product_image,
          productPrice: parseFloat(item.product_price),
          quantity: item.quantity,
          subtotal: parseFloat(item.subtotal)
        }))
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

module.exports = {
  createCODOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getMyOrders,
  getOrderById
};
