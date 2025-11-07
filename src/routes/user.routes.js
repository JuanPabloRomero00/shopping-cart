const express = require('express');
const router = express.Router();
const { createUserHandler, getAllUsersHandler, getUserByIdHandler } = require('../handlers/user.handler');
const authMiddleware = require('../middlewares/auth.middleware');
const rbacMiddleware = require('../middlewares/rbac.middleware');

// Ruta pública para crear un nuevo usuario
router.post('/', createUserHandler);

// Ruta protegida para obtener todos los usuarios (requiere permiso específico)
router.get('/', authMiddleware, rbacMiddleware(['read_users']), getAllUsersHandler);

// Ruta para obtener un usuario por su id (requiere permiso específico)
router.get('/:id', authMiddleware, rbacMiddleware(['read_user']), getUserByIdHandler);

module.exports = router;