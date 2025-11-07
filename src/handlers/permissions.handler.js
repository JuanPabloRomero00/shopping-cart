const permissionService = require('../services/permission.service');

const createPermissionHandler = async (req, res, next) => {
  try {
    const { name } = req.body;
    const permission = await permissionService.createPermission(name);
    res.status(201).json({ success: true, permission });
  } catch (error) {
    next(error);
  }
};

const getPermissionsHandler = async (req, res, next) => {
  try {
    const permissions = await permissionService.getPermissions();
    res.status(200).json({ success: true, permissions });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPermissionHandler,
  getPermissionsHandler,
};