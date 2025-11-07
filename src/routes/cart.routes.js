const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {
  getCartHandler,
  addToCartHandler,
  removeFromCartHandler,
  deleteCartHandler,
  getAllCartsHandler
} = require('../handlers/cart.handler');

router.get('/', authMiddleware, getCartHandler);
router.post('/', authMiddleware, addToCartHandler);
router.delete('/:productId', authMiddleware, removeFromCartHandler);
router.delete('/', authMiddleware, deleteCartHandler);

// Ruta para admin obtener todos los carritos
router.get('/all', authMiddleware, getAllCartsHandler);

module.exports = router;
