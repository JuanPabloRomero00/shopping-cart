const express = require('express');
const router = express.Router();
const {
  createRoleHandler,
  getRolesHandler,
  assignPermissionHandler,
  removePermissionHandler,
} = require('../handlers/roles.handler');

router.post('/', createRoleHandler);
router.get('/', getRolesHandler);
router.post('/assign', assignPermissionHandler);
router.post('/remove', removePermissionHandler);

module.exports = router;