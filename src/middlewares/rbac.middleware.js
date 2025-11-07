const Role = require('../models/role');

/**
 * @param {Array} requiredPermissions - Lista de permisos requeridos para la ruta.
 */
const rbacMiddleware = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ success: false, message: 'Usuario no autenticado o rol no definido' });
      }

      const userRole = req.user.role;
      const role = await Role.findById(userRole).populate('permissions');

      if (!role) {
        return res.status(403).json({ success: false, message: 'Rol no encontrado' });
      }

      const userPermissions = role.permissions.map((perm) => perm.name);

      const hasPermission = userPermissions.includes('*') || requiredPermissions.every((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({ success: false, message: 'Acceso denegado: permisos insuficientes' });
      }

      next(); 
    } catch (error) {
      next(error); 
    }
  };
};

module.exports = rbacMiddleware;