const express = require('express');
const authRoutes = require('./auth.routes');
const cartRoutes = require('./cart.routes');
const permissionsRoutes = require('./permissions.routes');
const productsRoutes = require('./products.routes');
const rolesRoutes = require('./roles.routes');
const userRoutes = require('./user.routes');
const permissionMiddleware = require('../middlewares/permission.middleware');

const router = express.Router();

// Rutas de la API
router.use('/auth', authRoutes);
router.use('/cart', cartRoutes);
router.use('/permissions', permissionsRoutes); 
router.use('/products', productsRoutes);
router.use('/roles', rolesRoutes);
router.use('/users', userRoutes);


router.get('/protected-route', permissionMiddleware('read_users'), (req, res) => {
  res.json({ message: 'Access granted to protected route' });
});

module.exports = router;