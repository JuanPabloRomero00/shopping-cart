const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getCart = async (userId) => {
  return await Cart.findOne({ user: userId }).populate('products.product');
};

exports.addToCart = async (userId, productId, quantity = 1) => {
  console.log('[DEBUG] addToCart called with:', { userId, productId, quantity });
  
  // Valida que el producto exista
  const product = await Product.findById(productId);
  if (!product) throw new Error('Producto no encontrado.');

  let cart = await Cart.findOne({ user: userId });
  console.log('[DEBUG] Existing cart:', cart);
  
  if (!cart) {
    // Si no existe el carrito, lo crea
    console.log('[DEBUG] Creating new cart');
    cart = new Cart({
      user: userId,
      products: [{ product: productId, quantity }]
    });
  } else {
    // Si existe, actualiza cantidad o agrega producto
    const item = cart.products.find(p => p.product.toString() === productId);
    if (item) {
      console.log('[DEBUG] Product exists in cart, updating quantity from', item.quantity, 'to', item.quantity + quantity);
      item.quantity += quantity;
    } else {
      console.log('[DEBUG] Adding new product to existing cart');
      cart.products.push({ product: productId, quantity });
    }
  }
  
  await cart.save();
  const populatedCart = await cart.populate('products.product');
  console.log('[DEBUG] Final cart:', populatedCart);
  
  return populatedCart;
};

exports.removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error('Carrito no encontrado.');

  cart.products = cart.products.filter(p => p.product.toString() !== productId);
  if (cart.products.length === 0) {
    // Si no quedan productos, elimina el carrito
    await Cart.deleteOne({ _id: cart._id });
    return null;
  } else {
    await cart.save();
    return await cart.populate('products.product');
  }
};

exports.deleteCart = async (userId) => {
  await Cart.deleteOne({ user: userId });
  return true;
};

exports.getAllCarts = async () => {
  return await Cart.find()
    .populate('user', 'name email')
    .populate('products.product', 'name price');
};