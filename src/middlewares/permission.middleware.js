const { verifyToken } = require('../token');
const Permission = require('../models/permission');

const permissionMiddleware = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }

      const decoded = verifyToken(token, process.env.JWT_SECRET);
      req.user = decoded;

      await req.user.populate({
        path: 'roles',
        populate: {
          path: 'permissions',
          model: 'Permission',
        },
      });

      const hasPermission = req.user.roles.some((role) =>
        role.permissions.some((perm) => perm.name === requiredPermission)
      );

      if (!hasPermission) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }

      next();
    } catch (error) {
      console.error('Error in permission middleware:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = permissionMiddleware;