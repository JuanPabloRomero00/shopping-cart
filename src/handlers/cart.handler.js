const CartService = require('../services/cart.service');

exports.getCartHandler = async (req, res, next) => {
  try {
    const cart = await CartService.getCart(req.user._id);
    res.json({ success: true, cart: cart ? cart.products : [] });
  } catch (err) {
    next(err);
  }
};

exports.addToCartHandler = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    console.log('[DEBUG] Adding to cart:', { userId: req.user._id, productId, quantity: quantity || 1 });
    
    const cart = await CartService.addToCart(req.user._id, productId, quantity || 1);
    
    console.log('[DEBUG] Cart after adding:', cart);
    res.json({ success: true, cart: cart.products });
  } catch (err) {
    console.error('[ERROR] Add to cart failed:', err);
    next(err);
  }
};

exports.removeFromCartHandler = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await CartService.removeFromCart(req.user._id, productId);
    res.json({ success: true, cart: cart ? cart.products : [] });
  } catch (err) {
    next(err);
  }
};

exports.deleteCartHandler = async (req, res, next) => {
  try {
    await CartService.deleteCart(req.user._id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.getAllCartsHandler = async (req, res, next) => {
  try {
    const carts = await CartService.getAllCarts();
    res.json({ success: true, carts });
  } catch (err) {
    next(err);
  }
};