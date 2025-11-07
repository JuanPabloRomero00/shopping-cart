const errorMiddleware = (err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);

  // Manejo de errores específicos
  if (err.message.includes('El email ya está registrado')) {
    return res.status(400).json({
      success: false,
      message: 'El email ya está registrado. Por favor, usa otro.',
    });
  }

  if (err.message.includes('Credenciales inválidas')) {
    return res.status(401).json({
      success: false,
      message: 'Email o contraseña incorrectos.',
    });
  }

  if (err.message.includes('Token inválido o expirado')) {
    return res.status(401).json({
      success: false,
      message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
    });
  }

  if (err.message.includes('Acceso denegado')) {
    return res.status(403).json({
      success: false,
      message: 'No tienes permisos para realizar esta acción.',
    });
  }

  if (err.message.includes('Rol no encontrado')) {
    return res.status(404).json({
      success: false,
      message: 'El rol especificado no existe.',
    });
  }

  if (err.message.includes('Permiso no encontrado')) {
    return res.status(404).json({
      success: false,
      message: 'El permiso especificado no existe.',
    });
  }

  // Manejo genérico de errores
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
};

module.exports = errorMiddleware;