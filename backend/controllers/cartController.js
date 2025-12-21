const db = require('../config/database');

const getCart = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, product_id, product_name, product_image, product_price, quantity, created_at, updated_at
       FROM cart_items
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.userId]
    );

    const cartItems = result.rows.map(item => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      productImage: item.product_image,
      productPrice: parseFloat(item.product_price),
      quantity: item.quantity,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));

    const total = cartItems.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);

    res.json({
      success: true,
      cart: cartItems,
      total: total,
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, productName, productImage, productPrice, quantity = 1 } = req.body;

    const existingItem = await db.query(
      'SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [req.userId, productId]
    );

    let result;

    if (existingItem.rows.length > 0) {
      const newQuantity = existingItem.rows[0].quantity + quantity;
      result = await db.query(
        `UPDATE cart_items
         SET quantity = $1, updated_at = now()
         WHERE id = $2
         RETURNING id, product_id, product_name, product_image, product_price, quantity`,
        [newQuantity, existingItem.rows[0].id]
      );
    } else {
      result = await db.query(
        `INSERT INTO cart_items (user_id, product_id, product_name, product_image, product_price, quantity)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, product_id, product_name, product_image, product_price, quantity`,
        [req.userId, productId, productName, productImage, productPrice, quantity]
      );
    }

    const cartItem = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      cartItem: {
        id: cartItem.id,
        productId: cartItem.product_id,
        productName: cartItem.product_name,
        productImage: cartItem.product_image,
        productPrice: parseFloat(cartItem.product_price),
        quantity: cartItem.quantity
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const result = await db.query(
      `UPDATE cart_items
       SET quantity = $1, updated_at = now()
       WHERE id = $2 AND user_id = $3
       RETURNING id, product_id, product_name, product_image, product_price, quantity`,
      [quantity, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    const cartItem = result.rows[0];

    res.json({
      success: true,
      message: 'Cart updated',
      cartItem: {
        id: cartItem.id,
        productId: cartItem.product_id,
        productName: cartItem.product_name,
        productImage: cartItem.product_image,
        productPrice: parseFloat(cartItem.product_price),
        quantity: cartItem.quantity
      }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart',
      error: error.message
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
};

const clearCart = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM cart_items WHERE user_id = $1',
      [req.userId]
    );

    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
