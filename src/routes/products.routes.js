const express = require('express');
const router = express.Router();
const { createProductHandler, getProductsHandler, deleteProductHandler, updateProductHandler } = require('../handlers/products.handler');
const { getAllProductsPublicHandler, getAllProductsHandler } = require('../handlers/products.handler');
const authMiddleware = require('../middlewares/auth.middleware');
const rbacMiddleware = require('../middlewares/rbac.middleware');

// Ruta para crear un producto (solo para sellers y admins)
router.post('/', authMiddleware, rbacMiddleware(['create_product']), createProductHandler);

// Ruta para obtener productos (solo autenticados)
router.get('/', authMiddleware, getProductsHandler);

// Ruta pública para clientes (sin autenticación)
router.get('/public', getAllProductsPublicHandler);

// Ruta para admin obtener todos los productos
router.get('/all', authMiddleware, getAllProductsHandler);

// Ruta para eliminar un producto (solo admin y seller que lo creo)
router.delete('/:id', authMiddleware, rbacMiddleware(['delete_product']), deleteProductHandler);

// Ruta para editar un producto (solo admin y seller que lo creó)
router.put('/:id', authMiddleware, rbacMiddleware(['update_product']), updateProductHandler);

module.exports = router;