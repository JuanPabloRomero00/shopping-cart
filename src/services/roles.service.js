const Role = require('../models/role');
const Permission = require('../models/permission');

const createRole = async (name, permissions = []) => {
  const permissionDocs = await Permission.find({ name: { $in: permissions } });
  const role = new Role({ name, permissions: permissionDocs.map((perm) => perm._id) });
  return await role.save();
};

const getRoles = async () => {
  return await Role.find().populate('permissions');
};

const removeRole = async (roleId) => {
  return await Role.findByIdAndDelete(roleId);
}

const assignPermissionToRole = async (roleName, permissionName) => {
  const role = await Role.findOne({ name: roleName });
  if (!role) throw new Error('Role not found');

  const permission = await Permission.findOne({ name: permissionName });
  if (!permission) throw new Error('Permission not found');

  if (role.permissions.includes(permission._id)) {
    throw new Error('Permission already assigned to role');
  }

  role.permissions.push(permission._id);
  return await role.save();
};

const removePermissionFromRole = async (roleName, permissionName) => {
  const role = await Role.findOne({ name: roleName });
  if (!role) throw new Error('Role not found');

  const permission = await Permission.findOne({ name: permissionName });
  if (!permission) throw new Error('Permission not found');

  role.permissions = role.permissions.filter((permId) => !permId.equals(permission._id));
  return await role.save();
};

module.exports = {
  createRole,
  getRoles,
  assignPermissionToRole,
  removePermissionFromRole,
  removeRole,
};