const rolesService = require('../services/roles.service');

const createRoleHandler = async (req, res, next) => {
  try {
    const { name, permissions } = req.body;
    const role = await rolesService.createRole(name, permissions);
    res.status(201).json({ success: true, role });
  } catch (error) {
    next(error);
  }
};

const getRolesHandler = async (req, res, next) => {
  try {
    const roles = await rolesService.getRoles();
    res.status(200).json({ success: true, roles });
  } catch (error) {
    next(error);
  }
};

const assignPermissionHandler = async (req, res, next) => {
  try {
    const { roleName, permissionName } = req.body;
    const updatedRole = await rolesService.assignPermissionToRole(roleName, permissionName);
    res.status(200).json({ success: true, role: updatedRole });
  } catch (error) {
    next(error);
  }
};

const removePermissionHandler = async (req, res, next) => {
  try {
    const { roleName, permissionName } = req.body;
    const updatedRole = await rolesService.removePermissionFromRole(roleName, permissionName);
    res.status(200).json({ success: true, role: updatedRole });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoleHandler,
  getRolesHandler,
  assignPermissionHandler,
  removePermissionHandler,
};