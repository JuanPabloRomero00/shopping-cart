const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { 
  loginHandler, 
  registerHandler, 
  refreshTokenHandler, 
  createAdminHandler, 
  profileHandler,
  updateProfileHandler,
  changePasswordHandler
} = require('../handlers/auth.handler');

router.post('/register', registerHandler);
router.post('/login', loginHandler);
router.post('/refresh', refreshTokenHandler);
router.post('/create-admin', createAdminHandler);

// Ruta protegida para obtener el perfil del usuario
router.get('/profile', authMiddleware, profileHandler);

// Ruta protegida para actualizar perfil
router.put('/profile', authMiddleware, updateProfileHandler);

// Ruta protegida para cambiar contraseña
router.put('/change-password', authMiddleware, changePasswordHandler);

module.exports = router;