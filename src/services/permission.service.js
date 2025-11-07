const Permission = require('../models/permission');

const createPermission = async (name) => {
  const permission = new Permission({ name });
  return await permission.save();
};

const getPermissions = async () => {
  return await Permission.find();
};

const deletePermission = async (id) => {
  return await Permission.findByIdAndDelete(id);
};

module.exports = {
  createPermission,
  getPermissions,
  deletePermission,
};